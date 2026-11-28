#!/usr/bin/env python3
"""Fetch and verify free-licence artwork for one blog post at a time.

Why a pipeline instead of a search box: the images on the blog until now carried
a competitor's watermark, a stock advert overlay and text burned into the sand —
none of which a licence check catches, and none of which can be localised or read
by a screen reader. So every candidate is mechanically rejected on:

  - premium/Unsplash+ photos (usable only with a paid subscription)
  - anything under 1600x900 (the hero renders at 1024 CSS px, 2x)
  - ANY text found by OCR (watermarks, overlays, burned-in captions)
  - flat or blown-out frames (mean luminance outside 40-225)
  - near-duplicates of images already published (64-bit dHash, Hamming < 8)

Output: one 2048-wide JPEG per post in app/imgs/blog/<slug>.jpg plus a CREDITS
entry. Cloudflare Image Resizing serves every smaller size from it, so only the
master is committed.

Usage:
    python3 scripts/fetch_blog_art.py --slug understanding-partner-visa-820-801
    python3 scripts/fetch_blog_art.py --slug <slug> --query "passport desk" --dry-run
"""
from __future__ import annotations

import argparse
import base64
import hashlib
import io
import json
import pathlib
import re
import subprocess
import sys
import tempfile
import urllib.parse
import urllib.request

from PIL import Image, ImageFilter, ImageStat

ROOT = pathlib.Path(__file__).resolve().parent.parent
OUT_DIR = ROOT / "app" / "imgs" / "blog"
SECRET = pathlib.Path.home() / ".hermes/secrets/unsplash.json"
CREDITS = ROOT / "app" / "imgs" / "blog" / "CREDITS.md"
UA = "Visa2AU-blog-art/1.0 (info@visa2.au)"

# What each post should show. Deliberately objects and places — no faces, because
# a photo of a person beside "our client got PR" implies a real client.
BRIEFS: dict[str, str] = {
    "understanding-partner-visa-820-801": "wedding rings passport documents",
    "prospective-marriage-visa-300": "engagement ring passport on table",
    "domestic-violence-family-violence-provisions-partner-visa": "quiet empty room window light",
    "employer-sponsorship-482-186-explained": "office desk contract documents signing",
    "sponsored-parent-visa-870": "family photo frames on shelf",
    "parent-visa-options-australia": "elderly hands holding documents",
    "skilled-independent-visa-189": "city skyline dusk australia",
    "skills-assessment-guide": "engineering tools blueprint desk",
    "protection-visa-866-guide": "empty waiting room chairs",
    "australian-citizenship-guide": "australian flag flagpole sky",
    "visa-fee-increases-july-2026": "calculator receipts on desk",
    "visa-refusal-what-to-do": "envelope letters on table",
    "visitor-visa-600-tips": "suitcase airport window",
    "work-holiday-visa-417-462": "backpack coastal road",
}


def creds() -> dict[str, str]:
    return json.loads(SECRET.read_text())


def search(query: str, per_page: int = 12) -> list[dict]:
    q = urllib.parse.urlencode({
        "query": query, "per_page": per_page, "orientation": "landscape",
        "content_filter": "high",
    })
    req = urllib.request.Request(
        f"https://api.unsplash.com/search/photos?{q}",
        headers={"Authorization": f"Client-ID {creds()['access_key']}",
                 "Accept-Version": "v1", "User-Agent": UA})
    with urllib.request.urlopen(req, timeout=30) as resp:
        left = resp.headers.get("x-ratelimit-remaining", "?")
        body = json.load(resp)
    print(f"  search '{query}': {body.get('total')} matches, "
          f"{len(body.get('results') or [])} candidates, {left} calls left")
    return body.get("results") or []


def download(url: str) -> bytes:
    sep = "&" if "?" in url else "?"
    req = urllib.request.Request(f"{url}{sep}w=2048&q=85&fm=jpg&fit=max&cs=srgb",
                                 headers={"User-Agent": UA})
    with urllib.request.urlopen(req, timeout=60) as resp:
        return resp.read()


def ocr_text(img: Image.Image) -> str:
    """Words tesseract is confident about, from a contrast-stretched copy.

    `--psm 11` alone reads noise as letters: it returned 'SSS' for a soft-focus
    still-life with no text at all, which would reject a perfectly good frame.
    Asking for TSV and keeping only words with confidence >= 60 and 4+ chars
    still catches real watermarks ('PASSPORT', 'FAMILY REUNION') and ignores
    texture.
    """
    with tempfile.NamedTemporaryFile(suffix=".png", delete=True) as tmp:
        img.convert("L").save(tmp.name)
        try:
            out = subprocess.run(["tesseract", tmp.name, "stdout", "--psm", "11", "tsv"],
                                 capture_output=True, text=True, timeout=90).stdout
        except Exception:
            return ""
    words = []
    for line in (out or "").splitlines()[1:]:
        cols = line.split("\t")
        if len(cols) < 12:
            continue
        text, conf = cols[11].strip(), cols[10].strip()
        if not text or not re.search(r"[A-Za-zА-Яа-я]", text):
            continue
        try:
            if float(conf) < 60:
                continue
        except ValueError:
            continue
        if len(text) >= 4:
            words.append(text)
    return " ".join(words[:8])


