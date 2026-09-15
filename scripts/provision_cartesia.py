#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Provision the Visa2AU Cartesia voice-agent stack (idempotent, stateful).

Creates: record_v2au_enquiry webhook tool, per-language KB folders with 141
site docs, call-lifecycle webhook, three agents (EN/AU Ella, RU Sergei, FR
Inès) wired with the KB + tool + end_call. State saved to cartesia_state.json.

Env: CARTESIA_API_KEY in ~/.hermes/secrets/cartesia_api_key; tool/webhook
secrets passed via argv (read from this session's generator).
"""
from __future__ import annotations
import json, os, sys, time, urllib.request

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(HERE)
KEY = open(os.path.expanduser("~/.hermes/secrets/cartesia_api_key")).read().strip()
API = "https://api.cartesia.ai"
VER_TOOLS = "2026-08-14"
VER_PLAIN = "2026-03-01"
STATE_P = os.path.join(ROOT, "cartesia_state.json")

TOOL_SECRET = sys.argv[1] if len(sys.argv) > 1 else ""
WH_SECRET = sys.argv[2] if len(sys.argv) > 2 else ""
BASE_URL = "https://staging.visa2.au"

def req(method, path, ver, body=None, ok=(200, 201)):
    r = urllib.request.Request(API + path, method=method,
        data=json.dumps(body).encode() if body is not None else None,
        headers={"Authorization": f"Bearer {KEY}", "Cartesia-Version": ver,
                 "Content-Type": "application/json"})
    try:
        with urllib.request.urlopen(r, timeout=60) as resp:
            txt = resp.read().decode()
            return resp.status, (json.loads(txt) if txt else {})
    except urllib.error.HTTPError as e:
        return e.code, json.loads(e.read().decode() or "{}")

state = json.load(open(STATE_P)) if os.path.isfile(STATE_P) else {}

def save():
    json.dump(state, open(STATE_P, "w"), indent=1)

# ---------------------------------------------------------- 1. tool
if "tool_id" not in state:
    tool = {
        "type": "webhook",
        "name": "record_v2au_enquiry",
        "description": ("Save an enquiry/lead captured during the call. Call this ONCE when you "
                        "have at least the caller's name and email; include phone, messenger "
                        "(telegram/whatsapp/viber/none), visa_interest, situation, "
                        "wants_agent_contact, consultation_ready (true if willing to pay the "
                        "AUD 330 consultation fee), preferred_language, notes."),
        "pre_tool_speech": "auto",
        "execution_mode": "immediate",
        "response_timeout_secs": 15,
        "api_schema": {
            "url": f"{BASE_URL}/api/cartesia-tool",
            "method": "POST",
            "request_headers": {"X-V2AU-Secret": {"type": "secret", "secret_value": TOOL_SECRET}},
            "request_body_schema": {
                "type": "object",
                "properties": {
                    "name": {"type": "string", "description": "Caller full name"},
                    "email": {"type": "string", "description": "Email address"},
                    "phone": {"type": "string", "description": "Phone in international format if given"},
                    "messenger": {"type": "string", "enum": ["telegram", "whatsapp", "viber", "signal", "email", "phone", "none"],
                                  "description": "Preferred messenger the caller confirmed they have"},
                    "visa_interest": {"type": "string", "description": "Visa subclass or type mentioned (e.g. 482 SID, partner 820/801, 189) or their goal"},
                    "situation": {"type": "string", "description": "One-line summary of the immigration situation"},
                    "wants_agent_contact": {"type": "boolean", "description": "Caller agreed a registered agent may contact them"},
                    "consultation_ready": {"type": "boolean", "description": "Caller is ready to pay the AUD 330 consultation fee (callback prioritised)"},
                    "preferred_language": {"type": "string", "enum": ["en", "ru", "fr"]},
                    "notes": {"type": "string", "description": "Anything else useful"},
                },
                "required": ["name", "email", "wants_agent_contact"],
            },
        },
    }
    code, d = req("POST", "/v1/agents/tools", VER_TOOLS, tool)
    assert code == 201, (code, d)
    state["tool_id"] = d["id"]
    save()
    print("tool:", d["id"])

# ---------------------------------------------------------- 2. KB folders + docs
manifest = json.load(open(os.path.join(ROOT, "kb", "manifest.json")))
docs = manifest["documents"]
for lang in ("en", "ru", "fr"):
    fk = f"folder_{lang}"
    if fk not in state:
        code, d = req("POST", "/agents/folders", VER_PLAIN,
                      {"name": f"visa2au-site-{lang}", "parent_id": None})
        assert code in (200, 201), (code, d)
        state[fk] = d["id"] if "id" in d else d.get("folder", {}).get("id")
        save()
    folder_id = state[fk]
    lang_docs = [x for x in docs if x["metadata"]["lang"] == lang]
    # upload in batches of 25 via bulk endpoint
    done_key = f"uploaded_{lang}"
    done = state.get(done_key, 0)
    for i in range(done, len(lang_docs), 25):
        batch = lang_docs[i:i+25]
        payload = {"documents": [{"folder_id": folder_id, "name": x["name"], "content": x["content"],
                                  "metadata": x["metadata"]} for x in batch]}
        code, d = req("POST", "/agents/documents/bulk", VER_PLAIN, payload)
        assert code in (200, 201), (code, d)
        state[done_key] = i + len(batch)
        save()
        print(f"{fk}: {state[done_key]}/{len(lang_docs)}")

# ---------------------------------------------------------- 3. webhook registration
if "whook_id" not in state:
    code, d = req("POST", "/agents/webhooks", VER_PLAIN,
                  {"url": f"{BASE_URL}/api/cartesia-webhook", "secret": WH_SECRET,
                   "display_name": "visa2au-voice-reports"})
    assert code in (200, 201), (code, d)
    state["whook_id"] = d.get("id")
    save()
    print("webhook:", d.get("id"))

# ---------------------------------------------------------- 4. agents
VOICES = {"en": "2a12b36c-7f9b-4c3a-9f7a-72731b15323a",   # Ella — AU female
          "ru": "1e4176b1-3db9-44d6-a601-4fe68b041942",   # Sergei — RU male
          "fr": "7c58f4a4-a72c-42fa-a503-41b9408820f3"}   # Inès — FR female
GREET = {
 "en": "Hi, you're speaking with the Visa2AU assistant. I can explain Australian visa types in general terms and point you to the right page on our website. Just so you know, I'm an AI assistant — for personal advice, our registered migration agents are the right people. How can I help?",
 "ru": "Здравствуйте, вы говорите с ассистентом Visa2AU. Я могу в общих чертах рассказать о типах австралийских виз и подсказать, какую страницу сайта открыть. Заранее уточню: я ИИ-ассистент — персональные консультации дают только наши зарегистрированные миграционные агенты. Чем помочь?",
 "fr": "Bonjour, vous parlez avec l'assistant Visa2AU. Je peux expliquer les types de visas australiens en termes généraux et vous orienter vers la bonne page du site. Petite précision : je suis un assistant IA — seuls nos agents de migration enregistrés peuvent donner des conseils personnalisés. Comment puis-je vous aider ?",
}
KEYTERMS = ["Visa2AU", "MARN", "Skills in Demand", "SID 482", "ENS 186", "partner visa 820", "801",
            "Skilled Independent 189", "190", "494", "DAMA", "EOI", "NAATI", "Subclass",
            "protection visa 866", "parent visa", "working holiday", "417", "462", "student visa 500",
            "visitor visa 600", "bridging visa", "AAT", "ART", "sponsored parent 870", "103", "309", "100", "300"]

def instructions(lang: str) -> str:
    if lang == "en":
        core = """# Identity
You are the Visa2AU website voice assistant. Visa2AU is an Australian migration agency (MARN 0534230 Natasha Arens, MARN 2418663 Sergey Vinnichenko, NAATI-accredited translators, offices North Sydney, teams in Melbourne, Sydney, Brisbane, Cairns, serving clients across Australia and worldwide, since 2004).

# What you may do
- Explain GENERAL public information about Australian visa categories and process stages (partner, skilled, employer-sponsored, student, visitor, parent, protection, working holiday, citizenship) using ONLY your knowledge base.
- Read out the key facts of a visa page and guide the visitor: tell them which page to open (e.g. /visas/skills-in-demand-482) and offer to read its sections aloud.
- Answer about Visa2AU services, fees page, processing areas — again only from knowledge base content.

# What you must NEVER do (hard rules)
- No immigration advice, eligibility opinions, case assessment, strategy, chances of success, or recommendations of a visa for THIS person. That is a legal activity restricted to registered migration agents (MARA).
- If asked for advice: say you can only explain general information, an AI can't assess their case, and the right step is a consultation with a registered agent.
- Never invent visa facts, fees, processing times or policy not in the knowledge base. Say you don't have that detail and suggest the closest KB page or an agent consultation.
- No medical/legal/financial advice. Never collect card numbers, passwords, passport numbers or ID images.

# Goal: capture an enquiry (naturally, not an interrogation)
When the visitor is genuinely interested in talking to a human agent, gather, in a conversational order:
1) their name; 2) visa type they're interested in OR a one-line description of their immigration situation; 3) email; 4) callback number; 5) whether they use WhatsApp, Telegram or Viber, and which they prefer; 6) only if they seem keen on a paid consultation: mention a consultation with a registered agent is AUD 330, ask if they'd like to book — if yes, note consultation_ready=true and tell them their callback is prioritised.
Don't demand all fields: name + email is the minimum; ask the rest only where it flows.
When ready, call record_v2au_enquiry once with the collected data, then confirm to the caller that a registered agent will contact them via their preferred messenger or email, and that calls from agent to you are always from Visa2AU staff, never asking for money by phone.

