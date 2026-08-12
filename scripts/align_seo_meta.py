#!/usr/bin/env python3
"""Align SEO meta across all app/**/*.html (idempotent).

- Fix RU/FR homepage canonical + hreflang (kills /ru/ru.html-style dead links)
- Canonical/hreflang/og:url -> extensionless form (match sitemap + 308 targets)
- og:image -> Cloudflare Image Resizing URL (1200w)
- Insert og:site_name + theme-color where missing
- Stats counters: real no-JS fallback values ("2,000+" not "0")
"""
import os
import re

APP = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "app")
BASE = "https://visa2.au"

# ── RU/FR homepage canonical+hreflang: correct values ─────────────────────────
HOMEPAGE_FIX = {
    "ru": ("https://visa2.au/ru/", "https://visa2.au/", "https://visa2.au/ru/", "https://visa2.au/fr/", "https://visa2.au/"),
    "fr": ("https://visa2.au/fr/", "https://visa2.au/", "https://visa2.au/ru/", "https://visa2.au/fr/", "https://visa2.au/"),
}
HOMEPAGE_BLOCK = re.compile(
    r'(<link rel="canonical" href=")[^"]*("><link rel="alternate" hreflang="en" href=")[^"]*'
    r'("><link rel="alternate" hreflang="ru" href=")[^"]*("><link rel="alternate" hreflang="fr" href=")[^"]*'
    r'("><link rel="alternate" hreflang="x-default" href=")[^"]*(">)'
)

# ── stats counters: no-JS fallback ────────────────────────────────────────────
COUNTER_FIX = [
    (re.compile(r'(<span data-count="2000" data-suffix="\+">)0(</span>)'), r"\g<1>2,000+\g<2>"),
    (re.compile(r'(<span data-count="99\.8" data-decimals="1" data-suffix="%">)0(</span>)'), r"\g<1>99.8%\g<2>"),
    (re.compile(r'(<span data-count="20" data-suffix="\+">)0(</span>)'), r"\g<1>20+\g<2>"),
]

# ── hero founding-year consistency (2005 -> 2004, matches schema/footer/llms) ─
YEAR_FIX = [
    (re.compile(r"Experienced since 2005"), "Experienced since 2004"),
    (re.compile(r"Опыт с 2005 года"), "Опыт с 2004 года"),
    (re.compile(r"[Ee]xpérience depuis 2005"), "Expérience depuis 2004"),
]


# ── Yandex.Metrika counter (injected early in <head> on every page) ─────────
METRIKA = '''<!-- Yandex.Metrika counter -->
<script type="text/javascript">
    (function(m,e,t,r,i,k,a){
        m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};
        m[i].l=1*new Date();
        for (var j = 0; j < document.scripts.length; j++) {if (document.scripts[j].src === r) { return; }}
        k=e.createElement(t),a=e.getElementsByTagName(t)[0],k.async=1,k.src=r,a.parentNode.insertBefore(k,a)
    })(window, document,'script','https://mc.yandex.ru/metrika/tag.js?id=111501119', 'ym');

    ym(111501119, 'init', {ssr:true, clickmap:true, ecommerce:"dataLayer", referrer: document.referrer, url: location.href, accurateTrackBounce:true, trackLinks:true});
</script>
<noscript><div><img src="https://mc.yandex.ru/watch/111501119" style="position:absolute; left:-9999px;" alt="" /></div></noscript>
<!-- /Yandex.Metrika counter -->'''


# ── Google Analytics 4 (gtag.js) — injected early in <head> on every page ────
GA4 = '''<!-- Google tag (gtag.js) -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-TS8EK9K6W4"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-TS8EK9K6W4');
</script>'''


def canonicalize(url: str) -> str:
    """Strip .html; map /ru /fr home to trailing-slash form."""
    if not url.startswith(BASE):
        return url
    u = url
    if u.endswith(".html"):
        u = u[:-5]
    if u.endswith("/ru") or u.endswith("/fr"):
        u += "/"
    return u


