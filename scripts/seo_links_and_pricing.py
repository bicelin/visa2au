#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Two SEO passes that need no template changes:

1. `pricing_hub()` turns /pricing into the fee hub: a by-visa cost table that
   links every visa page, a "what the total is made of" split, an FAQ block
   whose text is mirrored 1:1 in FAQPage JSON-LD, and a last-updated line.
2. `internal_links()` puts a "Next steps" band inside <main> on every indexed
   page that has no in-body link to /pricing or /visas yet (the footer link does
   not pass context, and Google needs a contextual path to the money pages).

Locale aware: ru/ and fr/ pages get localized hrefs and anchors.
Idempotent: both functions detect their own output and skip.
"""
import json
import os
import re

APP = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "app")

# ── 1. pricing hub ──────────────────────────────────────────────────────────
ROWS = [
    # (visa page, label, government charge, our fee)
    ("/visas/partner-visa-820-801", "820/801 Partner (onshore)", "from $11,710", "$5,500"),
    ("/visas/partner-visa-309-100", "309/100 Partner (offshore)", "from $11,710", "$5,500"),
    ("/visas/prospective-marriage-300", "300 Prospective Marriage", "$11,710", "$5,500"),
    ("/visas/skilled-independent-189-190", "189 Skilled Independent", "$6,135", "$5,500"),
    ("/visas/skilled-independent-189-190", "190 Skilled Nominated", "$6,140", "$5,500"),
    ("/visas/skilled-regional-494", "491 Skilled Work Regional", "$6,140", "$5,500"),
    ("/visas/employer-nomination-186", "482 Skills in Demand", "itemised at engagement", "$3,300"),
    ("/visas/employer-nomination-186", "186 Employer Nomination", "itemised at engagement", "$5,500"),
    ("/visas/student-visa-500", "500 Student", "$2,500", "$3,300"),
    ("/visas/visitor-visa-600", "600 Visitor (offshore)", "$250", "$700"),
    ("/visas/training-visa-407", "407 Training", "itemised at engagement", "$3,300"),
    ("/visas/work-holiday-417-462", "417/462 Work and Holiday", "itemised at engagement", "$2,200"),
    ("/visas/parent-visa-103", "103 Parent (offshore)", "$7,055", "$5,500"),
    ("/visas/parent-visa-103", "143 Contributory Parent", "staged contributory charges", "$5,500"),
    ("/visas/parent-visa-103", "870 Sponsored Parent (temporary)", "$1,145", "$2,200"),
    ("/visas/australian-citizenship", "Citizenship by conferral", "$595", "$3,300"),
    ("/visas/skills-assessment", "Skills assessment", "$300–$1,200 authority fee", "$3,300"),
    ("/visas/bridging-visas", "BVB Bridging Visa B", "$575", "$330"),
]

FAQ = [
    ("How much does an Australian visa cost in total?",
     "A visa usually costs three things: the government charge set by the Department of Home Affairs, our professional fee, and any third-party costs such as health examinations, police checks, translations or a skills assessment. For example, an onshore partner visa (820/801) is $5,500 in professional fees plus government charges from $11,710 for the main applicant."),
    ("Are government charges included in your professional fee?",
     "No. Government charges are paid to the Department of Home Affairs and are itemised separately from our professional fee in every quote. You always see the two amounts side by side before you engage us."),
    ("Is your professional fee fixed?",
     "Yes. A fixed professional fee is quoted in your engagement letter before any work begins, so it does not change with the time your matter takes. If the scope of the matter changes, that is agreed in writing first."),
    ("Can I pay in instalments?",
     "Payment options are discussed at your consultation and confirmed in the engagement letter. Government charges are still payable to the Department when the application is lodged."),
    ("What do secondary applicants and children pay?",
     "Government charges are set per applicant: for a partner visa the main applicant is $11,710, a secondary applicant aged 18 or over is $5,855, and a child under 18 is $2,930. Our professional fee is quoted per matter, so tell us who is included before we quote."),
    ("What does a consultation cost?",
     "An online consultation is $330 for one hour, and a DAMA consultation is also $330 for one hour. The consultation is where we assess your situation and confirm the fixed fee for your matter."),
    ("Does the fee include a skills assessment or health checks?",
     "No. A skills assessment is charged by the assessing authority at roughly $300–$1,200, and health examinations, police checks and translations are paid to their providers. We prepare and check these for you, and they appear in your quote as third-party costs."),
    ("What if my visa is refused?",
     "A refusal is a separate matter with its own fees. An ART tribunal application is $5,500 in professional fees plus a $3,496 government fee, of which 50% is refundable if the review succeeds. We assess the refusal first and tell you honestly whether review is worth it."),
]

TABLE_HTML = """
    <section class="reveal mx-auto max-w-5xl px-4 pb-4 lg:px-8">
      <h2 class="font-display text-2xl font-bold text-navy-900 dark:text-white sm:text-3xl">What each visa costs: government charge and our fee</h2>
      <p class="mt-3 max-w-3xl text-base leading-relaxed text-slate-600 dark:text-slate-300">Two numbers make up the cost of a visa: the <strong>government charge</strong> set by the Department of Home Affairs, and our <strong>professional fee</strong> for preparing and managing the application. Third-party costs — health examinations, police checks, translations and skills assessments — are separate and itemised in your quote.</p>
      <div class="mt-6 overflow-x-auto">
        <table class="w-full border-collapse text-left text-sm">
          <thead>
            <tr class="border-b border-navy-800/15 dark:border-white/15">
              <th class="py-3 pr-4 font-tech text-xs font-semibold uppercase tracking-wider text-slate-500">Visa</th>
              <th class="py-3 pr-4 font-tech text-xs font-semibold uppercase tracking-wider text-slate-500">Government charge</th>
              <th class="py-3 font-tech text-xs font-semibold uppercase tracking-wider text-slate-500">Our professional fee</th>
            </tr>
          </thead>
          <tbody>