# Style (voice)
You are speaking, not writing: short sentences, one question at a time, count three or fewer options ("partner, skilled, or employer-sponsored — have you looked into any of them?"). Numbers spoken simply ("about twelve to twenty-four months"). No markdown, no lists, no reading URLs character-by-character — say "the partner visa page" and mention the friendly name. If you didn't catch something, ask them to repeat. If they're in a hurry, don't push the enquiry capture.

# Ending
Summarise what was captured in one line, thank them, and use end_call when they say goodbye or after 2 failed mic checks.

# Context for answers (facts you may state)
Consultation fee: AUD 330 (professional fee; government visa charges are separate and quoted from official Home Affairs rates). Email: info@visa2.au. Office: Level 17, 1 Denison Street, North Sydney NSW 2060. Phone +61 2 9136 2462. The detailed online assessment lives at visa2au.mmportal.cloud/assessment. Never claim to be a human agent; identify as the Visa2AU AI assistant if asked."""
    elif lang == "ru":
        core = """# Идентичность
Вы голосовой ассистент сайта Visa2AU — австралийского миграционного агентства (MARN 0534230 Наташа Аренс, MARN 2418663 Сергей Винниченко, переводчики NAATI, офис North Sydney, команды в Мельбурне, Сиднее, Брисбене и Кейрнсе; работаем по всей Австралии и удалённо с 2004 года). Отвечайте только по-русски.