def lang_of(path: str) -> str:
    rel = os.path.relpath(path, APP)
    if rel.startswith("ru/") or rel == "ru.html":
        return "ru"
    if rel.startswith("fr/") or rel == "fr.html":
        return "fr"
    return "en"


def main() -> None:
    files = []
    for root, _, fs in os.walk(APP):
        for f in fs:
            if f.endswith(".html"):
                files.append(os.path.join(root, f))
    changed = 0
    for path in sorted(files):
        html = open(path, encoding="utf-8").read()
        orig = html
        rel = os.path.relpath(path, APP)
        lang = lang_of(path)

        # 1) homepage canonical/hreflang block fix (RU/FR only, incl. root stubs)
        if rel in ("ru/index.html", "fr/index.html", "ru.html", "fr.html"):
            can, en, ru, fr, xd = HOMEPAGE_FIX[lang]
            html = HOMEPAGE_BLOCK.sub(
                rf'\g<1>{can}\g<2>{en}\g<3>{ru}\g<4>{fr}\g<5>{xd}\g<6>', html, count=1)

        # 2) generic extensionless alignment
        html = re.sub(r'(<link rel="canonical" href=")([^"]+)(")',
                      lambda m: m.group(1) + canonicalize(m.group(2)) + m.group(3), html)
        html = re.sub(r'(<link rel="alternate" hreflang="[^"]+" href=")([^"]+)(")',
                      lambda m: m.group(1) + canonicalize(m.group(2)) + m.group(3), html)

        # Drop hreflang alternates whose target page does not exist (dead links
        # like /ru/contact when only the EN contact page exists).
        def keep_hreflang(m):
            href = m.group(0)
            m2 = re.search(r'href="([^"]+)"', href)
            url = m2.group(1)
            if not url.startswith(BASE):
                return href
            relp = url[len(BASE):].lstrip("/")
            if not relp:
                return href
            if relp.endswith("/"):
                relp += "index.html"
            if os.path.isfile(os.path.join(APP, relp)) or os.path.isfile(os.path.join(APP, relp + ".html")):
                return href
            return ""  # target missing -> remove the dead alternate link

        html = re.sub(r'<link rel="alternate" hreflang="[^"]+" href="[^"]+">', keep_hreflang, html)
        html = re.sub(r'(<meta property="og:url" content=")([^"]+)(")',
                      lambda m: m.group(1) + canonicalize(m.group(2)) + m.group(3), html)

        # og:image: default placeholder -> branded share card; others -> CF resize
        def fix_og_image(m):
            url = m.group(2)
            plain = re.sub(r"^https://visa2\.au/cdn-cgi/image/[^/]+/", "https://visa2.au/", url)
            if "og-share-card.png" in url:
                return m.group(0)  # already the branded card
            if plain.endswith("/imgs/hero-coast.jpg"):
                return (m.group(1) + BASE + "/imgs/og-share-card.png" + m.group(3) + ">"
                        + '<meta property="og:image:width" content="1200">'
                        + '<meta property="og:image:height" content="630">')
            return m.group(1) + BASE + "/cdn-cgi/image/width=1200,quality=80,format=auto/" \
                + plain[len(BASE) + 1:] + m.group(3)

        html = re.sub(r'(<meta property="og:image" content=")(https://visa2\.au/[^"]+)(")',
                      fix_og_image, html)

        # repair malformed og:image (missing ">" after URL / stray trailing ">")
        html = html.replace('og:image" content="https://visa2.au/imgs/og-share-card.png"<meta',
                            'og:image" content="https://visa2.au/imgs/og-share-card.png"><meta')
        html = html.replace('content="630">>', 'content="630">')

        # 3) og:site_name + theme-color
        if "og:site_name" not in html:
            html = html.replace("</head>",
                                '<meta property="og:site_name" content="Visa2AU">'
                                '<meta name="theme-color" content="#0a0f1c"></head>', 1)

        # 4) stats counters no-JS fallback
        for rx, rep in COUNTER_FIX:
            html = rx.sub(rep, html)

        # 5) founding-year consistency
        for rx, rep in YEAR_FIX:
            html = rx.sub(rep, html)

        # 6) performance: LCP preload, cdn-cgi story images, mobile JS gating
        HERO = "/cdn-cgi/image/width=1080,quality=70,format=auto,onerror=redirect/story/hero-dawn.jpg"
        if rel in ("index.html", "ru/index.html", "fr/index.html"):
            # compress harder everywhere (quality 80 -> 72)
            html = html.replace("quality=80,format=auto,onerror=redirect/story/",
                                "quality=70,format=auto,onerror=redirect/story/")
            # hero ladder: phones (DPR 1.75 x 412px) should grab 720w, not 1280w
            html = re.sub(r'(/cdn-cgi/image/width=)640(,quality=\d+,format=auto,onerror=redirect/story/hero-dawn\.jpg)',
                          r'\g<1>480\g<2>', html)
            html = re.sub(r'(/cdn-cgi/image/width=)1280(,quality=\d+,format=auto,onerror=redirect/story/hero-dawn\.jpg)',
                          r'\g<1>1080\g<2>', html)
            html = re.sub(r'(/cdn-cgi/image/width=)1920(,quality=\d+,format=auto,onerror=redirect/story/hero-dawn\.jpg)',
                          r'\g<1>1600\g<2>', html)
            # keep the width descriptors in sync with the URL widths
            html = html.replace("hero-dawn.jpg 640w", "hero-dawn.jpg 480w")
            html = html.replace("hero-dawn.jpg 1280w", "hero-dawn.jpg 1080w")
            html = html.replace("hero-dawn.jpg 1920w", "hero-dawn.jpg 1600w")
            html = html.replace(
                "hero-dawn.jpg 480w, /cdn-cgi/image/width=1080,quality=70,format=auto,onerror=redirect/story/hero-dawn.jpg",
                "hero-dawn.jpg 480w, /cdn-cgi/image/width=720,quality=70,format=auto,onerror=redirect/story/hero-dawn.jpg 720w, /cdn-cgi/image/width=1080,quality=70,format=auto,onerror=redirect/story/hero-dawn.jpg")
            if 'rel="preload" as="image"' not in html:
                preload = (f'<link rel="preload" as="image" href="{HERO}" '
                           'imagesrcset="/cdn-cgi/image/width=480,quality=70,format=auto,onerror=redirect/story/hero-dawn.jpg 480w, '
                           '/cdn-cgi/image/width=720,quality=70,format=auto,onerror=redirect/story/hero-dawn.jpg 720w, '
                           '/cdn-cgi/image/width=1080,quality=70,format=auto,onerror=redirect/story/hero-dawn.jpg 1080w, '
                           '/cdn-cgi/image/width=1600,quality=70,format=auto,onerror=redirect/story/hero-dawn.jpg 1600w" '
                           'imagesizes="100vw" fetchpriority="high">')
                html = html.replace("</head>", preload + "</head>", 1)
        html = re.sub(r'src="(?:\.\./|\./)?story/([^"]+\.jpg)"',
                      lambda m: 'src="/cdn-cgi/image/width=1280,quality=70,format=auto,onerror=redirect/story/'
                      + m.group(1) + '"', html)
        # normalise any remaining quality=72 in already-built pages to 70
        html = html.replace("quality=72,format=auto,onerror=redirect/story/",
                            "quality=70,format=auto,onerror=redirect/story/")
        html = html.replace(
            "initField('coastCanvas', 'coast');\n      initField('crossCanvas', 'cross');",
            "if (window.matchMedia('(min-width: 768px)').matches) {\n"
            "        initField('coastCanvas', 'coast');\n"
            "        initField('crossCanvas', 'cross');\n"
            "      }")
        html = html.replace(
            "/* ————— parallax on story panels ————— */\n      if (!reduced) {",
            "/* ————— parallax on story panels ————— */\n      if (!reduced && window.matchMedia('(min-width: 768px)').matches) {")

        # 7) ElevenLabs voice widget: the agent's first message requires dynamic
        # variables — agent first_message is now "{{greeting}}", so greeting
        # carries the full localized opener (per-locale values)
        html = html.replace("greeting: 'Здравствуйте!',",
                            "greeting: \"Здравствуйте! Я — ассистент Visa2AU. Чем могу помочь?\",")
        html = html.replace("greeting: 'Bonjour !',",
                            "greeting: \"Bonjour ! Je suis l'assistant Visa2AU. Comment puis-je vous aider ?\",")
        html = html.replace("greeting: 'Hi there!',",
                            "greeting: \"Hi there! I'm the Visa2AU assistant. What can I do for you?\",")
        if "dynamic-variables" not in html and "agent_7001k1zx1vf1fxrbhpawb7980gy1" in html:
            html = html.replace(
                "el.setAttribute('agent-id', 'agent_7001k1zx1vf1fxrbhpawb7980gy1');",
                "el.setAttribute('agent-id', 'agent_7001k1zx1vf1fxrbhpawb7980gy1');\n"
                "            const lng0 = (document.documentElement.lang || 'en').toLowerCase();\n"
                "            const dv0 = lng0.startsWith('ru') ? { agent_name: 'Ассистент Visa2AU', greeting: \"Здравствуйте! Я — ассистент Visa2AU. Чем могу помочь?\", user_name: '' }\n"
                "              : lng0.startsWith('fr') ? { agent_name: 'Assistant Visa2AU', greeting: \"Bonjour ! Je suis l'assistant Visa2AU. Comment puis-je vous aider ?\", user_name: '' }\n"
                "              : { agent_name: 'Visa2AU Assistant', greeting: \"Hi there! I'm the Visa2AU assistant. What can I do for you?\", user_name: 'there' };\n"
                "            el.setAttribute('dynamic-variables', JSON.stringify(dv0));")

        # 8) voice assistant availability: hide section + skip widget when disabled.
        #    Fetch is deferred to idle so /api/voice-status stays off the critical path.
        if "agent_7001k1zx1vf1fxrbhpawb7980gy1" in html:
            # upgrade an already-inserted immediate fetch -> deferred (open + close)
            html = html.replace(
                "let loaded = false;\n          fetch('/api/voice-status')",
                "let loaded = false;\n          (window.requestIdleCallback || function (cb) { setTimeout(cb, 2000); })(function () {\n            fetch('/api/voice-status')")
            html = html.replace(
                "}).catch(function () {});\n          window.__loadVoice = function () {\n            if (loaded) return;",
                "}).catch(function () {});\n          });\n          window.__loadVoice = function () {\n            if (window.__v2auVoiceDisabled) return;\n            if (loaded) return;")
            # brand-new pages: insert the deferred block
            if "voice-status" not in html:
                html = html.replace(
                    "        (function () {\n          let loaded = false;\n          window.__loadVoice = function () {\n            if (loaded) return;",
                    "        (function () {\n          let loaded = false;\n"
                    "          (window.requestIdleCallback || function (cb) { setTimeout(cb, 2000); })(function () {\n"
                    "            fetch('/api/voice-status').then(function (r) { return r.json(); }).then(function (s) {\n"
                    "              if (s && s.enabled === false) {\n"
                    "                window.__v2auVoiceDisabled = true;\n"
                    "                var vb = document.getElementById('voice-cta');\n"
                    "                if (vb && vb.closest) { var vs = vb.closest('section'); if (vs) vs.style.display = 'none'; }\n"
                    "              }\n"
                    "            }).catch(function () {});\n"
                    "          });\n"
                    "          window.__loadVoice = function () {\n"
                    "            if (window.__v2auVoiceDisabled) return;\n"
                    "            if (loaded) return;")

        # 9) analytics: Yandex.Metrika + GA4 tags early in <head> (idempotent)
        if "mc.yandex.ru" not in html and "<head>" in html:
            html = html.replace("<head>", "<head>" + METRIKA, 1)
        if "googletagmanager.com/gtag/js" not in html and "<head>" in html:
            html = html.replace("<head>", "<head>" + GA4, 1)

        # 10) inline the render-blocking stylesheet on homepages (removes the CSS
        #     request from the critical path; gzips to similar total weight)
        if rel in ("index.html", "ru/index.html", "fr/index.html") and "v2au-inline-css" not in html:
            mcss = re.search(r'<link rel="stylesheet" href="[^"]*_astro/([^"]+\.css)"[^>]*>', html)
            if mcss:
                css_path = os.path.join(APP, "_astro", mcss.group(1))
                if os.path.isfile(css_path):
                    css = open(css_path, encoding="utf-8").read()
                    # keep only woff2 (modern browsers) -> halves font requests
                    css = re.sub(r'url\([^)]*\.woff\)\s*format\([^)]*\)\s*,?', '', css)
                    # the CSS lived in /_astro/, so its relative urls() must be
                    # rewritten now that it is inlined into the page (./X -> /_astro/X)
                    css = (css.replace('url("./', 'url("/_astro/').replace("url('./", "url('/_astro/").replace('url(./', 'url(/_astro/')
                               .replace('url("../', 'url("/').replace("url('../", "url('/").replace('url(../', 'url(/'))
                    html = html.replace(mcss.group(0), '<style id="v2au-inline-css">\n' + css + '\n</style>')

        # 10b) fix relative url() in any already-inlined stylesheet (fonts were 404ing)
        html = (html.replace('url("./', 'url("/_astro/').replace("url('./", "url('/_astro/").replace('url(./', 'url(/_astro/')
                   .replace('url("../', 'url("/').replace("url('../", "url('/").replace('url(../', 'url(/'))

        # 11) point the "Detailed Visa Assessment" CTA at the assessment root
        html = html.replace("https://visa2au.mmportal.cloud/assessment/enquiry/",
                            "https://visa2au.mmportal.cloud/assessment/")

        # 12) drop Metrika webvisor (heavy + opens a WS that fails -> console error)
        html = html.replace("webvisor:true, ", "")

        # 12b) strip .woff (non-woff2) font srcs from any inline <style> on the page
        html = re.sub(r'url\([^)]*\.woff\)\s*format\([^)]*\)\s*,?', '', html)

        # 13) defer GA4 + Yandex Metrika to after window load (removes their
        #     main-thread parse/execute cost from TBT)
        ANALYTICS_DEFERRED = '''<script>
(function () {
  function onLoad() {
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date()); gtag('config', 'G-TS8EK9K6W4');
    var g = document.createElement('script'); g.async = true;
    g.src = 'https://www.googletagmanager.com/gtag/js?id=G-TS8EK9K6W4'; document.head.appendChild(g);
    var m = document.createElement('script'); m.async = true;
    m.src = 'https://mc.yandex.ru/metrika/tag.js?id=111501119'; document.head.appendChild(m);
    window.ym = window.ym || function(){ (window.ym.a = window.ym.a || []).push(arguments); };
    ym(111501119, 'init', {ssr:true, clickmap:true, ecommerce:'dataLayer', accurateTrackBounce:true, trackLinks:true});
  }
  if (document.readyState === 'complete') onLoad(); else window.addEventListener('load', onLoad);
})();
</script>
<noscript><div><img src="https://mc.yandex.ru/watch/111501119" style="position:absolute; left:-9999px;" alt="" /></div></noscript>'''
        if "Google tag (gtag.js)" in html and "Yandex.Metrika counter" in html and "deferred analytics" not in html:
            html = re.sub(r'<!-- Google tag \(gtag\.js\) -->.*?<!-- /Yandex\.Metrika counter -->',
                          '<!-- Google tag (gtag.js) --><!-- Yandex.Metrika counter --><!-- deferred analytics -->\n' + ANALYTICS_DEFERRED,
                          html, flags=re.S, count=1)

        if html != orig:
            open(path, "w", encoding="utf-8").write(html)
            changed += 1
            print(f"updated: {rel}")
    print(f"== {changed} files updated ==")


if __name__ == "__main__":
    main()
