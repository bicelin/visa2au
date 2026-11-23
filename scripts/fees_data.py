#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Single source of truth for published fees.

Both /pricing and the partner pillar render their tables from this module, so a
fee change is one edit instead of five hand-edited HTML pages. Numbers are the
ones already published on /pricing (checked 2026-11-23); `note` carries the
qualification that belongs next to each row.
"""

# key: (path to the visa page, gov charge, our fee)
GROUPS = {
    "partner": [
        ("/visas/partner-visa-820-801", "820/801 Partner (onshore)", "from $11,710", "$5,500"),
        ("/visas/partner-visa-309-100", "309/100 Partner (offshore)", "from $11,710", "$5,500"),
        ("/visas/prospective-marriage-300", "300 Prospective Marriage", "$11,710", "$5,500"),
    ],
    "all": [
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
    ],
}

# partner visa government charges, per applicant (main / secondary 18+ / under 18)
PARTNER_GOV = {
    "main": "$11,710",
    "secondary": "$5,855",
    "child": "$2,930",
}

DISCLAIMER = (
    "Indicative only. Government charges change on 1 July each year and differ by "
    "stream, age and family members. A fixed professional fee is quoted after "
    "assessment and confirmed in your engagement letter."
)


def rows(lang="en", group="all", prefix=""):
    """(label, href, gov, fee) with the locale prefix applied to internal links."""
    out = []
    for href, label, gov, fee in GROUPS[group]:
        out.append((label, prefix + href, gov, fee))
    return out
