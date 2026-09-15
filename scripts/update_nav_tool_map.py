#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Update navigate_website tool with the exact subclass->page map so the agent
always lands on the specific visa page matching the discussed subclass."""
import json, os, urllib.error, urllib.request

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
KEY = open(os.path.expanduser("~/.hermes/secrets/cartesia_api_key")).read().strip()
STATE = json.load(open(os.path.join(ROOT, "cartesia_state.json")))

DESC = """Open a specific page of the Visa2AU website in the visitor's browser while the call continues. ALWAYS choose the exact subclass page that matches what you are discussing — never a generic page when a specific one exists. Map (EN paths; prefix /ru or /fr for those visitors):
partner visa onshore 820/801 -> /visas/partner-visa-820-801 | partner offshore 309/100 -> /visas/partner-visa-309-100 | fiancé(e) 300 -> /visas/prospective-marriage-300 | visitor 600 -> /visas/visitor-visa-600 | student 500 -> /visas/student-visa-500 | working holiday 417/462 -> /visas/work-holiday-417-462 | training 407 -> /visas/training-visa-407 | short stay 400/408 -> /visas/short-stay-400-408 | Skills in Demand SID 482 -> /visas/skills-in-demand-482 | Employer Nomination 186 -> /visas/employer-nomination-186 | Skilled Independent/State 189/190 -> /visas/skilled-independent-189-190 | regional 494 -> /visas/skilled-regional-494 | protection 866 -> /visas/protection-visa-866 | parent 103 -> /visas/parent-visa-103 | bridging visas -> /visas/bridging-visas | skills assessment -> /visas/skills-assessment | refusals/appeals ART -> /visas/visa-refusals-art-appeals | citizenship -> /visas/australian-citizenship | all visas -> /visas | fees -> /pricing | team -> /team | employers -> /employers | contact -> /contact | urgent help -> /urgent-visa-help | pathway quiz -> /visas#pathway-finder | blog -> /blog.
If the caller says a subclass number, open its page even if they did not name the visa."""

r = urllib.request.Request(
    "https://api.cartesia.ai/v1/agents/tools/" + STATE["nav_tool_id"],
    method="PATCH", data=json.dumps({"description": DESC}).encode(),
    headers={"Authorization": f"Bearer {KEY}", "Cartesia-Version": "2026-08-14",
             "Content-Type": "application/json"})
try:
    with urllib.request.urlopen(r, timeout=60) as resp:
        d = json.loads(resp.read().decode())
        print("tool updated:", resp.status, "| desc len:", len(d.get("description", "")))
except urllib.error.HTTPError as e:
    print("FAIL", e.code, e.read().decode()[:300])