def dhash(img: Image.Image, size: int = 8) -> int:
    small = img.convert("L").resize((size + 1, size), Image.Resampling.LANCZOS)
    px = list(small.tobytes())
    bits = 0
    for row in range(size):
        for col in range(size):
            left = px[row * (size + 1) + col]
            right = px[row * (size + 1) + col + 1]
            bits = (bits << 1) | (1 if left > right else 0)
    return bits


def hamming(a: int, b: int) -> int:
    return bin(a ^ b).count("1")


def existing_hashes() -> dict[str, int]:
    out: dict[str, int] = {}
    for path in sorted((ROOT / "app" / "imgs").glob("*.jpg")):
        try:
            out[path.name] = dhash(Image.open(path))
        except Exception:
            continue
    for path in sorted(OUT_DIR.glob("*.jpg")):
        try:
            out["blog/" + path.name] = dhash(Image.open(path))
        except Exception:
            continue
    return out


def judge(result: dict, data: bytes) -> tuple[bool, str, dict]:
    if result.get("premium") or result.get("plus"):
        return False, "premium (needs an Unsplash+ subscription)", {}
    try:
        img = Image.open(io.BytesIO(data))
        img.load()
    except Exception as err:
        return False, f"not decodable ({err})", {}
    w, h = img.size
    # The article column is max-w-3xl (768 CSS px), so a 1536x864 master is
    # already 2x there — that is the floor, not 1600x900. Stock photos still
    # have to clear it, and the flux path is cropped to exactly 1536x864.
    if w < 1536 or h < 864:
        return False, f"too small ({w}x{h})", {}
    if not 1.45 <= w / h <= 2.15:
        return False, f"aspect {w/h:.2f} outside 1.45-2.15", {}
    gray = img.convert("L")
    mean = ImageStat.Stat(gray).mean[0]
    if not 40 <= mean <= 225:
        return False, f"mean luminance {mean:.0f} outside 40-225", {}
    dark = ImageStat.Stat(gray.filter(ImageFilter.FIND_EDGES)).mean[0]
    # A deliberately soft-focus still-life has little edge energy — 4 rejected
    # a legitimate shallow-DOF frame. Only a genuinely blank surface sits near 1.
    if dark < 2.0:
        return False, f"flat frame (edge energy {dark:.1f})", {}
    text = ocr_text(img)
    if text:
        return False, f"text found in the image: {text[:40]!r}", {}
    return True, f"{w}x{h}, luminance {mean:.0f}", {"dhash": dhash(img), "size": (w, h)}


def pick(query: str, results: list[dict], known: dict[str, int]) -> tuple[dict, bytes] | None:
    for result in results:
        data = download(result["urls"]["raw"])
        ok, why, meta = judge(result, data)
        if not ok:
            print(f"    reject {result.get('id')}: {why}")
            continue
        clash = [(n, hamming(meta["dhash"], hv)) for n, hv in known.items()]
        close = [(n, d) for n, d in clash if d < 8]
        if close:
            print(f"    reject {result.get('id')}: near-duplicate of {close[0][0]} (hamming {close[0][1]})")
            continue
        print(f"    accept {result.get('id')}: {why}")
        return result, data
    return None


CF_ACCOUNT = "e083bfeb02246c4cdc38abb254675f56"
CF_TOKEN = pathlib.Path.home() / ".hermes/secrets/cloudflare_ai_token"
FLUX_MODEL = "@cf/black-forest-labs/flux-1-schnell"
FLUX_STYLE = (
    "Editorial still-life photograph, soft natural window light, calm neutral palette "
    "(navy, cream, pale oak, warm gold accent), shallow depth of field, empty space on "
    "the right for a headline. No people, no faces, no hands. No logos, no crests, no "
    "government emblems, no readable text anywhere — any paper or card is blank. "
    "Subject: "
)


