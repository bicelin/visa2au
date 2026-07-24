#!/usr/bin/env python3
"""Rewrite internal links on /ru/ and /fr/ pages so that links whose target
has a localized version point to the localized URL. Falls back to EN when no
localized version exists. Also fixes the language switcher to point at
locale-equivalent pages instead of locale homepages.
Only touches <a href="..."> attributes (never <link>, canonical, hreflang, meta).
"""
import os
import re
import posixpath

APP = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "app")
LOCALES = ("ru", "fr")
BASE = "https://visa2.au"

SKIP_SCHEMES = ("mailto:", "tel:", "#", "javascript:", "data:")

LANG_LABELS = {
    "en": re.compile(r'>\s*English\s*<'),
    "ru": re.compile(r'>\s*Русский\s*<'),
    "fr": re.compile(r'>\s*Français\s*<'),
}

HREF_RE = re.compile(r'(<a\b[^>]*?\bhref=")([^"]*)(")', re.S)


def is_html_page(p):
    return p.endswith(".html") or p == ""


def app_path_exists(rel):
    return os.path.isfile(os.path.join(APP, rel))


def resolve_rel(filedir_rel, href):
    """Resolve a relative href against the file's dir (both app-relative)."""
    return posixpath.normpath(posixpath.join(filedir_rel, href))


def rel_href(filedir_rel, target_rel):
    return posixpath.relpath(target_rel, filedir_rel) if filedir_rel else target_rel


def split_frag(href):
    m = re.match(r"^([^?#]*)([?#].*)?$", href)
    return m.group(1), (m.group(2) or "")


def rewrite_file(path, lang):
    rel = posixpath.relpath(path, APP)          # e.g. ru/visas/x.html
    filedir_rel = posixpath.dirname(rel)        # e.g. ru/visas
    html = open(path, encoding="utf-8").read()
    changes = []

    # --- language switcher: point each link at the locale-equivalent page ---
    page_under_locale = posixpath.relpath(rel, lang)  # e.g. visas/x.html

    def equiv(target_lang):
        if target_lang == "en":
            cand = page_under_locale
            home = "index.html"
        else:
            cand = posixpath.join(target_lang, page_under_locale)
            home = posixpath.join(target_lang, "index.html")
        return cand if app_path_exists(cand) else home

    equivs = {l: equiv(l) for l in ("en", "ru", "fr")}

    def fix_switcher(m):
        block = m.group(0)
        for l, label_re in LANG_LABELS.items():
            def repl(am, l=l):
                old = am.group(2)
                new = rel_href(filedir_rel, equivs[l])
                if old != new:
                    changes.append(f"switcher[{l}]: {old} -> {new}")
                return am.group(1) + new + am.group(3)
            block2 = []
            last = 0
            for am in HREF_RE.finditer(block):
                close = block.find("</a>", am.end())
                seg = block[am.end(): close if close != -1 else am.end() + 300]
                if label_re.search(seg):
                    block2.append(block[last:am.start()])
                    block2.append(repl(am))
                    last = am.end()
            block2.append(block[last:])
            block = "".join(block2)
        return block

    # Protect the switcher from the general pass (its EN link must stay EN).
    SWITCHER_TOKEN = "___LANG_MENU_BLOCK___"
    msw = re.search(r'<ul id="lang-menu".*?</ul>', html, flags=re.S)
    switcher_block = None
    if msw:
        switcher_block = msw.group(0)
        html = html[:msw.start()] + SWITCHER_TOKEN + html[msw.end():]

    # --- general internal links ---
    def fix_href(m):
        pre, href, post = m.group(1), m.group(2), m.group(3)
        if not href or href.startswith(SKIP_SCHEMES) or "${" in href:
            return m.group(0)
        if href.startswith("http://") or href.startswith("https://"):
            if not href.startswith(BASE + "/"):
                return m.group(0)
            p = href[len(BASE) + 1:]
            path_part, frag = split_frag(p)
            # already localized?
            if path_part.startswith("ru/") or path_part.startswith("fr/"):
                return m.group(0)
            loc = posixpath.join(lang, path_part)
            if is_html_page(path_part) and app_path_exists(loc):
                new = f"{BASE}/{loc}{frag}"
                changes.append(f"abs: {href} -> {new}")
                return pre + new + post
            return m.group(0)
        if href.startswith("//"):
            return m.group(0)

        path_part, frag = split_frag(href)
        if not is_html_page(path_part):
            return m.group(0)
        target = resolve_rel(filedir_rel, path_part)
        if target.startswith("../"):  # escapes app root — leave alone
            return m.group(0)

        first = target.split("/", 1)[0]
        if first in LOCALES:
            # resolves inside a locale tree already
            if app_path_exists(target):
                return m.group(0)  # valid localized link
            en = target.split("/", 1)[1]
            if first == lang and app_path_exists(en):
                # broken localized link; EN fallback exists
                new = rel_href(filedir_rel, en) + frag
                changes.append(f"broken-locale->en: {href} -> {new}")
                return pre + new + post
            return m.group(0)

        # EN-area target
        loc = posixpath.join(lang, target)
        if app_path_exists(loc):
            new = rel_href(filedir_rel, loc) + frag
            if new != href:
                changes.append(f"localize: {href} -> {new}")
                return pre + new + post
        return m.group(0)

    html = HREF_RE.sub(fix_href, html)

    if switcher_block is not None:
        switcher_block = fix_switcher(re.match(r"(?s).*", switcher_block))
        html = html.replace(SWITCHER_TOKEN, switcher_block)

    if changes:
        open(path, "w", encoding="utf-8").write(html)
    return changes


def main():
    total_files = 0
    total_changes = 0
    for lang in LOCALES:
        root = os.path.join(APP, lang)
        for dirpath, _, files in os.walk(root):
            for f in sorted(files):
                if not f.endswith(".html"):
                    continue
                p = os.path.join(dirpath, f)
                changes = rewrite_file(p, lang)
                if changes:
                    total_files += 1
                    total_changes += len(changes)
                    print(f"\n{p} ({len(changes)} changes)")
                    for c in changes:
                        print(f"   {c}")
    print(f"\n== {total_files} files modified, {total_changes} links rewritten ==")


if __name__ == "__main__":
    main()
