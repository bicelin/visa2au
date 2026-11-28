# Photography standard — Visa2AU

One page. It governs every photograph and generated image on the site, and it is
deliberately **separate from the brandbook**: the brandbook controls type, colour
and layout; this controls what may appear in a frame. Applying brand colour to
photography is how a professional site starts to look like a template.

## The brief, in one line

**Australian life, seen quietly.** Real places and real people — a ferry queue, a
terrace street, a shared kitchen table — photographed or generated as atmosphere,
never as evidence.

## The rules

1. **No readable text inside the image.** It cannot be translated into the Russian
   and French twins, it is invisible to a screen reader, and generated text is
   garbled on close inspection. Documents, letters, screens and signs may appear as
   props, but they stay blank, folded, or out of focus. No legible form, no case
   number, no grant notice, no address.
2. **No logo, wordmark or crest of ours.** It becomes a watermark on an image we
   did not photograph, cannot be localised, and competes with the headline. Branding
   belongs on the OG card (`build_og_card.py`), not inside the picture. A foreign
   government's emblem or an airline's branding is still out — not a style choice,
   a factual error on an Australian migration page.
3. **People are welcome.** Faces, hands, families, commuters, students — allowed and
   encouraged. Three limits survive:
   - **Generated people are fictional.** Never present one beside a first-person
     client outcome ("our client was approved") as though it were that client.
   - **Stock photographs of identifiable individuals are for atmosphere only.** The
     Unsplash licence does not carry a model release, so such a photo must never sit
     in a context implying endorsement, testimonial or a specific case.
   - **No authority figures as props** — no police, border force, security or
     uniform presented as if in an official capacity.
4. **Documents are props, not records.** A folder, a blank form, a sealed envelope,
   an application on a desk: all fine. The line is legibility and specificity —
   nothing that could be read as proof of a visa outcome, a real application, or a
   client's matter. At thumbnail size it must read as "paperwork", nothing more.

Why rule 1 outranks taste: the mechanical gate (OCR, luminance, dHash, aspect)
**passed** a passport cover reading `PASSPORT` and a calendar header reading
`November`. The brief keeps text out; the gate is only a filter behind it.

## Palette: constrain the scene, not the pixels

The site's colour is amber `#f0a000`, cream `#fbf6ed`, navy `#1a2744`, near-black
`#0a0f1c`, terracotta `#c1622b`.

Do **not** tint photographs navy or gold. Constrain what is in the frame instead:

| share of frame | content |
| --- | --- |
| ~80% | neutral or natural surfaces — cream, pale oak, soft grey, sandstone, sky |
| ≤20% | one warm accent — brass, amber, a wooden edge, wattle |
| rarely | navy, and only as a dark object or shadow, never as a highlighted blue |

The reason is hierarchy: the amber call-to-action must be the most saturated thing
on the page. If the photograph also carries strong amber and navy, the button stops
pulling.

## Australian identity: places, materials, light — and people

The company is Australian, so the set should look Australian rather than generic
stock. `scripts/fetch_blog_art.py` holds the approved cue list and picks one per
post, deterministically from the slug, so a rebuild keeps the same image. Three
registers, mixed by subject:

**City and landscape**
- a ferry crossing the harbour in flat morning light
- a sandstone terrace street with a tram line
- a laneway café table, cups and a folded paper
- a river walk with mangroves at low tide
- a wide outback horizon under a high pale sky
- a beach car park with surfboards on a roof rack

**Materials and light**
- pale eucalyptus leaves in a plain glass jar
- a weathered timber paling with morning light across it
- a warm sandstone wall, ochre toned, softly lit
- sun-bleached linen on a timber table
- native wattle sprigs in a plain ceramic vase
- a eucalyptus branch shadow across a cream wall

**Lifestyle, with people**
- a family unpacking groceries on a kitchen bench
- a student at a shared desk with a laptop and a mug
- a commuter on a platform, turned away, morning light
- two people talking across a small table, faces out of frame
- a child's shoes by a front door, an adult's beside them

Boundaries on the list: **no flags, no koalas, no "AUSTRALIA" lettering, no
souvenir clichés.** Identity comes from place, material and light, not symbols. And
**real landmarks are stock-only** — a generated Opera House or Harbour Bridge comes
out wrong, so when the place must be true, use real photography.

## Composition and grade

- **1440×810 native 16:9** from the model, not a crop from a square. No upscaling.
- The notable detail sits left of centre. Do not reserve a headline zone inside the
  image — the article template puts the headline **above** the image, so requested
  negative space only made frames emptier.
- One soft light source, no hard specular highlights (they band after AVIF).
- Warm-neutral grade, saturation −10 to −20%, blacks lifted slightly so dark mode
  does not read as a hole. Mean luminance between 60 and 200.
- **Consistency test:** at 200 px wide, the whole set should look like it came from
  one shoot. If one frame is a different light, distance or grade, it is wrong even
  if it is a good picture.

## Model and cost

Default `@cf/black-forest-labs/flux-2-klein-4b` at 1440×810 through Cloudflare
Workers AI. It honours width/height (multipart/form-data only — a JSON body is
rejected) at roughly **189 neurons a hero**, about what `flux-1-schnell` used to
cost for a smaller, softer, cropped frame.

`flux-2-dev` is visibly stronger (best materials, light, and the only one that gets
faces right) but costs **~9,400–16,900 neurons** an image — effectively the whole
daily free allowance of 10,000, or about $0.10–0.19. Use it deliberately: one hero
at a time, and expect the day's generation to end there. `flux-1-schnell` remains
the cheap fallback at ~173 neurons.

## Attribution

Never in the pixels. Record it where machines and editors can find it:

- `app/imgs/blog/CREDITS.md` — one line per image: model and prompt hash for
  generated art; photographer, Unsplash link and licence for stock.
- The page's `ImageObject` schema — `creditText` and `creator` for stock.
- No attribution is legally required by the Unsplash licence; we record it anyway,
  because provenance is the difference between a publication and a scraped page.
