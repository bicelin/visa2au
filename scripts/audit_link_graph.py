#!/usr/bin/env python3
"""Deep internal link-graph audit for the visa2.au static site.

Checks every <a href> (plus area href) in app/**/*.html:
  1. DEAD        - internal target file does not exist on disk
  2. EN_FALLBACK - ru/fr page links to an EN page although a localized twin exists
  3. LOCALE_MISMATCH - link crosses language trees (e.g. fr page -> /ru/, ru -> /fr/)
  4. ROOT_PREFIX - absolute-path links (harmless on Pages but inconsistent w/ ./ convention)
  5. REDIRECT    - .html target is 308'd by Pages (informational, only for canonical/refs)
Also inventories external https links for live-status checking (done by a companion step).

Output: prints a summary + writes JSON report to /tmp/link_graph_report.json
"""
from __future__ import annotations
import json, os, re, sys
from urllib.parse import urlparse, unquote
from collections import defaultdict

APP = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "app")
HREF_RE = re.compile(r'<(?:a|area)\b[^>]*?href\s*=\s*["\']([^"\']*)["\']', re.I | re.S)

def lang_of(rel: str) -> str:
    parts = rel.split("/")
    if parts[0] in ("ru", "fr"):
        return parts[0]
    return "en"

def twin_candidates(path_rel: str):
    """Given a repo-relative path under app/, yield localized twin paths."""
    parts = path_rel.split("/")
    lang = parts[0] if parts[0] in ("ru", "fr") else None
    if lang:  # strip locale dir -> EN path
        yield "/".join(parts[1:])
    else:     # add locale dir
        yield "ru/" + path_rel
        yield "fr/" + path_rel

def resolve(src_rel: str, href: str) -> tuple[str | None, str]:
    """Return (repo-relative target path or None, kind)."""
    if href == "" or href.startswith(("#", "mailto:", "tel:", "javascript:", "data:")):
        return None, "nonlink"
    p = urlparse(href)
    if p.scheme in ("http", "https"):
        host = (p.hostname or "").lower()
        if host.endswith("visa2.au") or host in ("localhost", "127.0.0.1"):
            path = unquote(p.path)
        else:
            return None, "external"
    else:
        path = unquote(p.path)
    if not path:
        return None, "nonlink"
    # normalize extension: pages serve both foo.html and /foo (308)
    src_dir = os.path.dirname(src_rel)
    if path.startswith("/"):
        cand = path.lstrip("/")
        base = "app"
    else:
        cand = os.path.normpath(os.path.join(src_dir, path)).lstrip("./")
        cand = cand.removeprefix("./")
        base = "app"
    cand = os.path.normpath(cand)
    if cand.endswith("/"):
        cand += "index.html"
    # try direct file, then +.html
    for probe in (cand, cand + ".html", os.path.join(cand, "index.html")):
        if os.path.isfile(os.path.join(APP, probe)):
            return probe, "internal"
    # extensionless clean URL that has no file at all -> dead unless it maps to a 301 in _redirects
    return cand, "missing"