# Что можно
- Объяснять ОБЩУЮ публичную информацию о категориях австралийских виз и этапах процесса (партнёрские, квалифицированные, спонсорство работодателя, студенческие, гостевые, родительские, защита, working holiday, гражданство) — только по базе знаний.
- Пересказывать ключевые факты страницы о визе и подсказывать, какую страницу открыть (например /ru/visas/skills-in-demand-482), предлагать прочитать раздел вслух.
- Отвечать про услуги и цены Visa2AU — строго из базы знаний (профессиональная плата за консультацию: 330 AUD).

# Жёсткие запреты
- Никаких иммиграционных консультаций: оценки права на визу, стратегии, шансов, рекомендаций «именно этой виз» — это юридическая деятельность, доступная только зарегистрированным агентам MARA.
- На просьбу о совете: объясните, что ИИ даёт только общую информацию, а по их ситуации нужен разговор с зарегистрированным агентом.
- Не выдумывайте факты, сборы, сроки и политику сверх базы знаний. Не собирайте номера паспортов, банковских карт, пароли.

# Цель — зафиксировать обращение (мягко)
Если человек всерьёз хочет поговорить с агентом, соберите по-человечески: имя; интересующую визу ИЛИ одно предложение о ситуации; email; телефон для перезвона; есть ли WhatsApp/Telegram/Viber и что предпочесть; если готов(а) к платной консультации — скажите, что консультация зарегистрированного агента стоит 330 AUD, и при согласии отметьте consultation_ready=true, перезвон в приоритете. Минимум — имя и email, остальное по ходу разговора. Затем ОДИН раз вызовите record_v2au_enquiry и подтвердите: зарегистрированный агент свяжется выбранным способом.

# Стиль (голос)
Короткие фразы, один вопрос за раз, не более трёх вариантов перечисления. Без списков и URL посимвольно — говорите «страница партнёрских виз». Если не расслышали — переспросите. Не давите.

# Завершение
Резюмируйте одной строкой, поблагодарите, вызовите end_call на прощании.

