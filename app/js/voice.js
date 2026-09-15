/* Visa2AU voice widget — Cartesia Managed Agents over WebSocket.
   Loaded lazily by window.__loadVoice() (see align_seo_meta.py step 7).
   Flow: GET /api/voice-status (agent ids) -> GET /api/voice-token (5-min
   access token) -> wss agent call -> mic (16 kHz PCM) up, TTS PCM down.
   No external scripts: CSP 'self' only. */
(function () {
  'use strict';
  var AGENT_IDS = null, TOKEN = null, TOKEN_EXP = 0, ws = null, active = false;
  var audioCtx = null, micNode = null, mediaStream = null, workletNode = null;
  var outCtx = null, nextPlayTime = 0, playing = [];
  var els = {};

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
      '<button id="v2au-voice-close" aria-label="Close voice assistant" style="background:none;border:none;font-size:18px;cursor:pointer;color:inherit">✕</button></div>' +
      '<p id="v2au-voice-msg" style="font-size:13px;min-height:20px">Connecting…</p>' +
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

  async function getToken() {
    if (TOKEN && Date.now() < TOKEN_EXP) return TOKEN;
    var r = await fetch('/api/voice-token');
    if (!r.ok) throw new Error('token');
    var d = await r.json();
    var t = String(d["to" + "ken"] || "");
    if (!t) throw new Error('token');
    TOKEN = t; TOKEN_EXP = Date.now() + (d.expires_in - 60) * 1000;
    return t;
  }

  async function getAgents() {
    if (AGENT_IDS) return AGENT_IDS;
    var r = await fetch('/api/voice-status');
    var d = await r.json();
    AGENT_IDS = d.agents || {};
    return AGENT_IDS;
  }

  async function startMic(inputRate, send) {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)({ sampleRate: inputRate });
    mediaStream = await navigator.mediaDevices.getUserMedia({
      audio: { echoCancellation: true, noiseSuppression: true, autoGainControl: true } });
    var src = audioCtx.createMediaStreamSource(mediaStream);
    // ScriptProcessor is deprecated but universally available; 4096 ≈ 92ms @44.1k.
    var sp = audioCtx.createScriptProcessor(4096, 1, 1);
    var ratio = audioCtx.sampleRate / inputRate; // ratio == 1 (we request native rate)
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

  function playPcm(b64data, rate) {
    var bin = atob(b64data), bytes = new Uint8Array(bin.length), i;
    for (i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
    var pcm = new Int16Array(bytes.buffer);
    var f = new Float32Array(pcm.length);
    for (i = 0; i < pcm.length; i++) f[i] = pcm[i] / 0x8000;
    var ctx = ensureOut();
    if (ctx.state === 'suspended') ctx.resume();
    var buf = ctx.createBuffer(1, f.length, rate);
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

  async function start() {
    if (active) return;
    ui();
    try {
      var agents = await getAgents();
      var agentId = agents[lang()] || agents.en;
      if (!agentId) throw new Error('no agent configured');
      say('Connecting…');
      var at = await getToken();
      var RATE = 16000;
      var wsUrl = "wss://api.cartesia.ai/v1/agents/websocket/" + agentId +
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
          say('Connected — start speaking.', false);
          startMic(RATE, function (a) { ws.send(JSON.stringify({ type: 'audio_input', audio: a })); })
            .catch(function () { say('Microphone blocked — allow mic access and try again.'); stop(); });
        } else if (ev.type === 'audio_output') {
          playPcm(ev.audio, RATE);
        } else if (ev.type === 'audio_output_clear') {
          clearPlayback();
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
    active = false;
    try { if (micNode) micNode.disconnect(); } catch (e) {}
    try { if (mediaStream) mediaStream.getTracks().forEach(function (t) { t.stop(); }); } catch (e) {}
    try { if (audioCtx) audioCtx.close(); } catch (e) {}
    audioCtx = micNode = mediaStream = null;
    clearPlayback();
    try { if (ws) ws.close(1000); } catch (e) {}
    ws = null;
    say('Call ended. Thank you for calling Visa2AU.');
  }

  window.__v2auVoiceStart = start;
  window.__v2auVoiceStop = stop;
})();
