#!/usr/bin/env python3
"""Render the answer-first cost block on /pricing, /ru/pricing and /fr/pricing.

Why: Google's AI Overview and AI Mode answer "partner visa cost australia" with
the right figure ($11,710 government charge) but cite Home Affairs and three
competitors — never visa2.au, because our pages state the two amounts apart and
never state the total a person actually pays. This block says the total in one
sentence, and every figure comes from fees_data.py, the module that renders the
fee tables, so the block cannot drift from the tables or the homepage.

Idempotent: each block sits between markers and is rewritten in place, so a
second run reports 0 rewritten. `--check` fails when any locale is stale.

Usage:
    python3 scripts/sync_pricing_answer.py            # write all locales
    python3 scripts/sync_pricing_answer.py --check     # exit 1 if any locale is stale
"""
from __future__ import annotations

import argparse
import pathlib
import re
import sys

sys.path.insert(0, str(pathlib.Path(__file__).resolve().parent))
import fees_data  # noqa: E402

APP = pathlib.Path(__file__).resolve().parent.parent / "app"
START = "<!-- answer-first:start -->"
END = "<!-- answer-first:end -->"

COPY = {
    "en": {
        "path": "pricing.html",
        "h2": "What a partner visa costs, in one line",
        "lead": (
            "<strong>820/801 (onshore)</strong> or <strong>309/100 (offshore)</strong>: government charge from "
            "<strong>{gov}</strong> plus our professional fee <strong>{fee}</strong> — from <strong>{total}</strong> "
            "in total before third-party costs."
        ),
        "detail": (
            "A second applicant 18 or over adds a government charge from <strong>{second}</strong>; a child under "
            "18, from <strong>{child}</strong>. Health examinations, police certificates, translations and skills "
            "assessments are paid to third parties at cost and itemised in your quote."
        ),
    },
    "ru": {
        "path": "ru/pricing.html",
        "h2": "Сколько стоит партнёрская виза — одной строкой",
        "lead": (
            "<strong>820/801 (в Австралии)</strong> или <strong>309/100 (за рубежом)</strong>: государственный "
            "сбор от <strong>{gov}</strong> плюс наш профессиональный гонорар <strong>{fee}</strong> — от "
            "<strong>{total}</strong> в сумме, до расходов третьих сторон."
        ),
        "detail": (
            "Второй заявитель 18 лет и старше добавляет государственный сбор от <strong>{second}</strong>; "
            "ребёнок до 18 лет — от <strong>{child}</strong>. Медицинские обследования, справки полиции, "
            "переводы и оценка квалификации оплачиваются третьим сторонам по фактической стоимости и "
            "указываются в вашей смете."
        ),
    },
    "fr": {
        "path": "fr/pricing.html",
        "h2": "Combien coûte un visa partenaire, en une ligne",
        "lead": (
            "<strong>820/801 (sur place)</strong> ou <strong>309/100 (depuis l’étranger)</strong> : frais "
            "gouvernementaux à partir de <strong>{gov}</strong> plus nos honoraires professionnels de "
            "<strong>{fee}</strong> — à partir de <strong>{total}</strong> au total, avant les frais de tiers."
        ),
        "detail": (
            "Un deuxième demandeur de 18 ans ou plus ajoute des frais gouvernementaux à partir de "
            "<strong>{second}</strong> ; un enfant de moins de 18 ans, à partir de <strong>{child}</strong>. Les "
            "examens médicaux, certificats de police, traductions et évaluations des compétences sont payés aux "
            "tiers au coût réel et détaillés dans votre devis."
        ),
    },
}


def money(value: str) -> int:
    return int(re.sub(r"[^\d]", "", value))


def figures() -> dict[str, str]:
    fee = next(f for _, _, _, f in fees_data.GROUPS["partner"] if "$" in f)
    total = money(fees_data.PARTNER_GOV["main"]) + money(fee)
    return {
        "gov": fees_data.PARTNER_GOV["main"],
        "fee": fee,
        "total": f"${total:,}",
        "second": fees_data.PARTNER_GOV["secondary"],
        "child": fees_data.PARTNER_GOV["child"],
    }


def block(lang: str) -> str:
    c = COPY[lang]
    f = figures()
    return f"""{START}
<section class="reveal mx-auto max-w-5xl px-4 pb-2 lg:px-8" aria-labelledby="partner-cost-answer">
  <div class="rounded-2xl border border-gold-500/30 bg-gold-500/[0.06] p-6 dark:bg-gold-500/[0.08]">
    <h2 id="partner-cost-answer" class="font-display text-xl font-bold text-navy-900 dark:text-white">{c['h2']}</h2>
    <p class="mt-3 text-base leading-relaxed text-slate-700 dark:text-slate-200">{c['lead'].format(**f)}</p>
    <p class="mt-2 text-sm leading-relaxed text-slate-600 dark:text-slate-300">{c['detail'].format(**f)}</p>
  </div>
</section>
{END}"""


def insert_after_hero(html: str, fresh: str) -> str:
    i = html.find("<h1")
    if i < 0:
        raise ValueError("no <h1> — page shape changed")
    j = html.find("</section>", i)
    if j < 0:
        raise ValueError("hero section is not closed after <h1>")
    end = j + len("</section>")
    return html[:end] + "\n" + fresh + html[end:]


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("--check", action="store_true", help="do not write; fail if any locale is stale")
    args = ap.parse_args()

    stale, written, inserted = [], [], []
    for lang, copy in COPY.items():
        path = APP / copy["path"]
        if not path.exists():
            stale.append(f"{lang}: missing {copy['path']}")
            continue
        html = path.read_text(encoding="utf-8")
        fresh = block(lang)
        if START in html and END in html:
            current = html[html.index(START) : html.index(END) + len(END)]
            if current == fresh:
                continue
            if args.check:
                stale.append(f"{lang}: stale")
                continue
            path.write_text(html.replace(current, fresh, 1), encoding="utf-8")
            written.append(lang)
            continue
        if args.check:
            stale.append(f"{lang}: missing block")
            continue
        path.write_text(insert_after_hero(html, fresh), encoding="utf-8")
        inserted.append(lang)

    if args.check:
        if stale:
            print("pricing answer block: " + "; ".join(stale) + " — run scripts/sync_pricing_answer.py")
            return 1
        print(f"pricing answer block: up to date in {len(COPY)} locales")
        return 0
    if written or inserted:
        print(f"pricing answer block: inserted {inserted or '-'} · rewritten {written or '-'}")
    else:
        print(f"pricing answer block: up to date (0 rewritten, {len(COPY)} locales)")
    return 0


if __name__ == "__main__":
    sys.exit(main())