%s
          </tbody>
        </table>
      </div>
      <p class="mt-4 text-xs leading-relaxed text-slate-500 dark:text-slate-400">Indicative only. Government charges change on 1 July each year and differ by stream, age and family members. A fixed professional fee is quoted after assessment and confirmed in your engagement letter.</p>
    </section>
"""

FAQ_HTML = """
    <section class="reveal mx-auto max-w-5xl px-4 py-12 lg:px-8">
      <h2 class="font-display text-2xl font-bold text-navy-900 dark:text-white sm:text-3xl">Visa fee questions, answered</h2>
      <div class="mt-6 space-y-4">
%s
      </div>
    </section>
"""


def pricing_hub():
    path = os.path.join(APP, "pricing.html")
    html = open(path, encoding="utf-8").read()
    if "What each visa costs: government charge and our fee" in html:
        print("pricing: hub already present")
        return 0

    rows = []
    for href, label, gov, fee in ROWS:
        rows.append(
            '            <tr class="border-b border-navy-800/10 dark:border-white/10">'
            f'<td class="py-2.5 pr-4"><a href="{href}" class="font-medium text-cobalt-500 transition hover:text-cobalt-400 dark:text-gold-400 dark:hover:text-gold-400">{label}</a></td>'
            f'<td class="py-2.5 pr-4 text-slate-600 dark:text-slate-300">{gov}</td>'
            f'<td class="py-2.5 text-slate-600 dark:text-slate-300">{fee} AUD</td></tr>')
    table = TABLE_HTML % "\n".join(rows)

    faq = []
    for q, a in FAQ:
        faq.append(
            '        <details class="rounded-2xl border border-navy-800/10 bg-tint-100 p-5 dark:border-white/10 dark:bg-navy-950">'
            f'<summary class="cursor-pointer font-medium text-navy-800 dark:text-white">{q}</summary>'
            f'<p class="mt-3 text-sm leading-relaxed text-slate-600 dark:text-slate-300">{a}</p></details>')
    faq_html = FAQ_HTML % "\n".join(faq)

    # after the hero section that carries the H1
    h1 = html.find("<h1")
    assert h1 > 0, "pricing: no h1"
    close = html.find("</section>", h1)
    assert close > 0, "pricing: no hero section end"
    html = html[:close + len("</section>")] + "\n" + table + "\n" + html[close + len("</section>"):]

    # FAQ before </main>
    main_end = html.rfind("</main>")
    assert main_end > 0
    html = html[:main_end] + faq_html + "\n" + html[main_end:]

    # FAQPage JSON-LD before </head>
    ld = {"@context": "https://schema.org", "@type": "FAQPage",
          "mainEntity": [{"@type": "Question", "name": q,
                          "acceptedAnswer": {"@type": "Answer", "text": a}} for q, a in FAQ]}
    script = '  <script type="application/ld+json">' + json.dumps(ld, ensure_ascii=False, separators=(",", ":")) + "</script>\n</head>"
    html = html.replace("</head>", script, 1)

    open(path, "w", encoding="utf-8").write(html)
    print("pricing: hub + FAQ + FAQPage schema written")
    return 1


# ── 2. internal links to /pricing and /visas ────────────────────────────────
ANCHORS = {
    "en": [
        ("visas/", [("Visa fees: government charges and our professional fee", "pricing"),
                    ("All Australian visa services we provide", "visas")]),
        ("blog/", [("What an Australian visa really costs", "pricing"),
                   ("Visa services and fixed-fee quotes", "visas")]),
        ("", [("See visa fees and fixed-fee quotes", "pricing"),
              ("Browse every visa service", "visas")]),
    ],
    "ru": [
        ("visas/", [("Визовые сборы и наша фиксированная стоимость", "pricing"),
                    ("Все визовые услуги", "visas")]),
        ("blog/", [("Сколько на самом деле стоит виза в Австралию", "pricing"),
                   ("Визовые услуги и фиксированные гонорары", "visas")]),
        ("", [("Визовые сборы и фиксированные гонорары", "pricing"),
              ("Все визовые услуги", "visas")]),
    ],
    "fr": [
        ("visas/", [("Frais gouvernementaux et honoraires fixes", "pricing"),
                    ("Tous nos services de visa", "visas")]),
        ("blog/", [("Ce que coûte vraiment un visa australien", "pricing"),
                   ("Services de visa et honoraires fixes", "visas")]),
        ("", [("Frais de visa et honoraires fixes", "pricing"),
              ("Tous les services de visa", "visas")]),
    ],
}
LABEL = {"en": "Next steps", "ru": "Дальше", "fr": "Pour aller plus loin"}


def band(lang, prefix, links, used):
    items = []
    for text, target in links:
        if target in used:
            continue
        href = f"/{prefix}{target}"
        items.append(f'<li><a href="{href}" class="font-medium text-cobalt-500 transition hover:text-cobalt-400 dark:text-gold-400 dark:hover:text-gold-400">{text}</a></li>')
        used.add(target)
    if not items:
        return ""
    return ('<section class="mx-auto max-w-5xl px-4 pb-16 lg:px-8"><div class="rounded-2xl border border-navy-800/10 bg-tint-100 p-6 dark:border-white/10 dark:bg-navy-950">'
            f'<p class="font-tech text-xs font-semibold uppercase tracking-wider text-slate-400">{LABEL[lang]}</p>'
            '<ul class="mt-3 space-y-2.5 text-sm">' + " ".join(items) + "</ul></div></section>")


def internal_links():
    changed = skipped = 0
    seen = set()
    markers = ('pb-16 lg:px-8"><div class="rounded-2xl border border-navy-800/10 bg-tint-100 p-6',)
    for root, _dirs, files in os.walk(APP):
        for name in sorted(files):
            if not name.endswith(".html"):
                continue
            path = os.path.join(root, name)
            rel = os.path.relpath(path, APP).replace(os.sep, "/")
            if rel.startswith("agoda/") or rel == "404.html":
                continue
            html = open(path, encoding="utf-8").read()
            if "pb-16 lg:px-8" in html and "font-tech text-xs font-semibold uppercase tracking-wider text-slate-400" in html and "mt-3 space-y-2.5 text-sm" in html and ("Next steps" in html or "Дальше" in html or "Pour aller plus loin" in html):
                skipped += 1
                continue
            lang = "ru" if rel.startswith("ru/") else "fr" if rel.startswith("fr/") else "en"
            prefix = "" if lang == "en" else lang + "/"
            sub = rel[len(prefix):] if prefix else rel
            m = re.search(r"<main[^>]*>(.*)</main>", html, re.S)
            if not m:
                continue
            body = m.group(1)
            used = set()
            if re.search(r'href="/%spricing"' % prefix, body):
                used.add("pricing")
            if re.search(r'href="/%svisas"' % prefix, body):
                used.add("visas")
            if sub in ("pricing.html", "visas.html"):
                used.add(sub[: -len(".html")])
            links = ANCHORS[lang][-1][1]
            for key, value in ANCHORS[lang]:
                if key and sub.startswith(key):
                    links = value
                    break
            snippet = band(lang, prefix, links, used)
            if not snippet:
                continue
            assert (rel, tuple(used)) not in seen
            html = html[: m.end(1)] + "\n" + snippet + html[m.end(1):]
            open(path, "w", encoding="utf-8").write(html)
            changed += 1
    print(f"internal links: {changed} pages updated, {skipped} already had the band")
    return changed


if __name__ == "__main__":
    pricing_hub()
    internal_links()
