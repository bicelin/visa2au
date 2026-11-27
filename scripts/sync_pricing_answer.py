#!/usr/bin/env python3
"""Render the answer-first cost block on /pricing from fees_data.py.

Why: Google's AI Overview and AI Mode answer "partner visa cost australia" with
the right figure ($11,710 government charge) but cite Home Affairs and three
competitors — never visa2.au, because our page states the two numbers apart and
never states the total a person actually pays. This block says the total in one
sentence, using the same module that renders the pricing tables, so the figures
cannot drift.

Idempotent: the block lives between markers and is rewritten in place. A second
run rewrites 0 pages.

Usage:
    python3 scripts/sync_pricing_answer.py            # write
    python3 scripts/sync_pricing_answer.py --check     # exit 1 if stale
"""
from __future__ import annotations

import argparse
import pathlib
import re
import sys

sys.path.insert(0, str(pathlib.Path(__file__).resolve().parent))
import fees_data  # noqa: E402

APP = pathlib.Path(__file__).resolve().parent.parent / "app"
TARGET = APP / "pricing.html"
START = "<!-- answer-first:start -->"
END = "<!-- answer-first:end -->"


def money(value: str) -> int:
    return int(re.sub(r"[^\d]", "", value))


def block() -> str:
    gov_main = fees_data.PARTNER_GOV["main"]
    gov_second = fees_data.PARTNER_GOV["secondary"]
    gov_child = fees_data.PARTNER_GOV["child"]
    fee = next(f for _, _, _, f in fees_data.GROUPS["partner"] if "$" in f)
    total = money(gov_main) + money(fee)
    return f"""{START}
<section class="reveal mx-auto max-w-5xl px-4 pb-2 lg:px-8" aria-labelledby="partner-cost-answer">
  <div class="rounded-2xl border border-gold-500/30 bg-gold-500/[0.06] p-6 dark:bg-gold-500/[0.08]">
    <h2 id="partner-cost-answer" class="font-display text-xl font-bold text-navy-900 dark:text-white">What a partner visa costs, in one line</h2>
    <p class="mt-3 text-base leading-relaxed text-slate-700 dark:text-slate-200"><strong>820/801 (onshore)</strong> or <strong>309/100 (offshore)</strong>: government charge from <strong>{gov_main}</strong> plus our professional fee <strong>{fee}</strong> — from <strong>${total:,}</strong> in total before third-party costs.</p>
    <p class="mt-2 text-sm leading-relaxed text-slate-600 dark:text-slate-300">A second applicant 18 or over adds a government charge from <strong>{gov_second}</strong>; a child under 18, from <strong>{gov_child}</strong>. Health examinations, police certificates, translations and skills assessments are paid to third parties at cost and itemised in your quote.</p>
  </div>
</section>
{END}"""


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("--check", action="store_true", help="do not write; fail if the block is stale")
    args = ap.parse_args()

    html = TARGET.read_text(encoding="utf-8")
    fresh = block()

    if START in html and END in html:
        current = html[html.index(START) : html.index(END) + len(END)]
        if current == fresh:
            print("pricing answer block: up to date (0 rewritten)")
            return 0
        if args.check:
            print("pricing answer block: STALE — run scripts/sync_pricing_answer.py")
            return 1
        html = html.replace(current, fresh, 1)
        TARGET.write_text(html, encoding="utf-8")
        print("pricing answer block: rewritten (1)")
        return 0

    # first run: place it directly after the hero, before "What each visa costs"
    anchor = "the Stripe processing fee on /pay disclosed before you pay.</p> </div> </section>"
    if anchor not in html:
        print("pricing answer block: hero anchor not found — pricing.html changed shape")
        return 1
    if args.check:
        print("pricing answer block: MISSING — run scripts/sync_pricing_answer.py")
        return 1
    html = html.replace(anchor, anchor + "\n" + fresh, 1)
    TARGET.write_text(html, encoding="utf-8")
    print("pricing answer block: inserted (1)")
    return 0


if __name__ == "__main__":
    sys.exit(main())
