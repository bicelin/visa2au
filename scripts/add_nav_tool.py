#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Add the navigate_website client tool and attach it to the 3 site agents.
Idempotent via cartesia_state.json (nav_tool_id + per-agent tools lists).
"""
import json, os, urllib.error, urllib.request

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
KEY = open(os.path.expanduser("~/.hermes/secrets/cartesia_api_key")).read().strip()
STATE_P = os.path.join(ROOT, "cartesia_state.json")
VER = "2026-08-14"

def req(method, path, body=None, ok=(200, 201)):
    r = urllib.request.Request("https://api.cartesia.ai" + path, method=method,
        data=json.dumps(body).encode() if body is not None else None,
        headers={"Authorization": f"Bearer {KEY}", "Cartesia-Version": VER,
                 "Content-Type": "application/json"})
    try:
        with urllib.request.urlopen(r, timeout=60) as resp:
            txt = resp.read().decode()
            return resp.status, (json.loads(txt) if txt else {})
    except urllib.error.HTTPError as e:
        return e.code, json.loads(e.read().decode() or "{}")

state = json.load(open(STATE_P))

if "nav_tool_id" not in state:
    tool = {
        "type": "client",
        "name": "navigate_website",
        "description": ("Open a specific page of the Visa2AU website in the visitor's browser "
                        "while staying on the call. Use when you want the visitor to READ a page "
                        "you described (e.g. a visa page, pricing), or when they ask you to show "
                        "them something. Paths: /visas, /visas/partner-visa-820-801, "
                        "/visas/skills-in-demand-482, /visas/parent-visa-103, /visas/parent-visa-870 "
                        "(via /visas), /pricing, /team, /employers, /contact, /urgent-visa-help, "
                        "/blog, /search-index pages. For RU visitors prefix /ru, FR prefix /fr. "
                        "Anchor sections are allowed (e.g. /visas#pathway-finder)."),
        "pre_tool_speech": "force",
        "execution_mode": "immediate",
        "expects_response": True,
        "response_timeout_secs": 15,
        "parameters": {
            "type": "object",
            "properties": {
                "path": {"type": "string",
                         "description": "Absolute site path to open, e.g. /ru/visas/partner-visa-820-801 or /visas#pathway-finder"},
                "reason": {"type": "string",
                           "description": "Short note why this page helps the caller (for logs)"},
            },
            "required": ["path"],
        },
    }
    code, d = req("POST", "/v1/agents/tools", tool)
    assert code == 201, (code, d)
    state["nav_tool_id"] = d["id"]
    print("nav tool:", d["id"])

NAV_RULE = {
 "en": """

# Guiding the visitor to pages (navigate_website tool)
You can open pages in the visitor's own browser while the call continues — they can read along while you speak, and browsing never drops the call.
- When you have explained a visa type or service that matches their interest, offer: "I can open the <name> page for you now — want me to?" and on yes call navigate_website with that page's path (the RU visitor sees RU pages — no prefix needed; English pages: /visas/...).
- Also use it when they ask things like "can you show me the pricing?" or "which page explains partner visas?".
- After opening, offer to read the key points of the page aloud.
- Never claim you "sent" anything by email; you only open pages on this site.""",
 "ru": """

# Переход на страницы сайта (инструмент navigate_website)
Вы можете открыть страницу в браузере посетителя, не прерывая звонок — он может читать, пока вы говорите, соединение не разрывается.
- Когда вы рассказали о визе или услуге, которая ему подходит, предложите: «Могу прямо сейчас открыть страницу с описанием — открыть?» и после согласия вызовите navigate_website с путём русской страницы (префикс /ru, например /ru/visas/partner-visa-820-801).
- Используйте также на просьбы «покажите цены», «где почитать про партнёрские визы».
- После открытия предложите прочитать ключевые пункты страницы вслух.
- Никогда не утверждайте, что что-то «отправили на почту»; вы только открываете страницы этого сайта.""",
 "fr": """

# Ouvrir des pages du site (outil navigate_website)
Vous pouvez ouvrir une page dans le navigateur du visiteur sans interrompre l'appel — il peut lire pendant que vous parlez, la connexion reste active.
- Après avoir expliqué un visa ou service qui correspond à sa situation, proposez : « Je peux ouvrir la page <nom> maintenant — d'accord ? » puis appelez navigate_website avec le chemin français (préfixe /fr, ex. /fr/visas/partner-visa-820-801).
- Utilisez aussi sur « montrez-moi les tarifs », « quelle page parle des visas partenaire ? ».
- Après l'ouverture, proposez de lire les points clés à voix haute.
- Ne prétendez jamais avoir « envoyé » un e-mail ; vous ouvrez seulement des pages de ce site.""",
}

for lang in ("en", "ru", "fr"):
    aid = state[f"agent_{lang}"]
    code, cur = req("GET", f"/v1/agents/{aid}")
    assert code == 200, (code, cur)
    tools = [t["id"] for t in cur.get("config", {}).get("tools", [])]
    changed = False
    if state["nav_tool_id"] not in tools:
        tools.append(state["nav_tool_id"]); changed = True
    # append the navigation policy block to instructions once
    instr = cur.get("config", {}).get("instructions", "")
    if "navigate_website" not in instr:
        extra = NAV_RULE[lang]
        req("PATCH", f"/v1/agents/{aid}", {"config": {
            "tools": [{"id": t} for t in tools],
            "instructions": instr + extra,
        }})
        print(lang, "tools+instructions updated")
    else:
        if changed:
            req("PATCH", f"/v1/agents/{aid}", {"config": {"tools": [{"id": t} for t in tools]}})
            print(lang, "tool attached")
        else:
            print(lang, "already configured")


json.dump(state, open(STATE_P, "w"), indent=1)
