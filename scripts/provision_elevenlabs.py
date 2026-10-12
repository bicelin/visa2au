#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Provision the Visa2AU ElevenLabs ElevenAgents lane (idempotent, stateful).

Lane: el-v4  (voice/lanes.json) — engine eleven_v4_turbo.

Creates, in order and only what is missing (state in elevenlabs_state.json):
  1. knowledge base  -> folder per language + one text doc per site page (kb/manifest.json)
  2. webhook tool    -> record_v2au_enquiry  ->  https://<host>/api/voice-lead
  3. workspace webhook (HMAC) -> https://<host>/api/voice-webhook   [post_call_transcription]
  4. agents          -> v2au-secretary EN / RU / FR  (prompt from voice/prompts/*.md,
                        KB folder + tool + end_call, data collection, privacy, limits)

Secrets are never written to the repo: tool/lead shared secret and the webhook HMAC secret
go to ~/.hermes/secrets/ and are printed once at the end for pasting into Pages env.

Env: ELEVENLABS_API_KEY (from .env.staging or the environment).
Usage:
  python3 scripts/provision_elevenlabs.py --dry-run
  python3 scripts/provision_elevenlabs.py [--only kb,tool,webhook,agents] [--host https://staging.visa2.au]
"""
from __future__ import annotations
import argparse, json, os, re, secrets, sys, time, urllib.error, urllib.request

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(HERE)
STATE_P = os.path.join(ROOT, "elevenlabs_state.json")
LANES_P = os.path.join(ROOT, "voice", "lanes.json")
PROMPTS = os.path.join(ROOT, "voice", "prompts")
MANIFEST = os.path.join(ROOT, "kb", "manifest.json")
SECRETS = os.path.expanduser("~/.hermes/secrets")
MODEL = "eleven_v4_turbo"
LANGS = ("en", "ru", "fr")

# ---------------------------------------------------------------- auth / http
def api_key() -> str:
    k = os.environ.get("ELEVENLABS_API_KEY")
    if k:
        return k.strip()
    for p in (os.path.join(ROOT, ".env.staging"), os.path.expanduser("~/.hermes/.env")):
        if os.path.isfile(p):
            for line in open(p):
                m = re.match(r"^ELEVENLABS_API_KEY=(.+)$", line.strip())
                if m:
                    return m.group(1).strip().strip('"').strip("'")
    sys.exit("ELEVENLABS_API_KEY not found (env or .env.staging)")

KEY: str = ""
API = "https://api.elevenlabs.io"
# ElevenLabs routes this workspace to the US host; keep configurable for a residency move.
BASE = os.environ.get("ELEVENLABS_BASE", API)

def _d(x):
    """API bodies are JSON objects on success; anything else (str/None) means failure."""
    return x if isinstance(x, dict) else {}


def req(method: str, path: str, body=None, ok=(200, 201), quiet=False):
    r = urllib.request.Request(BASE + path, method=method,
        data=json.dumps(body).encode() if body is not None else None,
        headers={"xi-api-key": KEY, "Content-Type": "application/json"})
    try:
        with urllib.request.urlopen(r, timeout=180) as resp:
            txt = resp.read().decode()
            return resp.status, (json.loads(txt) if txt else {})
    except urllib.error.HTTPError as e:
        raw = e.read().decode(errors="replace")
        try:
            d = json.loads(raw)
        except Exception:
            d = raw
        if not quiet:
            print(f"    ! {method} {path} -> {e.code}: {json.dumps(d)[:400] if isinstance(d, dict) else str(d)[:400]}", file=sys.stderr)
        return e.code, d

# ---------------------------------------------------------------- state
def load_state():
    return json.load(open(STATE_P)) if os.path.isfile(STATE_P) else {}

def save_state(s):
    json.dump(s, open(STATE_P, "w"), indent=1, ensure_ascii=False)

def secret_file(name: str, make: bool = False) -> str:
    p = os.path.join(SECRETS, name)
    if os.path.isfile(p):
        return open(p).read().strip()
    if not make:
        return ""
    os.makedirs(SECRETS, exist_ok=True)
    val = secrets.token_urlsafe(32)
    with open(p, "w") as fh:
        fh.write(val)
    os.chmod(p, 0o600)
    return val

# ---------------------------------------------------------------- lane spec
def load_lane():
    lanes = json.load(open(LANES_P))
    return next(l for l in lanes["lanes"] if l["id"] == "el-v4")

def prompt_for(lang: str) -> str:
    txt = open(os.path.join(PROMPTS, f"{lang}.md"), encoding="utf-8").read()
    txt = re.sub(r"<!--.*?-->", "", txt, flags=re.S)           # drop human-only comments
    txt = re.sub(r"^#\s+.*$", "", txt, count=1, flags=re.M)     # drop the H1 title line
    return txt.strip()

GREET = {
 "en": ("Hi, you've reached Visa2AU, Australian immigration. I'm the Visa2AU assistant — "
        "I'm not a migration agent, but I can explain how the different visas work and open the "
        "right page for you. What brings you here today?"),
 "ru": ("Здравствуйте, это Visa2AU, австралийская иммиграция. Я ассистент Visa2AU — я не миграционный "
        "агент, но могу рассказать, как устроены визы, и открыть нужную страницу. Что вас интересует?"),
 "fr": ("Bonjour, vous êtes bien chez Visa2AU, immigration australienne. Je suis l'assistant Visa2AU — "
        "je ne suis pas un agent de migration, mais je peux expliquer les visas et ouvrir la bonne page "
        "pour vous. Que puis-je faire pour vous ?"),
}

# subclass numbers read back as digits by the ASR -> biased keyterms for STT accuracy
KEYTERMS = ["MARN", "NAATI", "DAMA", "EOI", "ART", "CSOL", "SSIT", "SAF", "SBS", "LMT", "NOICC",
            "s56", "BVA", "BVB", "Subclass", "SID 482", "ENS 186", "Skills in Demand",
            "820", "801", "309", "100", "300", "482", "186", "494", "191", "189", "190", "491",
            "500", "600", "482", "407", "408", "400", "417", "462", "870", "103", "143", "173",
            "864", "866", "651", "602", "445", "461", "485", "Home Affairs", "Visa2AU"]

DATA_COLLECTION = {
    "full_name": {"type": "string", "description": "Caller's name as they gave it"},
    "email": {"type": "string", "description": "Email address for follow-up"},
    "phone": {"type": "string", "description": "Phone number in international format if given"},
    "messenger": {"type": "string", "enum": ["telegram", "whatsapp", "viber", "signal", "email", "phone", "none"],
                  "description": "Preferred messenger the caller confirmed they use"},
    "visa_interest": {"type": "string", "description": "Visa subclass or pathway mentioned, e.g. partner 820/801, SID 482, 189"},
    "situation": {"type": "string", "description": "One-line summary of the caller's immigration situation"},
    "wants_agent_contact": {"type": "boolean", "description": "Caller agreed a registered agent may contact them"},
    "consultation_ready": {"type": "boolean", "description": "Caller is ready to book the AUD 330 consultation"},
    "urgency": {"type": "boolean", "description": "Refusal, s56, NOICC, cancellation or a stated deadline"},
    "is_employer": {"type": "boolean", "description": "Caller is a business wanting to sponsor a worker"},
    "preferred_language": {"type": "string", "enum": ["en", "ru", "fr"],
                           "description": "Language the caller is speaking and prefers to be contacted in"},
    "notes": {"type": "string", "description": "Anything else useful for the agent"},
}

# ---------------------------------------------------------------- 1. knowledge base
def provision_kb(state, docs, only_dry):
    kb = state.setdefault("kb", {})
    for lang in LANGS:
        fkey = f"folder_{lang}"
        if fkey not in kb:
            if only_dry:
                print(f"  [dry] create KB folder v2au-secretary-{lang}")
            else:
                code, d = req("POST", "/v1/convai/knowledge-base/folder",
                              {"name": f"v2au-secretary-{lang}"})
                d = _d(d)
                if code not in (200, 201) or "id" not in d:
                    print(f"  KB folder {lang} FAILED ({code}) — skipping language", file=sys.stderr)
                    continue
                kb[fkey] = d["id"]
                save_state(state)
                print(f"  KB folder {lang}: {d['id']}")
        folder = kb.get(fkey)
        if not folder:
            continue
        lang_docs = [x for x in docs if x["metadata"]["lang"] == lang]
        done = kb.get(f"uploaded_{lang}", 0)
        kb[f"ids_{lang}"] = kb.get(f"ids_{lang}", {})
        for i in range(done, len(lang_docs)):
            doc = lang_docs[i]
            if only_dry:
                if i < done + 2:
                    print(f"  [dry] upload {lang}: {doc['name']}")
                continue
            code, d = req("POST", "/v1/convai/knowledge-base/text",
                          {"name": doc["name"], "text": doc["content"], "parent_folder_id": folder}, quiet=True)
            d = _d(d)
            if code not in (200, 201) or "id" not in d:
                print(f"  ! doc {i+1}/{len(lang_docs)} ({doc['name']}) -> {code} {str(d)[:200]}")
                if code in (402, 403):     # plan limit on KB size/ingestion
                    print("  KB limit hit — stopping. Attach fewer docs or upgrade the plan.")
                    break
                continue
            kb[f"ids_{lang}"][doc["name"]] = d["id"]
            kb[f"uploaded_{lang}"] = i + 1
            if (i + 1) % 10 == 0 or i + 1 == len(lang_docs):
                save_state(state)
                print(f"  KB {lang}: {i+1}/{len(lang_docs)}")
        if not only_dry:
            save_state(state)
    return kb

# ---------------------------------------------------------------- 2. webhook tool
def provision_tool(state, host, only_dry):
    if state.get("tool_id"):
        return state["tool_id"]
    lead_secret = secret_file("elevenlabs_lead_secret", make=not only_dry)
    if only_dry:
        print(f"  [dry] create webhook tool record_v2au_enquiry -> {host}/api/voice-lead")
        return None
    props = {}
    for k, v in DATA_COLLECTION.items():
        p = {"type": v["type"], "description": v.get("description", k.replace("_", " "))}
        if v.get("enum"):
            p["enum"] = v["enum"]
        props[k] = p
    tool = {"tool_config": {
        "type": "webhook",
        "name": "record_v2au_enquiry",
        "description": ("Save a qualified enquiry/lead captured during the call. Call this ONCE when you have "
                        "at least the caller's name and one contact channel. Include phone, messenger, "
                        "visa_interest, situation, wants_agent_contact, consultation_ready, urgency, "
                        "is_employer, preferred_language and notes where known."),
        "response_timeout_secs": 15,
        "execution_mode": "immediate",
        "pre_tool_speech": "off",
        "interruption_mode": "allow",
        "api_schema": {
            "url": f"{host}/api/voice-lead",
            "method": "POST",
            "request_headers": {"X-V2AU-Secret": lead_secret},
            "request_body_schema": {"type": "object", "properties": props,
                                    "required": ["full_name", "wants_agent_contact"]},
        },
    }}
    code, d = req("POST", "/v1/convai/tools", tool)
    d = _d(d)
    if code not in (200, 201) or "id" not in d:
        print(f"  tool creation FAILED ({code}) — agents will still carry the KB + data collection", file=sys.stderr)
        return None
    state["tool_id"] = d["id"]
    save_state(state)
    print(f"  tool: {d['id']}")
    return d["id"]

# ---------------------------------------------------------------- 2b. client tool
def provision_client_tool(state, only_dry):
    """navigate_website runs in the BROWSER (client tool), so the agent can open the
    right page mid-call without dropping it. Verified protocol event: client_tool_call."""
    if state.get("nav_tool_id"):
        return state["nav_tool_id"]
    if only_dry:
        print("  [dry] create client tool navigate_website")
        return None
    tool = {"tool_config": {
        "type": "client",
        "name": "navigate_website",
        "description": ("Open a page of the visa2.au website on the caller's screen while the call continues. "
                        "Use a path from the site, e.g. /visas/partner-visa-820-801, /pricing, /contact, "
                        "/urgent-visa-help, /employers, /visas/skills-in-demand-482."),
        "expects_response": True,
        "response_timeout_secs": 10,
        "execution_mode": "immediate",
        "pre_tool_speech": "off",
        "parameters": {"type": "object", "properties": {
            "path": {"type": "string", "description": "Site path starting with / — never a full external URL"}},
            "required": ["path"]},
    }}
    code, d = req("POST", "/v1/convai/tools", tool)
    d = _d(d)
    if code not in (200, 201) or "id" not in d:
        print(f"  client tool FAILED ({code}) — agent can still describe pages verbally", file=sys.stderr)
        return None
    state["nav_tool_id"] = d["id"]
    save_state(state)
    print(f"  client tool: {d['id']}")
    return d["id"]

# ---------------------------------------------------------------- 3. workspace webhook
def provision_webhook(state, host, only_dry):
    if state.get("webhook_id"):
        return state["webhook_id"]
    if only_dry:
        print(f"  [dry] create workspace webhook (HMAC) -> {host}/api/voice-webhook")
        return None
    code, d = req("POST", "/v1/workspace/webhooks", {"settings": {
        "auth_type": "hmac", "name": "visa2au-voice-reports",
        "webhook_url": f"{host}/api/voice-webhook"}})
    d = _d(d)
    if code not in (200, 201) or "webhook_id" not in d:
        print(f"  workspace webhook FAILED ({code})", file=sys.stderr)
        return None
    state["webhook_id"] = d["webhook_id"]
    save_state(state)
    if d.get("webhook_secret"):
        p = os.path.join(SECRETS, "elevenlabs_webhook_secret")
        os.makedirs(SECRETS, exist_ok=True)
        open(p, "w").write(d["webhook_secret"])
        os.chmod(p, 0o600)
    print(f"  webhook: {d['webhook_id']} (secret stored)")
    return d["webhook_id"]

# ---------------------------------------------------------------- 4. agents
def agent_body(lang, lane, kb_folder, tool_id, webhook_id, host, nav_tool_id=None):
    voices = lane["voices"]
    voice_id = (voices.get(lang) or {}).get("id") or (voices.get("en_fallback") or {}).get("id")
    tool_ids = [t for t in (tool_id, nav_tool_id) if t]
    prompt = {
        "prompt": prompt_for(lang),
        "llm": "gemini-2.5-flash",
        "temperature": 0.4,
        "max_tokens": -1,
        "tool_ids": tool_ids,
        "built_in_tools": {"end_call": {
            "type": "system", "name": "end_call", "description": "End the call politely when the caller says goodbye.",
            "params": {"system_tool_type": "end_call"}}},
        "knowledge_base": ([{"type": "folder", "id": kb_folder, "name": f"v2au-secretary-{lang}",
                             "usage_mode": "auto"}] if kb_folder else []),
        "rag": {"enabled": True},
        "timezone": "Australia/Sydney",
    }
    body = {
        "name": f"Visa2AU Secretary {lang.upper()} (v4 turbo)",
        "tags": ["visa2au", "website", "el-v4"],
        "conversation_config": {
            "agent": {"first_message": GREET[lang], "language": lang, "prompt": prompt,
                      "dynamic_variables": {"dynamic_variable_placeholders": {
                          "page_context": "unknown", "visitor_country": "unknown"}}},
            "tts": {"model_id": MODEL, "voice_id": voice_id, "stability": 0.5,
                    "similarity_boost": 0.75, "speed": 1.0, "optimize_streaming_latency": 3,
                    "text_normalisation_type": "system_prompt",
                    "agent_output_audio_format": "pcm_24000"},
            "asr": {"quality": "high", "provider": "scribe_realtime",
                    "user_input_audio_format": "pcm_16000", "keywords": KEYTERMS},
            "turn": {"turn_timeout": 12.0, "turn_eagerness": "normal", "mode": "turn",
                     "silence_end_call_timeout": 25.0, "spelling_patience": "auto",
                     "speculative_turn": True, "turn_model": "turn_v2"},
            "conversation": {"max_duration_seconds": 360, "text_only": False},
            "vad": {"background_voice_detection": False},
        },
        "platform_settings": {
            "data_collection": DATA_COLLECTION,
            "workspace_overrides": {"webhooks": {
                "post_call_webhook_id": webhook_id, "events": ["transcript"],
                "transcript_format": "json", "exclude_transcript": False, "send_audio": False}},
            "privacy": {"record_voice": True, "retention_days": 180,
                        "delete_transcript_and_pii": True, "delete_audio": True,
                        "zero_retention_mode": False},
            "call_limits": {"daily_limit": 500, "bursting_enabled": True, "agent_concurrency_limit": 2},
            "guardrails": {
                "version": "1",   # discriminator is a STRING tag, not an int
                "prompt_injection": {"is_enabled": True},
                "content": {"is_enabled": True, "execution_mode": "streaming",
                            "config": {"category": "other"}},
            },
            "summary_language": lang,
        },
    }
    return body

def provision_agents(state, lane, kb, tool_id, webhook_id, host, only_dry, force=False, nav_tool_id=None):
    agents = state.setdefault("agents", {})
    for lang in LANGS:
        aid = agents.get(lang)
        body = agent_body(lang, lane, kb.get(f"folder_{lang}"), tool_id, webhook_id, host, nav_tool_id)
        if aid and not force:
            print(f"  agent {lang}: exists {aid} (use --force to re-apply config)")
            continue
        if only_dry:
            print(f"  [dry] create agent {lang} (voice {body['conversation_config']['tts']['voice_id']}, "
                  f"model {MODEL}, kb {kb.get(f'folder_{lang}')}, tool {tool_id})")
            continue
        if aid:
            code, d = req("PATCH", f"/v1/convai/agents/{aid}", body)
            if code == 200:
                print(f"  agent {lang}: updated {aid}")
                continue
            print(f"  agent {lang}: update failed ({code}), creating a fresh agent", file=sys.stderr)
        code, d = req("POST", "/v1/convai/agents/create", body)
        if code not in (200, 201):
            print(f"  agent {lang} CREATE FAILED ({code})", file=sys.stderr)
            continue
        agents[lang] = d.get("agent_id") or d.get("id")
        save_state(state)
        print(f"  agent {lang}: {agents[lang]}")

# ---------------------------------------------------------------- main
def main():
    global KEY
    ap = argparse.ArgumentParser()
    ap.add_argument("--host", default="https://staging.visa2.au", help="site base URL for callbacks")
    ap.add_argument("--only", default="kb,tool,webhook,agents")
    ap.add_argument("--dry-run", action="store_true")
    ap.add_argument("--force", action="store_true", help="re-apply agent config over existing agents")
    a = ap.parse_args()
    steps = {s.strip() for s in a.only.split(",") if s.strip()}
    KEY = api_key()
    lane = load_lane()
    docs = json.load(open(MANIFEST))["documents"]
    state = load_state()

    print(f"Visa2AU ElevenLabs lane '{lane['id']}' -> {BASE}  (host {a.host})")
    counts = {l: sum(1 for x in docs if x["metadata"]["lang"] == l) for l in LANGS}
    print(f"  site docs available: {len(docs)} ({', '.join(f'{k}:{v}' for k, v in counts.items())})")
    if a.dry_run:
        print("  DRY RUN — nothing will be written")

    kb = state.get("kb", {})
    if "kb" in steps:
        print("1) knowledge base")
        provision_kb(state, docs, a.dry_run)
        kb = state.get("kb", {})
    tool_id = state.get("tool_id")
    nav_tool_id = state.get("nav_tool_id")
    if "tool" in steps:
        print("2) webhook tool")
        tool_id = provision_tool(state, a.host, a.dry_run) or tool_id
        print("2b) client tool (navigate_website)")
        nav_tool_id = provision_client_tool(state, a.dry_run) or nav_tool_id
    webhook_id = state.get("webhook_id")
    if "webhook" in steps:
        print("3) workspace webhook (post-call transcript -> Resend)")
        webhook_id = provision_webhook(state, a.host, a.dry_run) or webhook_id
    if "agents" in steps:
        print("4) agents")
        provision_agents(state, lane, kb, tool_id, webhook_id, a.host, a.dry_run, a.force, nav_tool_id)

    save_state(state)
    print("\nstate:", STATE_P)
    print("agent ids:", json.dumps(state.get("agents", {}), ensure_ascii=False))
    print("\nSet these in Cloudflare Pages env (staging):")
    print(f"  VOICE_PROVIDER=el-v4")
    print(f"  ELEVENLABS_AGENT_EN={state.get('agents',{}).get('en','')}")
    print(f"  ELEVENLABS_AGENT_RU={state.get('agents',{}).get('ru','')}")
    print(f"  ELEVENLABS_AGENT_FR={state.get('agents',{}).get('fr','')}")
    print(f"  VOICE_LEAD_SECRET=<contents of ~/.hermes/secrets/elevenlabs_lead_secret>")
    print(f"  VOICE_WEBHOOK_SECRET=<contents of ~/.hermes/secrets/elevenlabs_webhook_secret>")

if __name__ == "__main__":
    main()