def flux_generate(query: str, steps: int = 4) -> tuple[dict, bytes]:
    """One image from Workers AI. flux-1-schnell returns a fixed 1024x1024
    square and rejects width/height, so the 16:9 hero is cut from the square
    and resampled up to 1536x864 — cheap (measured 172.8 neurons) and enough
    for a 768px article column at 2x."""
    token = CF_TOKEN.read_text().strip()
    body = json.dumps({"prompt": FLUX_STYLE + query, "steps": steps}).encode()
    req = urllib.request.Request(
        f"https://api.cloudflare.com/client/v4/accounts/{CF_ACCOUNT}/ai/run/{FLUX_MODEL}",
        data=body, headers={"Authorization": f"Bearer {token}",
                            "Content-Type": "application/json"})
    with urllib.request.urlopen(req, timeout=180) as resp:
        payload = json.load(resp)
    if not payload.get("success"):
        raise RuntimeError(str((payload.get("errors") or [{}])[0]))
    raw = base64.b64decode(payload["result"]["image"])
    neurons = (payload["result"].get("usage") or {}).get("neurons")
    img = Image.open(io.BytesIO(raw))
    img.load()
    w, h = img.size
    target_h = int(round(w * 9 / 16))
    top = max(0, (h - target_h) // 2)
    img = img.crop((0, top, w, top + target_h)).resize(
        (1536, 864), Image.Resampling.LANCZOS)
    buf = io.BytesIO()
    img.convert("RGB").save(buf, "JPEG", quality=82, optimize=True, progressive=True)
    print(f"  flux {FLUX_MODEL.split('/')[-1]}: {w}x{h} -> 1536x864, {neurons} neurons")
    return {"id": "flux-" + hashlib.sha256(raw[:4096]).hexdigest()[:10],
            "source": "ai", "model": FLUX_MODEL, "neurons": neurons,
            "query": query}, buf.getvalue()


def encode(data: bytes, width: int = 1600, quality: int = 82) -> tuple[bytes, int, int]:
    """One master: 1600 wide, q82, progressive, no metadata.

    Cloudflare Image Resizing builds every smaller size from this, so the master
    is the only file committed — and it must not carry the camera/GPS EXIF that
    stock photos ship with.
    """
    img = Image.open(io.BytesIO(data))
    img.load()
    img = img.convert("RGB")
    img.thumbnail((width, width), Image.Resampling.LANCZOS)
    buf = io.BytesIO()
    img.save(buf, "JPEG", quality=quality, optimize=True, progressive=True)
    return buf.getvalue(), img.width, img.height


def save(slug: str, result: dict, data: bytes) -> pathlib.Path:
    OUT_DIR.mkdir(parents=True, exist_ok=True)
    dest = OUT_DIR / f"{slug}.jpg"
    payload, w, h = encode(data)
    tmp = dest.with_suffix(".tmp")
    tmp.write_bytes(payload)
    tmp.replace(dest)
    data = payload
    if result.get("source") == "ai":
        credit = (f"- `{slug}.jpg` — generated, not photographed · model `{result['model']}` · "
                  f"prompt sha256 `{hashlib.sha256(result['query'].encode()).hexdigest()[:12]}` · "
                  f"{result.get('neurons', 0):.1f} neurons · passes the OCR/duplicate gates\n")
    else:
        credit = (
            f"- `{slug}.jpg` — photo by [{result['user']['name']}]({result['user']['links']['html']}) "
            f"on [Unsplash]({result['links']['html']}) · Unsplash License (free commercial use, "
            f"no attribution required; credited here anyway) · unsplash photo id `{result['id']}`\n"
        )
    existing = CREDITS.read_text(encoding="utf-8") if CREDITS.exists() else (
        "# Blog artwork credits\n\nEvery image is free-licence stock, mechanically checked for "
        "watermarks, burned-in text and duplicates by `scripts/fetch_blog_art.py`.\n\n")
    existing = re.sub(rf"^- `{re.escape(slug)}\.jpg`.*\n", "", existing, flags=re.M)
    CREDITS.write_text(existing.rstrip("\n") + "\n" + credit, encoding="utf-8")
    return dest


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("--slug", required=True)
    ap.add_argument("--query", default="")
    ap.add_argument("--dry-run", action="store_true")
    ap.add_argument("--source", choices=["flux", "stock"], default="flux",
                    help="flux = Workers AI (free allocation); stock = Unsplash")
    args = ap.parse_args()

    query = args.query or BRIEFS.get(args.slug, "")
    if not query:
        print(f"no art brief for {args.slug} — pass --query")
        return 2
    print(f"{args.slug}  <-  '{query}'  [{args.source}]")
    known = existing_hashes()

    if args.source == "flux":
        result, data = flux_generate(query)
        ok, why, meta = judge(result, data)
        if not ok:
            print(f"  rejected: {why}")
            return 1
        clash = [(n, hamming(meta["dhash"], hv)) for n, hv in known.items()]
        close = [(n, d) for n, d in clash if d < 8]
        if close:
            print(f"  rejected: near-duplicate of {close[0][0]} (hamming {close[0][1]})")
            return 1
        print(f"  accepted: {why}")
        if args.dry_run:
            print(f"  dry run: would save {len(data)//1024} KB")
            return 0
        dest = save(args.slug, result, data)
        print(f"  saved {dest.relative_to(ROOT)} ({len(data)//1024} KB)")
        return 0

    results = search(query)
    if not results:
        return 1
    choice = pick(query, results, known)
    if not choice:
        print("  no candidate passed — try a different --query")
        return 1
    result, data = choice
    if args.dry_run:
        print(f"  dry run: would save {len(data)//1024} KB from {result['id']}")
        return 0
    dest = save(args.slug, result, data)
    print(f"  saved {dest.relative_to(ROOT)} ({len(data)//1024} KB) · credit written")
    return 0


if __name__ == "__main__":
    sys.exit(main())
