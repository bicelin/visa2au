/* Visa2AU voice widget — ElevenLabs Agents lane (el-v4) over the raw WebSocket API.
   Loaded lazily by window.__loadVoice() (see scripts/voice-status.ts + the inline
   loader); the vendor file is chosen by /api/voice-status.adapter, so switching
   lanes never edits a page.

   Deliberately dependency-free: @elevenlabs/client cannot run unbundled (4.2 MB,
   57 ESM files, bare `livekit-client` import) and the site's CSP is 'self'-first,
   so we speak the wire protocol directly — exactly as /js/voice.js does for Cartesia.

   PROTOCOL — verified against a live agent 2026-10-12 (ws probe):
     server -> {"type":"conversation_initiation_metadata",
                "conversation_initiation_metadata_event":{conversation_id,
                agent_output_audio_format:"pcm_24000",user_input_audio_format:"pcm_16000"}}
     server -> {"type":"agent_response","agent_response_event":{agent_response,event_id}}
     server -> {"type":"audio","audio_event":{audio_base_64,event_id,alignment,is_final}}
     server -> {"type":"interruption","interruption_event":{reason}}
     server -> {"type":"user_transcript","user_transcription_event":{user_transcript}}
     server -> {"type":"client_tool_call","client_tool_call":{tool_name,tool_call_id,parameters}}
     server -> {"type":"ping","ping_event":{event_id}}   -> client MUST reply pong
   UNVERIFIED (a mic was not available to the probe — flagged, not guessed):
     client mic frame field name `user_audio_chunk`; if the server ignores audio,
     check this first against the current WebSocket API reference.
*/
(function () {
  'use strict';
  var IN_RATE = 16000;    // user_input_audio_format  pcm_16000
  var OUT_RATE = 24000;   // agent_output_audio_format pcm_24000  (verified)
  var ws = null, active = false, connecting = false;
  var audioCtx = null, micNode = null, mediaStream = null;
  var outCtx = null, nextPlayTime = 0, playing = [], speechEndAt = 0;
  var els = {}, CALL_LANG = 'en';
  var AGENT_IDS = null, TOKEN_ENDPOINT = '/api/voice-el-token';

  function $(id) { return document.getElementById(id); }

  function ui() {
    if (els.panel) return;
    var p = document.createElement('div');
    p.id = 'v2au-voice-panel';
    p.setAttribute('role', 'dialog');
    p.setAttribute('aria-label', 'Visa2AU voice assistant');
    p.innerHTML =
      '<div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:8px">' +
      '<strong style="font-size:14px">Visa2AU voice assistant</strong>' +
      '<button id="v2au-voice-close" aria-label="End voice call" style="background:none;border:none;font-size:18px;cursor:pointer;color:inherit">✕</button></div>' +
      '<p id="v2au-voice-msg" style="font-size:13px;min-height:20px">Connecting…</p>' +
      '<p style="font-size:11px;opacity:.6;margin-top:2px">The call stays alive while you browse the site.</p>' +
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

  async function getStatus() {
    if (AGENT_IDS) return AGENT_IDS;
    var r = await fetch('/api/voice-status');
    var d = await r.json();
    AGENT_IDS = d.agents || {};
    if (d.tokenEndpoint) TOKEN_ENDPOINT = d.tokenEndpoint;
    return AGENT_IDS;
  }

  async function getSignedUrl(l) {
    var r = await fetch(TOKEN_ENDPOINT + '?lang=' + encodeURIComponent(l));
    if (!r.ok) throw new Error('auth');
    var d = await r.json();
    if (!d.url) throw new Error('auth');
    return d.url;
  }

  /* ---------------- soft navigation (call survives browsing) ---------------- */
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
        var nm = doc.querySelector('main'), om = document.querySelector('main');
        if (nm && om) {
          om.innerHTML = nm.innerHTML;
          om.querySelectorAll('.reveal').forEach(function (el) { el.classList.add('is-visible'); });
          om.scrollIntoView({ block: 'start' });
        }
        document.title = doc.title || document.title;
        window.scrollTo(0, 0);
        say('Opened: ' + ((doc.title || url).split('|')[0].trim()), true);
        // tell the agent what the caller is now looking at (documented client frame)
        if (ws && ws.readyState === 1) ws.send(JSON.stringify({ type: 'contextual_update', text: 'User is now viewing ' + url }));
      })
      .catch(function () { location.href = url; /* honest fallback: full nav drops the call */ });
  }

  document.addEventListener('click', function (e) {
    if (!active) return;
    var a = e.target && e.target.closest ? e.target.closest('a') : null;
    if (!a || !isInternalPage(a)) return;
    e.preventDefault();
    var u = new URL(a.getAttribute('href'), location.href);
    softGo(u.pathname + u.hash);
    history.pushState({ v2auSoft: 1 }, '', u.pathname + u.hash);
  }, true);

  window.addEventListener('popstate', function () { if (active) softGo(location.pathname); });

  /* ---------------- audio plumbing ---------------- */
  async function startMic(send) {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)({ sampleRate: IN_RATE });
    mediaStream = await navigator.mediaDevices.getUserMedia({
      audio: { echoCancellation: true, noiseSuppression: true, autoGainControl: true } });
    var src = audioCtx.createMediaStreamSource(mediaStream);
    var sp = audioCtx.createScriptProcessor(4096, 1, 1);
    sp.onaudioprocess = function (e) {
      if (!ws || ws.readyState !== 1 || !active) return;
      // Half-duplex gate: the browser has no echo reference for WebAudio playback,
      // so the agent would hear itself through our mic and interrupt itself.
      if (playing.length > 0 || Date.now() - speechEndAt < 350) return;
      var inp = e.inputBuffer.getChannelData(0);
      var pcm = new Int16Array(inp.length);
      for (var i = 0; i < inp.length; i++) {
        var s = Math.max(-1, Math.min(1, inp[i]));
        pcm[i] = s < 0 ? s * 0x8000 : s * 0x7FFF;
      }
      send(b64(pcm.buffer));
    };
    var sink = audioCtx.createGain(); sink.gain.value = 0; sink.connect(audioCtx.destination);
    src.connect(sp); sp.connect(sink);
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
    var buf = ctx.createBuffer(1, f.length, OUT_RATE);
    buf.getChannelData(0).set(f);
    var now = ctx.currentTime;
    if (nextPlayTime < now + 0.02) nextPlayTime = now + 0.02;
    var node = ctx.createBufferSource();
    node.buffer = buf; node.connect(ctx.destination);
    node.start(nextPlayTime);
    nextPlayTime += buf.duration;
    playing.push(node);
    node.onended = function () {
      playing = playing.filter(function (x) { return x !== node; });
      if (playing.length === 0) speechEndAt = Date.now();
    };
  }

  function clearPlayback() {
    playing.forEach(function (n) { try { n.stop(); } catch (e) {} });
    playing = []; nextPlayTime = 0;
  }

  /* ---------------- client tool: navigate_website ---------------- */
  function handleToolCall(tc) {
    var id = tc && tc.tool_call_id;
    if (!tc || tc.tool_name !== 'navigate_website') {
      if (id) ws.send(JSON.stringify({ type: 'client_tool_result', tool_call_id: id, result: 'unknown tool', is_error: true }));
      return;
    }
    var p = (tc.parameters || {}).path || '/';
    var u;
    try { u = new URL(p, location.origin); } catch (e) { u = null; }
    if (!u || u.origin !== location.origin) {
      if (id) ws.send(JSON.stringify({ type: 'client_tool_result', tool_call_id: id, result: 'rejected: off-site path', is_error: true }));
      return;
    }
    softGo(u.pathname + (u.hash || ''));
    history.pushState({ v2auSoft: 1 }, '', u.pathname + (u.hash || ''));
    if (id) ws.send(JSON.stringify({ type: 'client_tool_result', tool_call_id: id, result: 'page opened: ' + u.pathname, is_error: false }));
  }

  /* ---------------- call lifecycle ---------------- */
  async function start() {
    if (active || connecting) return;
    connecting = true;
    ui();
    try {
      var agents = await getStatus();
      CALL_LANG = lang();
      if (!agents[CALL_LANG] && !agents.en) throw new Error('no agent configured');
      say('Connecting…');
      var url = await getSignedUrl(CALL_LANG);
      ws = new WebSocket(url);
      ws.onopen = function () {
        var init = { type: 'conversation_initiation_client_data' };
        var cfg = (window.__v2auVoiceInit || null);
        if (cfg) init.conversation_config_override = cfg;
        ws.send(JSON.stringify(init));
      };
      ws.onmessage = function (m) {
        var ev;
        try { ev = JSON.parse(m.data); } catch (e) { return; }
        if (ev.type === 'conversation_initiation_metadata') {
          active = true; connecting = false;
          say('Connected — start speaking. Keep browsing; the call stays open.', false);
          startMic(function (a) {
            if (ws && ws.readyState === 1) ws.send(JSON.stringify({ user_audio_chunk: a }));
          }).catch(function () { say('Microphone blocked — allow mic access and try again.'); stop(); });
        } else if (ev.type === 'audio') {
          var ae = ev.audio_event || {};
          if (ae.audio_base_64) playPcm(ae.audio_base_64);
        } else if (ev.type === 'interruption') {
          clearPlayback();   // real barge-in (mic is gated while the agent speaks)
        } else if (ev.type === 'agent_response') {
          var t = ((ev.agent_response_event || {}).agent_response || '').trim();
          if (t) say('🗣 ' + t.slice(0, 140), true);
        } else if (ev.type === 'user_transcript') {
          var u = ((ev.user_transcription_event || {}).user_transcript || '').trim();
          if (u) say('🧑 ' + u.slice(0, 140), true);
        } else if (ev.type === 'client_tool_call') {
          handleToolCall(ev.client_tool_call || {});
        } else if (ev.type === 'ping') {
          ws.send(JSON.stringify({ type: 'pong', event_id: (ev.ping_event || {}).event_id }));
        }
      };
      ws.onclose = function () { stop(); };
      ws.onerror = function () { say('Connection problem — please try again.'); };
    } catch (e) {
      connecting = false;
      say('Could not start the voice assistant.');
      stop();
    }
  }

  function stop() {
    var was = active;
    active = false; connecting = false;
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