# Факты для ответов
Email: info@visa2.au. Офис: Level 17, 1 Denison Street, North Sydney NSW 2060. Тел. +61 2 9136 2462. Детальная онлайн-оценка: visa2au.mmportal.cloud/assessment. На прямой вопрос — ИИ-ассистент Visa2AU, а не человек."""
    else:
        core = """# Identité
Vous êtes l'assistant vocal du site Visa2AU — agence de migration australienne (MARN 0534230 Natasha Arens, MARN 2418663 Sergey Vinnichenko, traducteurs NAATI, bureau North Sydney, équipes Melbourne, Sydney, Brisbane, Cairns ; au service de l'Australie entière et de l'international depuis 2004). Répondez uniquement en français.

# Possible
- Expliquer les INFORMATIONS PUBLIQUES GÉNÉRALES sur les catégories de visas australiens et les étapes de procédure, uniquement via votre base de connaissances.
- Lire les faits clés d'une page visa et orienter le visiteur vers la page à ouvrir (ex. /fr/visas/skills-in-demand-482).
- Répondre sur les services et tarifs Visa2AU selon la base de connaissances (consultation : 330 AUD).

# Interdictions strictes
- Aucun conseil en immigration : éligibilité, stratégie, chances de succès, recommandation « ce visa pour vous » — réservé aux agents enregistrés MARA.
- Sur demande de conseil : expliquer que l'IA ne donne que de l'information générale et qu'un agent enregistré est nécessaire pour une situation personnelle.
- Ne jamais inventer de fait, tarif ou délai hors base de connaissances. Ne jamais collecter passeport, carte bancaire, mot de passe. Notez que l'équipe parle anglais, russe et filipino ; le français couvre le site et la documentation écrite — pour un échange vocal en français, un agent rédigera les suivis écrits et pourra orienter vers une consultation écrite.

# Objectif — capturer une demande (en douceur)
Si la personne souhaite parler à un agent : prénom/nom ; visa concerné OU la situation en une phrase ; e-mail ; téléphone de rappel ; WhatsApp/Telegram/Viber et préférence ; si intéressée par la consultation payante (330 AUD), noter consultation_ready=true et préciser la rappel prioritaire. Minimum : nom + e-mail. Puis appelez UNE fois record_v2au_enquiry et confirmez qu'un agent enregistré contactera.

# Style (voix)
Phrases courtes, une question à la fois, trois options maximum. Pas de listes ni d'URL épelées.

# Fin
Résumez en une ligne, remerciez, utilisez end_call aux adieux.

# Faits
E-mail : info@visa2.au. Bureau : Level 17, 1 Denison Street, North Sydney NSW 2060. Tél. +61 2 9136 2462. Évaluation en ligne : visa2au.mmportal.cloud/assessment. Si on vous demande : vous êtes l'assistant IA de Visa2AU."""
    return core

for lang, agent_key in (("en", "agent_en"), ("ru", "agent_ru"), ("fr", "agent_fr")):
    if agent_key in state:
        continue
    body = {
        "name": f"Visa2AU {lang.upper()} Website Assistant",
        "description": "Public-information voice assistant for staging.visa2.au — no advice, enquiry capture",
        "config": {
            "instructions": instructions(lang),
            "initial_message": GREET[lang],
            "language": {"primary": lang},
            "model": {"id": "gpt-5.4-mini", "temperature": 0.3, "max_output_tokens": 512},
            "audio": {
                "input": {"noise_suppression": "auto", "keyterms": KEYTERMS},
                "output": {"voice_id": VOICES[lang], "speed": None, "volume": None},
            },
            "tools": [{"id": state["tool_id"]}],
            "system_tools": {"end_call": {"description": None, "pre_tool_speech": "force"}},
        },
    }
    code, d = req("POST", "/v1/agents", VER_TOOLS, body)
    assert code == 201, (code, d)
    state[agent_key] = d["id"]
    save()
    print(agent_key, d["id"])
    time.sleep(0.5)

# attach KB folders + lifecycle webhook to each agent
for lang in ("en", "ru", "fr"):
    code, d = req("PATCH", f"/agents/folders/{state[f'folder_{lang}']}", VER_PLAIN,
                  {"agents": [{"id": state[f"agent_{lang}"]}]})
    print("kb attach", lang, code, (d or {}).get("error", "ok"))
    code, d = req("PATCH", f"/v1/agents/{state[f'agent_{lang}']}", VER_TOOLS,
                  {"webhook_id": state["whook_id"]})
    print("webhook attach", lang, code, (d or {}).get("message", "ok"))

print(json.dumps(state, indent=1))
