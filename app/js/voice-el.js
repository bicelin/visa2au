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
  var ws = null, active = false, connecting = false, stopping = false, muted = false;
  var audioCtx = null, micNode = null, mediaStream = null;
  var outCtx = null, nextPlayTime = 0, playing = [], speechEndAt = 0;
  var els = {}, CALL_LANG = 'en';
  var AGENT_IDS = null, TOKEN_ENDPOINT = '/api/voice-el-token';

  /* UI strings follow the PAGE language, so a Russian or French visitor sees a
     localized panel even though the same adapter file serves every locale. */
  var I18N = {
    en: {
      title: 'Visa2AU voice assistant', close: 'End voice call', connecting: 'Connecting…',
      connected: 'Connected — start speaking. Keep browsing; the call stays open.',
      micBlocked: 'Microphone blocked — allow mic access in your browser and try again.',
      micMissing: 'No microphone found — connect one, or call us on +61 2 9136 2462.',
      insecure: 'The microphone needs an https connection.', retry: 'Try again',
      mute: 'Mute microphone', unmute: 'Unmute microphone', endCall: 'End call',
      listening: 'Listening…', speaking: 'Speaking…', assistant: 'Visa2AU assistant',
      fail: 'Could not start the voice assistant.', opening: 'Opening page…', opened: 'Opened: ',
      pageFail: 'That page could not be opened.', ended: 'Call ended. Thank you for calling Visa2AU.',
      netErr: 'Connection problem — please try again.',
      stays: 'The call stays alive while you browse the site.'
    },
    ru: {
      title: 'Голосовой помощник Visa2AU', close: 'Завершить звонок', connecting: 'Подключение…',
      connected: 'Соединение установлено — говорите. Можно листать сайт, звонок не прервётся.',
      micBlocked: 'Микрофон заблокирован — разрешите доступ в браузере и попробуйте снова.',
      micMissing: 'Микрофон не найден — подключите его или позвоните нам: +61 2 9136 2462.',
      insecure: 'Для микрофона нужно соединение https.', retry: 'Попробовать снова',
      mute: 'Выключить микрофон', unmute: 'Включить микрофон', endCall: 'Завершить звонок',
      listening: 'Слушаю…', speaking: 'Говорю…', assistant: 'Ассистент Visa2AU',
      fail: 'Не удалось запустить голосового помощника.', opening: 'Открываю страницу…', opened: 'Открыто: ',
      pageFail: 'Эту страницу открыть не удалось.', ended: 'Звонок завершён. Спасибо, что обратились в Visa2AU.',
      netErr: 'Проблема с соединением — попробуйте ещё раз.',
      stays: 'Звонок остаётся активным, пока вы просматриваете сайт.'
    },
    fr: {
      title: 'Assistant vocal Visa2AU', close: 'Terminer l’appel', connecting: 'Connexion…',
      connected: 'Connecté — parlez. Vous pouvez naviguer sur le site, l’appel continue.',
      micBlocked: 'Micro bloqué — autorisez l’accès dans votre navigateur puis réessayez.',
      micMissing: 'Aucun microphone détecté — connectez-en un ou appelez le +61 2 9136 2462.',
      insecure: 'Le microphone nécessite une connexion https.', retry: 'Réessayer',
      mute: 'Couper le micro', unmute: 'Activer le micro', endCall: 'Terminer l’appel',
      listening: 'J’écoute…', speaking: 'Je parle…', assistant: 'Assistant Visa2AU',
      fail: 'Impossible de démarrer l’assistant vocal.', opening: 'Ouverture de la page…', opened: 'Ouvert : ',
      pageFail: 'Cette page n’a pas pu être ouverte.', ended: 'Appel terminé. Merci d’avoir contacté Visa2AU.',
      netErr: 'Problème de connexion — veuillez réessayer.',
      stays: 'L’appel reste actif pendant que vous naviguez sur le site.'
    }
  };
  function T() { return I18N[CALL_LANG] || I18N.en; }

  function $(id) { return document.getElementById(id); }

  /* ---------------- panel: orb + mute + hang up ---------------- */
  function injectCss() {
    if (document.getElementById('v2au-voice-css')) return;
    var st = document.createElement('style');
    st.id = 'v2au-voice-css';
    st.textContent = [
      '#v2au-voice-panel{display:flex;flex-direction:column;align-items:center;gap:10px;text-align:center}',
      '#v2au-voice-head{display:flex;align-items:center;justify-content:space-between;width:100%;margin-bottom:2px}',
      '#v2au-voice-orb{width:64px;height:64px;border-radius:50%;position:relative;margin:4px 0 2px;',
      'background:radial-gradient(circle at 32% 28%,#8fdcff,#2f7bd8 46%,#143c6d 74%,#0a1b33);',
      'box-shadow:0 0 0 1px rgba(255,255,255,.16),0 10px 26px rgba(0,0,0,.45);transition:box-shadow .2s ease}',
      '#v2au-voice-orb:after{content:"";position:absolute;inset:-9px;border-radius:50%;',
      'border:1px solid rgba(120,200,255,.4);opacity:0}',
      '#v2au-voice-orb.is-listening{box-shadow:0 0 0 2px rgba(120,255,190,.45),0 10px 26px rgba(0,0,0,.45)}',
      '#v2au-voice-orb.is-speaking{animation:v2au-pulse 1.15s ease-in-out infinite}',
      '#v2au-voice-orb.is-speaking:after{opacity:1;animation:v2au-ring 1.15s ease-out infinite}',
      '@keyframes v2au-pulse{0%,100%{transform:scale(1)}50%{transform:scale(1.09)}}',
      '@keyframes v2au-ring{0%{transform:scale(.9);opacity:.55}100%{transform:scale(1.4);opacity:0}}',
      '#v2au-voice-controls{display:flex;gap:12px;align-items:center;justify-content:center;margin-top:2px}',
      '#v2au-voice-controls button{width:42px;height:42px;border-radius:50%;border:1px solid rgba(255,255,255,.22);',
      'background:rgba(255,255,255,.07);color:#e8e6df;display:flex;align-items:center;justify-content:center;cursor:pointer;padding:0}',
      '#v2au-voice-controls button:hover{background:rgba(255,255,255,.15)}',
      '#v2au-voice-mute[aria-pressed="true"]{background:rgba(255,255,255,.28)}',
      '#v2au-voice-end{background:#c8321f;border-color:#c8321f}',
      '#v2au-voice-end:hover{background:#e03a24}',
      '#v2au-voice-msg{font-size:13px;min-height:18px;margin:0}',
      '#v2au-voice-log{width:100%;font-size:12px;max-height:120px;overflow-y:auto;opacity:.72;margin-top:2px;text-align:left}',
      '@media (prefers-reduced-motion:reduce){#v2au-voice-orb.is-speaking,#v2au-voice-orb.is-speaking:after{animation:none}}'
    ].join('');
    document.head.appendChild(st);
  }

  var MIC_SVG = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M12 3a3 3 0 0 0-3 3v6a3 3 0 0 0 6 0V6a3 3 0 0 0-3-3z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><path d="M12 19v3"/></svg>';
  var MIC_OFF_SVG = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M9 6a3 3 0 0 1 6 0v5"/><path d="M5 10v2a7 7 0 0 0 11 5.2"/><path d="M19 10v2a7 7 0 0 1-.9 3.4"/><path d="M12 19v3"/><path d="M3 3l18 18"/></svg>';
  var HANG_SVG = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M23 16.9l-3.3-3.3a2 2 0 0 0-2.8 0l-1.6 1.6a16 16 0 0 1-7.5-7.5l1.6-1.6a2 2 0 0 0 0-2.8L6.1 0 3.3 2.8C1.7 4.4 2.6 8 5.4 11.6A31 31 0 0 0 12.4 18.6c3.6 2.8 7.2 3.7 8.8 2.1z" transform="rotate(135 12 12)"/></svg>';

  function ui() {
    if (els.panel) return;
    injectCss();
    var t = T();
    var p = document.createElement('div');
    p.id = 'v2au-voice-panel';
    p.setAttribute('role', 'dialog');
    p.setAttribute('aria-label', t.title);
    p.innerHTML =
      '<div id="v2au-voice-head"><strong style="font-size:13px;font-weight:600">' + t.title + '</strong>' +
      '<button id="v2au-voice-close" aria-label="' + t.close + '" style="background:none;border:none;font-size:16px;cursor:pointer;color:inherit;opacity:.7">✕</button></div>' +
      '<div id="v2au-voice-orb" role="img" aria-label="' + t.assistant + '"></div>' +
      '<p id="v2au-voice-msg">' + t.connecting + '</p>' +
      '<div id="v2au-voice-controls">' +
      '<button id="v2au-voice-mute" aria-pressed="false" aria-label="' + t.mute + '" title="' + t.mute + '">' + MIC_SVG + '</button>' +
      '<button id="v2au-voice-end" aria-label="' + t.endCall + '" title="' + t.endCall + '">' + HANG_SVG + '</button>' +
      '</div>' +
      '<p style="font-size:10px;opacity:.5;margin:2px 0 0">' + t.stays + '</p>' +
      '<button id="v2au-voice-retry" hidden style="margin-top:6px;padding:6px 12px;border-radius:8px;border:1px solid currentColor;background:transparent;color:inherit;font-size:12px;cursor:pointer">' + t.retry + '</button>' +
      '<div id="v2au-voice-log"></div>';
    Object.assign(p.style, {
      position: 'fixed', bottom: '88px', left: '20px', zIndex: '60', width: 'min(300px, calc(100vw - 40px))',
      background: 'var(--v2au-voice-bg, #0f1a2e)', color: '#e8e6df', border: '1px solid rgba(255,255,255,.15)',
      borderRadius: '18px', padding: '14px 16px', boxShadow: '0 16px 44px rgba(0,0,0,.5)',
      fontFamily: 'system-ui, sans-serif'
    });
    document.body.appendChild(p);
    els.panel = p;
    els.msg = $('v2au-voice-msg'); els.log = $('v2au-voice-log');
    els.retry = $('v2au-voice-retry'); els.orb = $('v2au-voice-orb');
    els.mute = $('v2au-voice-mute');
    $('v2au-voice-close').addEventListener('click', function () { stop(); });
    $('v2au-voice-end').addEventListener('click', function () { stop(); });
    els.mute.addEventListener('click', toggleMute);
    if (els.retry) els.retry.addEventListener('click', function () { els.retry.hidden = true; start(); });
  }

  function toggleMute() {
    muted = !muted;
    var t = T();
    if (els.mute) {
      els.mute.setAttribute('aria-pressed', muted ? 'true' : 'false');
      els.mute.setAttribute('aria-label', muted ? t.unmute : t.mute);
      els.mute.setAttribute('title', muted ? t.unmute : t.mute);
      els.mute.innerHTML = muted ? MIC_OFF_SVG : MIC_SVG;
    }
    if (active) say(muted ? t.unmute : t.listening, false);
  }

  function orbState(s) {
    if (!els.orb) return;
    els.orb.className = s || '';
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

  /* Resolve to {ok, path, title} — never navigates the document away, because a
     full page load would kill the call. A 404 or a missing <main> is reported
     back to the agent so it can offer a different page instead of dumping the
     caller on an error page mid-call. */
  function softGo(url) {
    say(T().opening, false);
    return fetch(url, { headers: { 'X-V2AU-Soft': '1' } })
      .then(function (r) {
        if (!r.ok) throw new Error('http ' + r.status);
        return r.text();
      })
      .then(function (html) {
        var doc = new DOMParser().parseFromString(html, 'text/html');
        var nm = doc.querySelector('main'), om = document.querySelector('main');
        if (!nm || !om) throw new Error('no main');
        om.innerHTML = nm.innerHTML;
        om.querySelectorAll('.reveal').forEach(function (el) { el.classList.add('is-visible'); });
        om.scrollIntoView({ block: 'start' });
        document.title = doc.title || document.title;
        window.scrollTo(0, 0);
        return { ok: true, path: url, title: ((doc.title || url).split('|')[0]).trim() };
      })
      .catch(function (e) { return { ok: false, path: url, error: String((e && e.message) || e) }; });
  }

  document.addEventListener('click', function (e) {
    if (!active) return;
    var a = e.target && e.target.closest ? e.target.closest('a') : null;
    if (!a || !isInternalPage(a)) return;
    e.preventDefault();
    var u = new URL(a.getAttribute('href'), location.href);
    var p = u.pathname + u.hash;
    softGo(p).then(function (res) {
      if (res.ok) {
        history.pushState({ v2auSoft: 1 }, '', p);
        say(T().opened + res.title, true);
        if (ws && ws.readyState === 1) ws.send(JSON.stringify({ type: 'contextual_update', text: 'User is now viewing ' + p }));
      } else {
        say(T().pageFail, false);
      }
    });
  }, true);

  window.addEventListener('popstate', function () { if (active) softGo(location.pathname); });

  /* ---------------- audio plumbing ---------------- */
  /* Capture at the device's native rate and resample to 16 kHz in JS.
     Asking AudioContext for ({sampleRate:16000}) is unsupported on some
     browsers/devices and throws — which killed the call before any audio
     was sent (observed as "Client disconnected: 1000" with zero user turns). */
  function downsample(buf, fromRate, toRate) {
    if (fromRate === toRate) return buf;
    var ratio = fromRate / toRate, outLen = Math.round(buf.length / ratio);
    var out = new Float32Array(outLen);
    for (var i = 0; i < outLen; i++) {
      var pos = i * ratio, i0 = Math.floor(pos), i1 = Math.min(i0 + 1, buf.length - 1);
      out[i] = buf[i0] + (buf[i1] - buf[i0]) * (pos - i0);
    }
    return out;
  }

  async function startMic(send) {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia)
      throw new Error('insecure');
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    mediaStream = await navigator.mediaDevices.getUserMedia({
      audio: { echoCancellation: true, noiseSuppression: true, autoGainControl: true } });
    var src = audioCtx.createMediaStreamSource(mediaStream);
    var sp = audioCtx.createScriptProcessor(4096, 1, 1);
    sp.onaudioprocess = function (e) {
      if (muted || !ws || ws.readyState !== 1 || !active) return;
      // Half-duplex gate: the browser has no echo reference for WebAudio playback,
      // so the agent would hear itself through our mic and interrupt itself.
      if (playing.length > 0 || Date.now() - speechEndAt < 350) return;
      var inp = downsample(e.inputBuffer.getChannelData(0), audioCtx.sampleRate, IN_RATE);
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
    orbState('is-speaking');
    node.onended = function () {
      playing = playing.filter(function (x) { return x !== node; });
      if (playing.length === 0) { speechEndAt = Date.now(); orbState(active ? 'is-listening' : ''); }
    };
  }

  function clearPlayback() {
    playing.forEach(function (n) { try { n.stop(); } catch (e) {} });
    playing = []; nextPlayTime = 0;
    orbState(active ? 'is-listening' : '');
  }

  /* ---------------- client tool: navigate_website ---------------- */
  function handleToolCall(tc) {
    var id = tc && tc.tool_call_id;
    function done(result, isError) {
      if (id && ws && ws.readyState === 1)
        ws.send(JSON.stringify({ type: 'client_tool_result', tool_call_id: id, result: result, is_error: !!isError }));
    }
    if (!tc || tc.tool_name !== 'navigate_website') {
      done('unknown tool', true);
      return;
    }
    var p = (tc.parameters || {}).path || '/';
    var u;
    try { u = new URL(p, location.origin); } catch (e) { u = null; }
    if (!u || u.origin !== location.origin) {
      done('rejected: off-site path', true);
      return;
    }
    var target = u.pathname + (u.hash || '');
    softGo(target).then(function (res) {
      if (!res.ok) {
        // Keep the call alive and let the agent pick another page.
        done('could not open ' + target + ' (' + res.error + ') — offer the caller a different page', true);
        return;
      }
      history.pushState({ v2auSoft: 1 }, '', target);
      say(T().opened + res.title, true);
      if (ws && ws.readyState === 1)
        ws.send(JSON.stringify({ type: 'contextual_update', text: 'User is now viewing ' + target }));
      done('page opened: ' + target, false);
    });
  }

  /* ---------------- call lifecycle ---------------- */
  async function start() {
    if (active || connecting) return;
    connecting = true;
    CALL_LANG = lang();          // before ui(), so the panel is localized on first paint
    ui();
    if (els.retry) els.retry.hidden = true;
    try {
      var agents = await getStatus();
      if (!agents[CALL_LANG] && !agents.en) throw new Error('no agent configured');
      say(T().connecting);
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
          orbState('is-listening');
          say(T().connected);
          startMic(function (a) {
            if (ws && ws.readyState === 1) ws.send(JSON.stringify({ user_audio_chunk: a }));
          }).catch(function (err) {
            // Surface WHY it failed and keep the panel retryable — the old code
            // replaced this with "Call ended" and left the widget dead.
            var t = T(), name = (err && err.name) || '', msg;
            if (err && err.message === 'insecure') msg = t.insecure;
            else if (name === 'NotAllowedError' || name === 'SecurityError') msg = t.micBlocked;
            else if (name === 'NotFoundError' || name === 'OverconstrainedError') msg = t.micMissing;
            else msg = t.micBlocked;
            stop(msg);
          });
        } else if (ev.type === 'audio') {
          var ae = ev.audio_event || {};
          if (ae.audio_base_64) playPcm(ae.audio_base_64);
        } else if (ev.type === 'interruption') {
          clearPlayback();   // real barge-in (mic is gated while the agent speaks)
        } else if (ev.type === 'agent_response') {
          var t2 = ((ev.agent_response_event || {}).agent_response || '').trim();
          if (t2) say('🗣 ' + t2.slice(0, 140), true);
        } else if (ev.type === 'user_transcript') {
          var u = ((ev.user_transcription_event || {}).user_transcript || '').trim();
          if (u) say('🧑 ' + u.slice(0, 140), true);
        } else if (ev.type === 'client_tool_call') {
          handleToolCall(ev.client_tool_call || {});
        } else if (ev.type === 'ping') {
          ws.send(JSON.stringify({ type: 'pong', event_id: (ev.ping_event || {}).event_id }));
        }
      };
      ws.onclose = function (e) {
        if (stopping) { stopping = false; stop(null); return; }
        // An unexpected close: say so (with the code, in the log) instead of
        // pretending the caller ended the call.
        say(T().netErr + ' (ws ' + (e && e.code) + ')', true);
        stop(T().netErr);
      };
      ws.onerror = function () { if (!stopping) say(T().netErr, true); };
    } catch (e) {
      connecting = false;
      stop(T().fail);
    }
  }

  function stop(msg) {
    var was = active || connecting;
    stopping = true;
    active = false; connecting = false;
    try { if (micNode) micNode.disconnect(); } catch (e) {}
    try { if (mediaStream) mediaStream.getTracks().forEach(function (t) { t.stop(); }); } catch (e) {}
    try { if (audioCtx) audioCtx.close(); } catch (e) {}
    audioCtx = micNode = mediaStream = null;
    clearPlayback();
    try { if (ws) { ws.onclose = null; ws.close(1000); } } catch (e) {}
    ws = null;
    stopping = false;
    if (msg) { say(msg, true); if (els.retry) els.retry.hidden = false; }
    else if (was) say(T().ended);
  }

  window.__v2auVoiceStart = start;
  window.__v2auVoiceStop = stop;
})();
