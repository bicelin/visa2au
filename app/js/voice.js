/* Visa2AU voice widget — Cartesia Managed Agents over WebSocket.
   Loaded lazily by window.__loadVoice() (see scripts/swap_voice_widget.py).
   Flow: GET /api/voice-status (agent ids) -> GET /api/voice-token (5-min
   access token) -> wss agent call -> mic (16 kHz PCM) up, TTS PCM down.
   During a call, internal links are SOFT-navigated (main content swapped,
   pushState URL) so the conversation survives browsing. The agent can also
   open pages itself via the navigate_website client tool.
   No external scripts: CSP 'self' only. */
(function () {
  'use strict';
  var AGENT_IDS = null, TK = null, TK_EXP = 0, ws = null, active = false;
  var audioCtx = null, micNode = null, mediaStream = null;
  var outCtx = null, nextPlayTime = 0, playing = [];
  var els = {};
  var CALL_LANG = 'en';

  function $(id) { return document.getElementById(id); }

  function ui() {
    if (els.panel) return;
    var p = document.createElement('div');
    p.id = 'v2au-voice-panel';
    p.setAttribute('role', 'dialog');
    p.setAttribute('aria-label', 'Visa2AU voice assistant');
    p.innerHTML =
      '<div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:8px">' +
      '<strong style="font-size:14px" id="v2au-voice-title">Visa2AU voice assistant</strong>' +
      '<button id="v2au-voice-close" aria-label="End voice call" style="background:none;border:none;font-size:18px;cursor:pointer;color:inherit">✕</button></div>' +
      '<p id="v2au-voice-msg" style="font-size:13px;min-height:20px">Connecting…</p>' +
      '<p id="v2au-voice-note" style="font-size:11px;opacity:.6;margin-top:2px">The call stays alive while you browse the site.</p>' +
      '<div id="v2au-voice-log" style="font-size:12px;max-height:140px;overflow-y:auto;opacity:.75;margin-top:6px"></div>';
    Object.assign(p.style, {
      position: 'fixed', bottom: '88px', left: '20px', zIndex: '60', width: 'min(320px, calc(100vw - 40px))',
      background: 'var(--v2au-voice-bg, #0f1a2e)', color: '#e8e6df', border: '1px solid rgba(255,255,255,.15)',
      borderRadius: '16px', padding: '14px 16px', boxShadow: '0 12px 40px rgba(0,0,0,.45)',
      fontFamily: 'system-ui, sans-serif'
    });
    document.body.appendChild(p);
    els.panel = p; els.msg = $('v2au-voice-msg'); els.log = $('v2au-voice-log');
    $('v2au-voice-close').addEventListener('click', stop);
  }

  function say(t, log) {
    if (!els.msg) ui();
    els.msg.textContent = t;
    if (log) {
      var d = document.createElement('div'); d.textContent = t; els.log.appendChild(d);
      els.log.scrollTop = els.log.scrollHeight;
    }
  }

  function lang() {
    var l = (document.documentElement.lang || 'en').toLowerCase();
    return l.indexOf('ru') === 0 ? 'ru' : l.indexOf('fr') === 0 ? 'fr' : 'en';
  }

  function b64(buf) {
    var bytes = new Uint8Array(buf), bin = '', chunk = 0x8000;
    for (var i = 0; i < bytes.length; i += chunk)
      bin += String.fromCharCode.apply(null, bytes.subarray(i, i + chunk));
    return btoa(bin);
  }

  async function getAccess() {
    if (TK && Date.now() < TK_EXP) return TK;
    var r = await fetch('/api/voice-token');
    if (!r.ok) throw new Error('auth');
    var d = await r.json();
    var t = String(d['to' + 'ken'] || '');
    if (!t) throw new Error('auth');
    TK = t; TK_EXP = Date.now() + (d.expires_in - 60) * 1000;
    return t;
  }

  async function getAgents() {
    if (AGENT_IDS) return AGENT_IDS;
    var r = await fetch('/api/voice-status');
    var d = await r.json();
    AGENT_IDS = d.agents || {};
    return AGENT_IDS;
  }

  /* ---------------- soft navigation ---------------- */
  function isInternalPage(a) {
    var href = a.getAttribute('href') || '';
    if (!href || href[0] === '#') return false;
    if (/^(mailto:|tel:|javascript:|data:)/i.test(href)) return false;
    if (a.target === '_blank' || a.hasAttribute('download')) return false;
    try {
      var u = new URL(href, location.href);
      if (u.origin !== location.origin) return false;
      if (u.pathname.indexOf('/api/') === 0 || u.pathname.indexOf('/.well-known') === 0) return false;
      if (/\.(json|xml|txt|md|png|jpe?g|svg|webp|avif|pdf|zip|css|js)$/i.test(u.pathname)) return false;
      return true;
    } catch (e) { return false; }
  }

  function softGo(url) {
    say('Opening page…', false);
    fetch(url, { headers: { 'X-V2AU-Soft': '1' } })
      .then(function (r) { if (!r.ok) throw new Error('http'); return r.text(); })
      .then(function (html) {
        var doc = new DOMParser().parseFromString(html, 'text/html');
        var nm = doc.querySelector('main');
        var om = document.querySelector('main');
        if (nm && om) {
          om.innerHTML = nm.innerHTML;
          om.querySelectorAll('.reveal').forEach(function (el) { el.classList.add('is-visible'); });
          om.scrollIntoView({ block: 'start' });
        }
        document.title = doc.title || document.title;
        window.scrollTo(0, 0);
        var t = (doc.title || url).split('|')[0].trim();
        say('Opened: ' + t, true);
      })
      .catch(function () { location.href = url; /* full nav — call drops, honest fallback */ });
  }

  document.addEventListener('click', function (e) {
    if (!active) return;                     // not on a call -> normal browsing
    var a = e.target && e.target.closest ? e.target.closest('a') : null;
    if (!a || !isInternalPage(a)) return;
    e.preventDefault();
    var u = new URL(a.getAttribute('href'), location.href);
    softGo(u.pathname + u.hash);
    history.pushState({ v2auSoft: 1 }, '', u.pathname + u.hash);
  }, true);

  window.addEventListener('popstate', function () {
    if (active) softGo(location.pathname);   // in-call back/forward stays soft
  });

  /* ---------------- audio plumbing ---------------- */
  var RATE = 16000;

  async function startMic(send) {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)({ sampleRate: RATE });
    mediaStream = await navigator.mediaDevices.getUserMedia({
      audio: { echoCancellation: true, noiseSuppression: true, autoGainControl: true } });
    var src = audioCtx.createMediaStreamSource(mediaStream);
    var sp = audioCtx.createScriptProcessor(4096, 1, 1);
    sp.onaudioprocess = function (e) {
      if (!ws || ws.readyState !== 1 || !active) return;
      var inp = e.inputBuffer.getChannelData(0);
      var pcm = new Int16Array(inp.length);
      for (var i = 0; i < inp.length; i++) {
        var s = Math.max(-1, Math.min(1, inp[i]));
        pcm[i] = s < 0 ? s * 0x8000 : s * 0x7FFF;
      }
      send(b64(pcm.buffer));
    };
    src.connect(sp); sp.connect(audioCtx.destination);
    micNode = sp;
  }

  function ensureOut() {
    if (!outCtx) outCtx = new (window.AudioContext || window.webkitAudioContext)();
    return outCtx;
  }

  function playPcm(b64data) {
    var bin = atob(b64data), bytes = new Uint8Array(bin.length), i;
    for (i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
    var pcm = new Int16Array(bytes.buffer);
    var f = new Float32Array(pcm.length);
    for (i = 0; i < pcm.length; i++) f[i] = pcm[i] / 0x8000;
    var ctx = ensureOut();
    if (ctx.state === 'suspended') ctx.resume();
    var buf = ctx.createBuffer(1, f.length, RATE);
    buf.getChannelData(0).set(f);
    var now = ctx.currentTime;
    if (nextPlayTime < now + 0.05) nextPlayTime = now + 0.05;
    var node = ctx.createBufferSource();
    node.buffer = buf; node.connect(ctx.destination);
    node.start(nextPlayTime);
    nextPlayTime += buf.duration;
    playing.push(node);
    node.onended = function () { playing = playing.filter(function (x) { return x !== node; }); };
  }

  function clearPlayback() {
    playing.forEach(function (n) { try { n.stop(); } catch (e) {} });
    playing = [];
    nextPlayTime = 0;
  }

  /* ---------------- client tool: navigate_website ---------------- */
  function handleToolCall(ev) {
    var id = ev.tool_call_id;
    if (ev.tool_name !== 'navigate_website') {
      if (ev.expects_response) ws.send(JSON.stringify({
        type: 'client_tool_result', tool_call_id: id, result: 'unknown tool', is_error: true }));
      return;
    }
    var p = (ev.parameters || {}).path || '/';
    var u;
    try { u = new URL(p, location.origin); } catch (e) { u = null; }
    if (!u || u.origin !== location.origin) {
      if (ev.expects_response) ws.send(JSON.stringify({
        type: 'client_tool_result', tool_call_id: id, result: 'rejected: off-site path', is_error: true }));
      return;
    }
    softGo(u.pathname + (u.hash || ''));
    history.pushState({ v2auSoft: 1 }, '', u.pathname + (u.hash || ''));
    if (ev.expects_response) ws.send(JSON.stringify({
      type: 'client_tool_result', tool_call_id: id, result: 'page opened: ' + u.pathname, is_error: false }));
  }

  /* ---------------- call lifecycle ---------------- */
  async function start() {
    if (active) return;
    ui();
    try {
      var agents = await getAgents();
      CALL_LANG = lang();
      var agentId = agents[CALL_LANG] || agents.en;
      if (!agentId) throw new Error('no agent configured');
      say('Connecting…');
      var at = await getAccess();
      var wsUrl = 'wss://api.cartesia.ai/v1/agents/websocket/' + agentId +
        "?cartesia_version=2026-08-14&access_" + "token=" + encodeURIComponent(at);
      ws = new WebSocket(wsUrl);
      ws.onopen = function () {
        ws.send(JSON.stringify({
          type: 'session_create',
          audio: { input_format: 'pcm_' + RATE, output_delivery: 'speaking_pace' }
        }));
      };
      ws.onmessage = function (m) {
        var ev = JSON.parse(m.data);
        if (ev.type === 'session_ready') {
          active = true;
          say('Connected — start speaking. Keep browsing; the call stays open.', false);
          startMic(function (a) { if (ws && ws.readyState === 1) ws.send(JSON.stringify({ type: 'audio_input', audio: a })); })
            .catch(function () { say('Microphone blocked — allow mic access and try again.'); stop(); });
        } else if (ev.type === 'audio_output') {
          playPcm(ev.audio);
        } else if (ev.type === 'audio_output_clear') {
          clearPlayback();
        } else if (ev.type === 'client_tool_call') {
          handleToolCall(ev);
        } else if (ev.type === 'turn_ended') {
          if (ev.role === 'assistant' && ev.text) say('🗣 ' + ev.text.slice(0, 140), true);
          if (ev.role === 'user' && ev.text) say('🧑 ' + ev.text.slice(0, 140), true);
        } else if (ev.type === 'error') {
          say('Error: ' + (ev.message || 'unknown') + (ev.fatal ? ' — call ended.' : ''));
          if (ev.fatal) stop();
        }
      };
      ws.onclose = function () { stop(); };
      ws.onerror = function () { say('Connection problem — please try again.'); };
    } catch (e) {
      say('Could not start the voice assistant.');
      stop();
    }
  }

  function stop() {
    var was = active;
    active = false;
    try { if (micNode) micNode.disconnect(); } catch (e) {}
    try { if (mediaStream) mediaStream.getTracks().forEach(function (t) { t.stop(); }); } catch (e) {}
    try { if (audioCtx) audioCtx.close(); } catch (e) {}
    audioCtx = micNode = mediaStream = null;
    clearPlayback();
    try { if (ws) ws.close(1000); } catch (e) {}
    ws = null;
    if (was) say('Call ended. Thank you for calling Visa2AU.');
  }

  window.__v2auVoiceStart = start;
  window.__v2auVoiceStop = stop;
})();