def main():
    files = []
    for root, dirs, fs in os.walk(APP):
        dirs[:] = [d for d in dirs if d not in ("_astro",)]
        for f in fs:
            if f.endswith(".html"):
                files.append(os.path.relpath(os.path.join(root, f), APP))
    files.sort()

    # redirect map from _redirects (path -> target path)
    redirects = {}
    redir_file = os.path.join(APP, "_redirects")
    if os.path.isfile(redir_file):
        for line in open(redir_file):
            line = line.strip()
            if not line or line.startswith("#"):
                continue
            m = line.split()
            if len(m) >= 2:
                redirects[m[0]] = m[1]

    issues = []
    externals = set()
    stats = defaultdict(int)
    link_pairs = defaultdict(set)  # src -> targets (graph)

    for rel in files:
        src_lang = lang_of(rel)
        html = open(os.path.join(APP, rel), encoding="utf-8", errors="replace").read()
        # strip <script> blocks so JS template literals don't count as links
        body = re.sub(r"<script\b.*?</script>", "", html, flags=re.S | re.I)
        # extract the language switcher block (checked separately, targets validated below)
        sw = re.search(r'<ul id="lang-menu".*?</ul>', body, flags=re.S)
        switcher_html = sw.group(0) if sw else ""
        if sw:
            body = body[:sw.start()] + body[sw.end():]
        for href in HREF_RE.findall(body):
            href_clean = href.strip()
            tgt, kind = resolve(rel, href_clean)
            stats[kind] += 1
            if kind == "external":
                externals.add(href_clean)
                continue
            if kind == "nonlink":
                continue
            if tgt is None:
                continue
            stats["internal_total"] += 1
            link_pairs[rel].add(tgt)
            tgt_lang = lang_of(tgt)
            # follow _redirects for missing
            if kind == "missing":
                clean = "/" + tgt.removesuffix(".html")
                hit = next((v for k, v in redirects.items() if clean == k or ("/" + clean.lstrip("/")) == k), None)
                if hit:
                    stats["redirected_ok"] += 1
                    continue
                issues.append({"src": rel, "href": href_clean, "type": "DEAD"})
                continue
            # locale checks
            if src_lang in ("ru", "fr"):
                twin = f"{src_lang}/{tgt}"  # same-language twin of the EN target
                if tgt_lang == "en" and twin in files:
                    issues.append({"src": rel, "href": href_clean, "resolved": tgt,
                                   "twin_exists": twin, "type": "EN_FALLBACK"})
                elif tgt_lang in ("ru", "fr") and tgt_lang != src_lang:
                    issues.append({"src": rel, "href": href_clean, "resolved": tgt,
                                   "type": "LOCALE_MISMATCH"})
            # absolute-path style note
            if href_clean.startswith("/") and not href_clean.startswith("//"):
                stats["root_prefix"] += 1
        # switcher health: intentional cross-language links, but targets must exist
        if switcher_html:
            for href in HREF_RE.findall(switcher_html):
                tgt, kind = resolve(rel, href.strip())
                if kind == "missing":
                    issues.append({"src": rel, "href": href.strip(), "type": "SWITCHER_DEAD"})

    # reachability: files not linked from anywhere (orphans), excluding legal entry pages
    linked_targets = {t for s in link_pairs.values() for t in s}
    entry_ok = {"index.html", "sitemap.xml", "404.html", "offline.html"}
    orphans = [f for f in files if f not in linked_targets and f not in entry_ok
               and not f.startswith(("blog/", "ru/blog/", "fr/blog/"))]
    # broken inbound: targets that no file has (already covered by DEAD)
    # cross-language twin coverage: which EN pages lack ru/fr twins
    en_pages = [f for f in files if lang_of(f) == "en" and f not in entry_ok]
    no_twin = []
    for f in en_pages:
        twins = [c for c in twin_candidates(f) if c in files]
        if not twins:
            no_twin.append(f)
        elif len(twins) == 1:
            no_twin.append(f + " (only " + twins[0].split("/")[0] + ")")

    report = {
        "stats": dict(stats),
        "issues": issues,
        "orphans": orphans,
        "en_pages_missing_twins": no_twin,
        "external_links": sorted(externals),
        "pages_scanned": len(files),
    }
    out = "/tmp/link_graph_report.json"
    json.dump(report, open(out, "w"), indent=1, ensure_ascii=False)

    print(f"pages: {len(files)} | internal links: {stats['internal_total']} | dead: "
          f"{sum(1 for i in issues if i['type']=='DEAD')} | en_fallback: "
          f"{sum(1 for i in issues if i['type']=='EN_FALLBACK')} | locale_mismatch: "
          f"{sum(1 for i in issues if i['type']=='LOCALE_MISMATCH')}")
    print(f"root-prefix links: {stats['root_prefix']} | via _redirects ok: {stats['redirected_ok']}")
    print(f"orphans: {len(orphans)} | EN pages w/o full ru+fr twins: {len(no_twin)} | external URLs: {len(externals)}")
    print(f"report: {out}")

if __name__ == "__main__":
    main()
