#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Give the LocalBusiness schema the fields the map pack actually reads.

Every page already emits LegalService (a LocalBusiness subtype) with name,
address and telephone, but none of the pages carries geo coordinates, a map link,
the areas served or currency/payment. Those are the fields a local result uses to
place the business, and `hasMap` is what ties the page to the Google Business
Profile once it exists. Idempotent: fields are merged, never duplicated.

Hours come from the service agreement: Monday to Friday, 09:00-17:00, no weekend
cover. They must match the Google Business Profile exactly or the map pack sees a
contradiction, so change them here and in the profile together.
"""
import json
import os
import re

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
APP = os.path.join(ROOT, "app")

# 1 Denison Street, North Sydney NSW 2060 (geocoded, Nominatim)
GEO = {"@type": "GeoCoordinates", "latitude": -33.8381775, "longitude": 151.208197}
HAS_MAP = ("https://www.google.com/maps/search/?api=1&query="
           "Visa2AU+Pty+Ltd%2C+Level+17%2C+1+Denison+Street%2C+North+Sydney+NSW+2060")
AREA_SERVED = [
    {"@type": "City", "name": "Sydney"},
    {"@type": "City", "name": "Melbourne"},
    {"@type": "City", "name": "Brisbane"},
    {"@type": "City", "name": "Cairns"},
    {"@type": "Country", "name": "Australia"},
]

HOURS = [{
    "@type": "OpeningHoursSpecification",
    "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
    "opens": "09:00",
    "closes": "17:00",
}]

EXTRA = {
    "geo": GEO,
    "openingHoursSpecification": HOURS,
    "hasMap": HAS_MAP,
    "areaServed": AREA_SERVED,
    "priceRange": "$$",
    "currenciesAccepted": "AUD",
    "paymentAccepted": "Bank transfer, Credit card",
    "telephone": "+61 2 9136 2462",
    "email": "info@visa2.au",
}

BLOCK = re.compile(r'(<script type="application/ld\+json">)(.*?)(</script>)', re.S)


def main() -> int:
    changed = blocks = 0
    for root, _dirs, files in os.walk(APP):
        for name in sorted(files):
            if not name.endswith(".html"):
                continue
            path = os.path.join(root, name)
            html = open(path, encoding="utf-8").read()

            def repl(m):
                nonlocal blocks
                try:
                    data = json.loads(m.group(2))
                except json.JSONDecodeError:
                    return m.group(0)
                if data.get("@type") not in ("LegalService", ["LegalService", "ProfessionalService"]):
                    return m.group(0)
                before = json.dumps(data, sort_keys=True)
                data["@type"] = ["LegalService", "ProfessionalService"]
                for k, v in EXTRA.items():
                    data.setdefault(k, v)
                if json.dumps(data, sort_keys=True) == before:
                    return m.group(0)
                blocks += 1
                return m.group(1) + json.dumps(data, ensure_ascii=False, separators=(",", ":")) + m.group(3)

            new = BLOCK.sub(repl, html)
            if new != html:
                open(path, "w", encoding="utf-8").write(new)
                changed += 1
    print(f"local schema: {blocks} blocks enriched across {changed} pages")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
