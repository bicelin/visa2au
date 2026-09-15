#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""One-time swap: ElevenLabs inline voice loader -> Cartesia loader on all pages.

Keeps the same contract:
  - fetch('/api/voice-status') kill-switch (hides section, sets __v2auVoiceDisabled)
  - window.__loadVoice() lazy entry (used by the #voice-fab bind script)
  - loads /js/voice.js (absolute, works at any depth) on first call

The ElevenLabs loader is one contiguous <script> block (starts with its
comment, ends at the next </script>). Idempotent: pages already loading
voice.js are skipped.
"""
import os, re

APP = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "app")

LOADER = '''<script>
        // Visa2AU voice assistant (Cartesia managed agent) — lazy load on first
        // click of #voice-fab. Kill switch: VOICE_ASSISTANT_ENABLED=false ->
        // /api/voice-status enabled:false -> section hidden, script never loaded.
        (function () {
          (window.requestIdleCallback || function (cb) { setTimeout(cb, 2000); })(function () {
            fetch('/api/voice-status').then(function (r) { return r.json(); }).then(function (s) {
              if (s && s.enabled === false) {
                window.__v2auVoiceDisabled = true;
                var vb = document.getElementById('voice-cta');
                if (vb && vb.closest) { var vs = vb.closest('section'); if (vs) vs.style.display = 'none'; }
              }
            }).catch(function () {});
          });
          window.__loadVoice = function () {
            if (window.__v2auVoiceDisabled) return;
            if (window.__v2auVoiceBooted) return;
            window.__v2auVoiceBooted = true;
            var s = document.createElement('script');
            s.src = '/js/voice.js';
            s.onload = function () { window.__v2auVoiceStart(); };
            document.body.appendChild(s);
          };
        })();
      </script>'''

n = skipped = nomatch = 0
for root, dirs, files in os.walk(APP):
    dirs[:] = [d for d in dirs if d != "_astro"]
    for f in files:
        if not f.endswith(".html"):
            continue
        path = os.path.join(root, f)
        html = open(path, encoding="utf-8").read()
        if "js/voice.js" in html:
            skipped += 1
            continue
        i = html.find("// ElevenLabs voice assistant")
        if i < 0:
            continue
        start = html.rfind("<script>", 0, i)
        end = html.find("</script>", i)
        if start < 0 or end < 0:
            nomatch += 1
            print("NO MATCH:", os.path.relpath(path, APP))
            continue
        out = html[:start] + LOADER + html[end + len("</script>"):]
        assert "// ElevenLabs voice assistant" not in out
        assert "unpkg.com/@elevenlabs" not in out, "stray elevenlabs widget code in " + path
        open(path, "w").write(out)
        n += 1
print(f"swapped {n} pages | already-cartesia {skipped} | pattern-miss {nomatch}")
