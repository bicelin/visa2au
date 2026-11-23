#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Inline the critical above-the-fold CSS and defer the full stylesheet.

Why: Lighthouse flags `_astro/index.<hash>.css` (100 KB raw / 27 KB br) as a
render-blocking request costing ~230 ms of LCP. Inlining the whole 100 KB into
150 pages would add ~15 MB of duplicated markup and lose cross-page caching, so
this keeps the sheet cached and only inlines what the first screen needs.

How:
1. Collect the class tokens used above the fold (header + hero of app/index.html)
   plus the element/base selectors.
2. Keep every top-level rule whose selector references one of those tokens, plus
   @font-face, :root, html/body, and @keyframes reachable from those rules.
3. Replace `<link rel="stylesheet" href=".../_astro/index.<hash>.css">` in every
   page with `<style data-v2au-critical>` + the deferred link
   (`media="print" data-defer`), flipped to `all` by js/css-defer.js on load.
   CSS is already allowed inline by the CSP (`style-src 'self' 'unsafe-inline'`).

Idempotent: a page already carrying `data-v2au-critical` is skipped.
"""
import glob
import os
import re

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
APP = os.path.join(ROOT, "app")
HOME = os.path.join(APP, "index.html")
CSS_GLOB = os.path.join(APP, "_astro", "index.*.css")
MARK = 'data-v2au-critical'


def split_css(css):
    """Split a minified stylesheet into top-level blocks (handles nesting)."""
    blocks, depth, start = [], 0, 0
    for i, ch in enumerate(css):
        if ch == "{":
            depth += 1
        elif ch == "}":
            depth -= 1
            if depth == 0:
                blocks.append(css[start:i + 1])
                start = i + 1
    tail = css[start:].strip()
    if tail:
        blocks.append(tail)
    return blocks


def above_fold_tokens(html):
    """Class tokens from the header and the hero section of the homepage."""
    head_end = html.find("</header>")
    hero_end = html.find("</section>", html.find("<main"))
    region = html[: max(head_end, hero_end) if hero_end > 0 else head_end + 8000]
    tokens = set()
    for attr in re.findall(r'class="([^"]+)"', region):
        tokens.update(attr.split())
    return tokens


def rule_selectors(block):
    """Selectors of a block: everything before the first '{' (media/pseudo wrappers included)."""
    head = block.split("{", 1)[0]
    return head


def wrapper_parts(block):
    """For `@media ...{ ... }` return (head, inner) ; otherwise (None, block)."""
    if not block.startswith("@"):
        return None, block
    head = block.split("{", 1)[0]
    if head.lstrip().startswith(("@font-face", "@keyframes", "@charset", "@import")):
        return None, block
    inner = block[len(head) + 1: -1]
    return head, inner


def reachable(block, tokens):
    head, inner = wrapper_parts(block)
    if head is None:
        sel = rule_selectors(block)
        if "@font-face" in block or "@keyframes" in block or "@charset" in block:
            return True
        if not re.search(r"\.", sel):
            return True
        for tok in tokens:
            if re.search(r"\." + re.escape(tok) + r"(?![A-Za-z0-9_-])", sel):
                return True
        return False
    kept = [b for b in split_css(inner) if reachable(b, tokens)]
    return bool(kept)


def prune(block, tokens):
    """Return the block with only reachable rules (recursing into wrappers)."""
    head, inner = wrapper_parts(block)
    if head is None:
        return block if reachable(block, tokens) else ""
    kept = "".join(prune(b, tokens) for b in split_css(inner))
    return f"{head}{{{kept}}}" if kept else ""


def main():
    css_path = sorted(glob.glob(CSS_GLOB))[-1]
    css = open(css_path, encoding="utf-8").read()
    # url(./x.woff2) resolves against the sheet; make it absolute for inline use
    inline_ready = css.replace("url(./", "url(/_astro/")
    tokens = above_fold_tokens(open(HOME, encoding="utf-8").read())
    blocks = split_css(inline_ready)
    critical_css = "".join(prune(b, tokens) for b in blocks)
    print(f"critical CSS: {len(critical_css)} bytes of {len(css)} "
          f"({len(blocks)} top-level blocks, {len(tokens)} above-fold classes)")

    css_name = os.path.basename(css_path)
    link_re = re.compile(
        r'<link rel="stylesheet" href="((?:\.{1,2}/)*)_astro/' + re.escape(css_name) + r'">'
    )
    changed = 0
    for path in glob.glob(os.path.join(APP, "**", "*.html"), recursive=True):
        html = open(path, encoding="utf-8").read()
        if MARK in html:
            continue
        m = link_re.search(html)
        if not m:
            continue
        prefix = m.group(1) or "./"
        repl = (
            f'<style {MARK}>' + critical_css + '</style>'
            f'<link rel="stylesheet" data-defer href="{prefix}_astro/{css_name}" media="print">'
        )
        out = html[:m.start()] + repl + html[m.end():]
        # the defer script must exist before first paint of the deferred sheet
        if "css-defer.js" not in out:
            out = out.replace("</head>", f'<script src="{prefix}js/css-defer.js" defer></script></head>', 1)
        open(path, "w", encoding="utf-8").write(out)
        changed += 1
    print(f"pages updated: {changed}")


if __name__ == "__main__":
    main()
