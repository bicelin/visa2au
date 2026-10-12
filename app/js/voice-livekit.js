/* Visa2AU voice widget — LiveKit lane (option 3), WebRTC.
   Loaded lazily by window.__loadVoice() because /api/voice-status names this file
   as the lane's adapter. Same contract as the other lanes: __v2auVoiceStart/Stop,
   #voice-cta + #voice-fab, #v2au-voice-panel, navigate_website as a client tool.

   Why this lane is different: WebRTC (LiveKit) does real acoustic echo cancellation
   in the browser, so unlike /js/voice.js and /js/voice-el.js there is NO hand-rolled
   half-duplex mic gate here — you can genuinely talk over the agent (barge-in).

   Transport: token from /api/voice-livekit-token (minted server-side with the LiveKit
   API secret). The agent worker joins the same room and runs the V2AU secretary.
   Verified: the token this endpoint emits was accepted by LiveKit's own TokenVerifier,
   and the vendored bundle exposes window.LivekitClient.{Room,RoomEvent,Track,
   createLocalAudioTrack,ConnectionState} (livekit-client 2.22.4 UMD, ~148 KB gzip).
*/
(function () {
  'use strict';
  var VENDOR = '/js/vendor/livekit-client.umd.js';
  var room = null, active = false, connecting = false, sdk = null, audioEl = null;
  var els = {}, CALL_LANG = 'en', TOKEN_ENDPOINT = '/api/voice-livekit-token';

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
      '<p style="font-size:11px;opacity:.6;margin-top:2px">The call stays alive while you browse the site. You can talk over me.</p>' +
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
    // remote agent audio
    audioEl = document.createElement('audio');
    audioEl.autoplay = true; audioEl.playsInline = true;
    audioEl.setAttribute('aria-hidden', 'true');
    document.body.appendChild(audioEl);
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

  function loadSdk() {
    if (sdk) return Promise.resolve(sdk);
    return new Promise(function (resolve, reject) {
      var s = document.createElement('script');
      s.src = VENDOR;
      s.onload = function () {
        sdk = window.LivekitClient || window.LiveKitClient || null;
        sdk ? resolve(sdk) : reject(new Error('LivekitClient global missing'));
      };
      s.onerror = function () { reject(new Error('vendor load failed')); };
      document.body.appendChild(s);
    });
  }

  async function getSession(l) {
    var r = await fetch(TOKEN_ENDPOINT + '?lang=' + encodeURIComponent(l));
    if (!r.ok) throw new Error('auth');
    var d = await r.json();
    if (!d.url || !d.token) throw new Error('auth');
    return d;
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

  function tell(path) {
    // data-channel note so the worker knows what the caller is looking at
    try {
      if (room && sdk && room.localParticipant) {
        room.localParticipant.publishData(
          new TextEncoder().encode(JSON.stringify({ type: 'contextual_update', text: 'User is now viewing ' + path })),
          { reliable: true });
      }
    } catch (e) {}
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
        tell(url);
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

  /* ---------------- data-channel client tool ---------------- */
  function onData(payload, participant, kind, topic) {
    var txt;
    try { txt = new TextDecoder().decode(payload); } catch (e) { return; }
    var msg;
    try { msg = JSON.parse(txt); } catch (e) { return; }
    if (!msg) return;
    // the worker asks the page to open something
    if (msg.type === 'navigate_website' || msg.type === 'client_tool_call') {
      var p = (msg.path || (msg.parameters || {}).path || '/');
      var u;
      try { u = new URL(p, location.origin); } catch (e) { u = null; }
      if (!u || u.origin !== location.origin) return;
      softGo(u.pathname + (u.hash || ''));
      history.pushState({ v2auSoft: 1 }, '', u.pathname + (u.hash || ''));
    } else if (msg.type === 'agent_response' && msg.text) {
      say('🗣 ' + String(msg.text).slice(0, 140), true);
    } else if (msg.type === 'user_transcript' && msg.text) {
      say('🧑 ' + String(msg.text).slice(0, 140), true);
    }
  }

  /* ---------------- call lifecycle ---------------- */
  async function start() {
    if (active || connecting) return;
    connecting = true;
    ui();
    try {
      say('Connecting…');
      var LK = await loadSdk();
      var s = await getSession(lang());
      CALL_LANG = s.lang || lang();

      room = new LK.Room({ adaptiveStream: false, dynacast: false, audioCaptureDefaults: {
        echoCancellation: true, noiseSuppression: true, autoGainControl: true } });

      room.on(LK.RoomEvent.TrackSubscribed, function (track) {
        if (track.kind === LK.Track.Kind.Audio) track.attach(audioEl);
      });
      room.on(LK.RoomEvent.TrackUnsubscribed, function (track) {
        try { track.detach(audioEl); } catch (e) {}
      });
      room.on(LK.RoomEvent.DataReceived, onData);
      if (LK.RoomEvent.TranscriptionReceived) {
        room.on(LK.RoomEvent.TranscriptionReceived, function (segs, participant) {
          try {
            (segs || []).forEach(function (sg) {
              if (sg && sg.text) say((participant && participant.isLocal ? '🧑 ' : '🗣 ') + sg.text.slice(0, 140), true);
            });
          } catch (e) {}
        });
      }
      room.on(LK.RoomEvent.Disconnected, function () { stop(); });
      room.on(LK.RoomEvent.ConnectionStateChanged, function (st) {
        if (typeof st === 'string' && st.toLowerCase() === 'reconnecting') say('Reconnecting…');
      });
      // Real-path latency: the only honest way to measure the guest->region RTT.
      // A plain TCP probe to the signalling host does NOT represent the media path
      // (region routing is decided at join), so log what the SDK actually sees.
      if (LK.RoomEvent.ConnectionQualityChanged) {
        room.on(LK.RoomEvent.ConnectionQualityChanged, function (q, participant) {
          if (participant && participant.isLocal) say('Connection: ' + q);
        });
      }
      var statTicks = 0;
      var statTimer = setInterval(async function () {
        if (!room || !active || statTicks++ > 6) { clearInterval(statTimer); return; }
        try {
          var stats = await room.getStats();
          var rtt = null;
          (stats || []).forEach(function (s) {
            (s.candidatePairs || []).forEach(function (p) {
              if (typeof p.currentRoundTripTime === 'number' && (rtt === null || p.currentRoundTripTime < rtt))
                rtt = p.currentRoundTripTime;
            });
          });
          if (rtt !== null) window.__v2auVoiceRttMs = Math.round(rtt * 1000);
        } catch (e) { clearInterval(statTimer); }
      }, 3000);

      await room.connect(s.url, s.token);
      // WebRTC: the agent and the caller can both talk — no mic gating needed.
      await room.localParticipant.setMicrophoneEnabled(true);
      active = true; connecting = false;
      say('Connected — start speaking. Keep browsing; the call stays open.', false);
    } catch (e) {
      connecting = false;
      say(e && e.message === 'auth' ? 'The voice assistant is not available right now.' : 'Could not start the voice assistant.');
      stop();
    }
  }

  function stop() {
    var was = active;
    active = false; connecting = false;
    try { if (room) { room.disconnect(); } } catch (e) {}
    room = null;
    try { if (audioEl) { audioEl.pause(); audioEl.srcObject = null; } } catch (e) {}
    if (was) say('Call ended. Thank you for calling Visa2AU.');
  }

  window.__v2auVoiceStart = start;
  window.__v2auVoiceStop = stop;
})();
