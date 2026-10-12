#!/usr/bin/env python3
"""Rewrite internal page links to their clean (extensionless) URLs.

Why: Cloudflare Pages 308-redirects /x.html -> /x. Every internal link written as
"./x.html" therefore cost the browser an extra round-trip, and internal links
pointed at a non-canonical URL while rel=canonical and sitemap.xml both already
use the clean form. Linking straight at the canonical URL is what search engines
prefer.

Rewrites, preserving any #fragment / ?query:
    ./visas.html                -> ./visas
    ../visas.html               -> ../visas
    visas.html                  -> visas
    /visas.html                 -> /visas
    https://visa2.au/visas.html -> https://visa2.au/visas
    ./index.html                -> ./
    ../index.html               -> ../
    ./sub/index.html            -> ./sub/
    /ru/index.html              -> /ru/

Never touched:
    - external hosts, mailto:/tel:/javascript:/data:/# links
    - JS template placeholders (${...}, {{...}})
    - non-.html refs (.md, .pdf, .json, .xml, images, _astro assets)
    - any ref whose target file does NOT exist on disk, so a link is never
      "cleaned" into a different broken link (that is audit_link_graph's job)
    - /404.html

Also rewrites internal ".html" string literals inside inline scripts (e.g.
window.location.href = './contact.html'). Inline-script bodies therefore change,
so this MUST run before update_csp_hashes.py, which recomputes the CSP hashes.

MUST run AFTER localize_homepage_cards.py: that step selects homepage cards by
their ".html" hrefs, so cleaning earlier would stop it localizing them.

Idempotent: re-running makes no further changes.
"""
from __future__ import annotations

import os
import posixpath
import re
import sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
APP = os.path.join(ROOT, "app")
BASE = "https://visa2.au"

HREF_RE = re.compile(r'(\bhref\s*=\s*")([^"]*)(")', re.I)
JS_STR_RE = re.compile(r'(["\'])(\.{0,2}/[^"\']*?\.html)(["\'])')
# JS template literals that BUILD an internal link, e.g. `visas/${r.slug}.html`.
# The value is not knowable statically, so strip the .html right after the
# interpolation — these are URL builders, so the extension is never meaningful.
JS_TMPL_RE = re.compile(r"(\$\{[^}]{0,80}\})\.html\b")
SPLIT_RE = re.compile(r"^([^?#]*)([?#].*)?$", re.S)

SKIP_PREFIX = ("mailto:", "tel:", "javascript:", "data:", "#", "//")


def exists(app_rel: str) -> bool:
    return os.path.isfile(os.path.join(APP, app_rel))


def _lead(stem: str) -> tuple[str, str]:
    """Split a relative path into its leading '../' run and the remainder."""
    i = 0
    while stem.startswith("../", i):
        i += 3
    return stem[:i], stem[i:]


def clean_ref(value: str):
    """(new_href, target_for_existence_check) or None to leave the ref alone."""
    if not value or value.startswith(SKIP_PREFIX):
        return None
    if "${" in value or "{{" in value:
        return None

    m = SPLIT_RE.match(value)
    if not m:
        return None
    path, suffix = m.group(1), re.sub(r"\s+", "", m.group(2) or "")
    if not path.endswith(".html") or path.endswith("/404.html") or path == "404.html":
        return None

    if path.startswith(BASE + "/"):
        stem, prefix, rootish = path[len(BASE) + 1:], BASE + "/", True
    elif path.startswith("/"):
        stem, prefix, rootish = path[1:], "/", True
    else:
        stem, prefix, rootish = path, "", False

    if stem.endswith("index.html"):
        if rootish:
            d = stem[: -len("index.html")]
            newpath = prefix + d
            if not newpath.endswith("/"):
                newpath += "/"
        else:
            lead, rest = _lead(stem)
            dirpart = rest[: -len("index.html")]
            newpath = lead + dirpart or "./"
    else:
        newpath = path[:-5]

    if newpath == path:
        return None
    return newpath + suffix, stem


def rewrite_file(path: str):
    rel = posixpath.relpath(path, APP)
    filedir = posixpath.dirname(rel)
    html = open(path, encoding="utf-8").read()
    changes = []

    def target_ok(stem: str) -> bool:
        return exists(posixpath.normpath(posixpath.join(filedir, stem)))

    def fix(m, quoted: bool):
        if quoted:
            q1, val, q2 = m.group(1), m.group(2), m.group(3)
        else:
            q1, val, q2 = m.group(1), m.group(2), m.group(3)
        r = clean_ref(val)
        if r is None:
            return m.group(0)
        newval, stem = r
        if newval == val or not target_ok(stem):
            return m.group(0)
        changes.append(f"{val} -> {newval}")
        return q1 + newval + q2

    html = HREF_RE.sub(lambda m: fix(m, False), html)
    html = JS_STR_RE.sub(lambda m: fix(m, True), html)

    def fix_tmpl(m):
        changes.append(f"tmpl: {m.group(0)} -> {m.group(1)}")
        return m.group(1)

    html = JS_TMPL_RE.sub(fix_tmpl, html)

    if changes:
        open(path, "w", encoding="utf-8").write(html)
    return changes


def main():
    files = total = 0
    for dirpath, _d, names in os.walk(APP):
        if "_astro" in dirpath or os.path.basename(dirpath).startswith("."):
            continue
        for n in sorted(names):
            if not n.endswith(".html"):
                continue
            ch = rewrite_file(os.path.join(dirpath, n))
            if ch:
                files += 1
                total += len(ch)
                if files <= 4:
                    for c in ch[:3]:
                        print(f"   {os.path.relpath(os.path.join(dirpath, n), APP)}: {c}")
    print(f"== clean internal URLs: {files} files, {total} links rewritten")
    return 0


if __name__ == "__main__":
    sys.exit(main())
