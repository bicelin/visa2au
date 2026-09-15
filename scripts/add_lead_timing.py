#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Lead-capture timing rule (user directive 2026-09-15):
collect contact details only once the dialogue is established — around the
3rd exchange, when the visitor is comfortable — never at open, never as an
interrogation. Required set: name, contact number, email, and whether they
use WhatsApp/Telegram for a quick reply. Appended to all three agents
(idempotent marker) and folded into the tool description."""
import json, os, urllib.error, urllib.request

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
KEY = open(os.path.expanduser("~/.hermes/secrets/cartesia_api_key")).read().strip()
VER = "2026-08-14"
STATE = json.load(open(os.path.join(ROOT, "cartesia_state.json")))

def req(method, path, body=None):
    r = urllib.request.Request("https://api.cartesia.ai" + path, method=method,
        data=json.dumps(body).encode() if body is not None else None,
        headers={"Authorization": f"Bearer {KEY}", "Cartesia-Version": VER,
                 "Content-Type": "application/json"})
    try:
        with urllib.request.urlopen(r, timeout=60) as resp:
            t = resp.read().decode(); return resp.status, (json.loads(t) if t else {})
    except urllib.error.HTTPError as e:
        return e.code, json.loads(e.read().decode() or "{}")

MARK = "# WHEN to collect contact details"
RULE = {
 "en": """

# WHEN to collect contact details (timing rule)
Do NOT ask for contact details at the start. First answer their questions and let the dialogue settle — begin collecting around your THIRD response to them, once they sound comfortable and engaged, and only if a follow-up conversation with an agent makes sense. Collect conversationally over the next couple of turns (one item per turn, never a list): full name, email address, contact/return phone number, and whether they have WhatsApp or Telegram for a quick reply (ask which they prefer). If after two attempts they won't share an email, thank them and wrap up without pressing. Then call record_v2au_enquiry.""",
 "ru": """

# КОГДА собирать контакты (правило тайминга)
Не запрашивайте контакты в начале. Сначала ответьте на вопросы человека и дайте диалогу наладиться — начинайте собирать примерно с ТРЕТЬего вашего ответа, когда собеседник чувствует себя спокойно и вовлечённо, и только если разговор с агентом действительно имеет смысл. Собирайте в беседе, по одному пункту за реплику (не списком): полное имя, email, телефон для обратного звонка, и есть ли WhatsApp или Telegram для быстрой связи (что предпочтительнее). Если после двух попыток человек не хочет давать email — поблагодарите и завершайте без давления. Затем вызовите record_v2au_enquiry.""",
 "fr": """

# QUAND collecter les coordonnées (règle de timing)
Ne demandez pas les coordonnées au début. Répondez d'abord à ses questions et laissez le dialogue s'installer — commencez la collecte vers votre TROISIÈME réponse, quand la personne est à l'aise et engagée, et seulement si un échange avec un agent est utile. Collectez au fil de la conversation, un élément par tour (jamais une liste) : nom complet, e-mail, téléphone de rappel, et si elle utilise WhatsApp ou Telegram pour une réponse rapide (ce qu'elle préfère). Si après deux tentatives la personne ne veut pas donner son e-mail, remerciez et terminez sans insister. Puis appelez record_v2au_enquiry.""",
}

for lang in ("en", "ru", "fr"):
    aid = STATE[f"agent_{lang}"]
    code, cur = req("GET", f"/v1/agents/{aid}")
    assert code == 200, (code, cur)
    instr = cur["config"]["instructions"]
    if MARK in instr:
        print(lang, "timing rule already present"); continue
    code, d = req("PATCH", f"/v1/agents/{aid}", {"config": {"instructions": instr + RULE[lang]}})
    print(lang, "instructions updated", code)

# tool description: phone now expected
code, d = req("PATCH", f"/v1/agents/tools/{STATE['tool_id']}", {
    "description": ("Save an enquiry/lead captured during the call, once the dialogue is "
                    "established (around the 3rd exchange, not at open). Include name, email, "
                    "phone (return number), messenger (telegram/whatsapp/viber/signal/email/phone/none — "
                    "ask if they use WhatsApp or Telegram for quick replies), visa_interest, "
                    "situation, wants_agent_contact, consultation_ready (true if willing to pay the "
                    "AUD 330 consultation fee), preferred_language, notes.")})
print("tool desc", code)
