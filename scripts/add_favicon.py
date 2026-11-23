#!/usr/bin/env python3
"""Give every page a proper square favicon set.

Before this, pages linked the wordmark SVG as the icon:

    <link rel="icon" type="image/svg+xml" href="./v2au-logo-blue.svg">

That asset is 700x250 (2.8:1) with a tagline, so at 16px in a browser tab it collapses
into an illegible smudge and most clients fall back to a blank page icon.

Paths are ROOT-ABSOLUTE (/favicon.svg). The old relative href had to be depth-corrected
per page (./ at the root, ../../ two levels deep); absolute paths are identical at every
depth, so this stays correct without depending on other rewriters running first.

Idempotent: re-running replaces the managed block in place instead of appending.
"""
from __future__ import annotations

import re
import sys
from pathlib import Path

APP = Path(__file__).resolve().parent.parent / "app"

# Managed block. The FAVICON-BLOCK markers make it removable on a re-run.
START = "<!-- FAVICON-BLOCK -->"
END = "<!-- /FAVICON-BLOCK -->"

BLOCK = (
    START
    + '<link rel="icon" href="/favicon.ico" sizes="32x32">'
    + '<link rel="icon" type="image/svg+xml" href="/favicon.svg">'
    + '<link rel="apple-touch-icon" href="/apple-touch-icon.png">'
    + '<link rel="manifest" href="/site.webmanifest">'
    + END
)

# Any icon link that is not part of the managed block: the legacy wordmark link and
# anything similar. apple-touch-icon and manifest are excluded - they belong to the block.
ICON_RE = re.compile(r'<link\b[^>]*\brel="(?:shortcut icon|icon|apple-touch-icon(?:-precomposed)?)"[^>]*>', re.I)
MANIFEST_RE = re.compile(r'<link\b[^>]*\brel="manifest"[^>]*>', re.I)
MANAGED_RE = re.compile(re.escape(START) + r".*?" + re.escape(END), re.S)


def process(path: Path) -> bool:
    html = path.read_text(encoding="utf-8")
    if "</head>" not in html:
        return False

    head_end = html.index("</head>")
    head, rest = html[:head_end], html[head_end:]

    # Drop a previously managed block, then any stray icon/manifest links.
    new_head = MANAGED_RE.sub("", head)
    new_head = ICON_RE.sub("", new_head)
    new_head = MANIFEST_RE.sub("", new_head)

    new_head = new_head.rstrip() + BLOCK
    out = new_head + rest

    if out == html:
        return False
    path.write_text(out, encoding="utf-8")
    return True


def main() -> int:
    if not (APP / "favicon.svg").is_file():
        print("ERROR: app/favicon.svg missing - cannot reference it", file=sys.stderr)
        return 1

    pages = sorted(APP.rglob("*.html"))
    changed = [p for p in pages if process(p)]

    stale = []
    for p in pages:
        h = p.read_text(encoding="utf-8")
        # Only an ICON LINK pointing at the wordmark is a problem. Pages legitimately
        # reference v2au-logo-blue.svg in the header, so a plain substring test gave a
        # false positive and failed the gate.
        for tag in ICON_RE.findall(h):
            if "v2au-logo-blue" in tag:
                stale.append(p)
                break

    print(f"== favicon set: {len(changed)} of {len(pages)} pages updated")
    if stale:
        print(f"   WARNING: {len(stale)} pages still link the wordmark as an icon")
        return 1
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
