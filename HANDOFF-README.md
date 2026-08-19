# Handoff: uxtom.co.uk — Thomas Saldanha, UX and product design leader portfolio

> **Status: built and live since 17 August 2026 at https://www.uxtom.co.uk.**
> This document was written to brief a build that has since happened. It is kept
> because the design reasoning in it is still the reference. Where it reads as
> instructions for work to be done, that work is done: see the Deployment
> section of `SHIP-MANIFEST.md` for how the site is hosted and changed, and
> `CLAUDE.md` for the rules the build actually follows, including the places it
> deliberately departs from these design files.

## Overview

A six-route static portfolio site: a homepage and five case studies (ArcelorMittal, HSBC Premier,
E.ON, Laced authentication, Laced customer support). Long-scroll editorial pages, metrics-led, with
scroll-driven evidence animations. Hosted on GitHub Pages at the custom domain `www.uxtom.co.uk`,
served over HTTPS, with the source in `github.com/Sol7976/UXPortfolio2026`.

Start with `SHIP-MANIFEST.md` in this folder: it lists every route, which design file belongs to it,
the breakpoint contract, the shared scripts and the accessibility contract. This README covers how to
work with the files. `DESIGN-RULES -rename to CLAUDE.md-.md` is the full design system in words;
rename it to `CLAUDE.md` at the root of the new repo so it governs the build automatically.

## About the design files

The `.dc.html` files in this bundle are **design references authored in HTML**. They are prototypes
that show the intended look and behaviour. They are not production code to lift wholesale: each one
is wrapped in a design-tool runtime (`support.js`) that renders it, and that runtime does not ship.

Your task is to **rebuild these designs as a plain static site** on GitHub Pages — semantic HTML, one
stylesheet, the four vanilla-JS animation files copied across as they are. No framework, no build
step, no component library, no CSS framework. That choice is deliberate: it is the cheapest to host
(free), has nothing to keep patched, gives the least room for a framework to reinterpret the layout,
and leaves Thomas with six files he can edit himself. The designs are inline-styled because of how they were authored; in the real build, move
those styles into a stylesheet, but do not change a single value while doing it.

## Fidelity: this is the whole job

**High fidelity, and exactness is the requirement, not an aspiration.** These designs are signed off
to the pixel after a long review. Every value in them is deliberate: the 11px tracked-caps step
markers at `#726f68`, the 9px external-link arrow lifted 3px so it centres on the caps rather than on
the underline's padding box, the 7px gap between a step numeral and its method name, the `max-width`
in `ch` units on individual headlines that control exactly where each one wraps.

Concretely:

- **Do not round, normalise, or "tidy" any number.** If a margin is 31px it is 31px because it aligns
  a body paragraph's first line to a heading's baseline in a two-column grid.
- **Do not substitute a spacing scale.** There isn't one, deliberately. Section padding varies
  between bands.
- **Do not consolidate the `ch`-based `max-width` values on headings.** They are per-headline wrap
  control, and several were tuned individually in review.
- **Do not touch `text-wrap: pretty` / `balance` declarations.** They are widow and orphan control,
  applied heading by heading.
- **Do not re-crop or re-scale any image.** Several carry hand-set `object-position` percentages.
  The Laced step 03 collage crops are locked and documented in
  `images/laced-step03-collage.LOCKED.txt`.
- **Do not rebuild the collages.** The E.ON hero and step 05 phone collages have hand-derived column
  offsets, container-query-relative sizing and per-screen crop positions. Copy the markup and the
  numbers verbatim. The design rules explain why: changing the panel height re-crops every screen in
  the bottom row.

A good test: screenshot your build at 1200px and 440px, overlay it on the design reference, and expect
no visible difference.

## Fonts

Hanken Grotesk (weights 300, 400, 500, 600, 700, 800) is the only UI family. Newsreader italic is used
only for editorial pull quotes. JetBrains Mono is used only for figure captions, keyword lists and hex
values. All three load from Google Fonts in the current files. Self-host them in the real build for
performance, but keep the exact families and weights.

## Screens

Twelve designs, six routes. Each case study follows the same band sequence top to bottom:

1. **Nav bar** — brand mark ("Thomas Saldanha" in Medium 500, 15px, .24em tracking, caps, with a
   yellow full stop) left; Work / LinkedIn / email pill right. The email is an outlined pill in caps
   that fills yellow on hover. Work and LinkedIn are text links that darken to ink and gain a 2px
   yellow underline on hover. LinkedIn carries a 9px external-arrow glyph outside the underlined span.
2. **Split cover** — a `//` yellow mark plus client kicker, Light-300 title, caps discipline line in
   the left column; hero image right.
3. **Metric strip** — three or four metrics, Light-300 numbers with hairline dividers, caps labels
   under. No kicker above it.
4. **Context** — a Light-300 32px statement, plus a four-row meta table (Role / Sector / Scale / Remit).
5. **The business problem** — ivory band, a Light-300 32px statement and two body paragraphs.
6. **My role** — plus a horizontal numbered approach pipeline joined by yellow arrows.
7. **Numbered process steps** — alternating white / grey `#f4f4f2` / black `#201C16`. At most two
   black bands per page. Each step opens on a marker (`01. METHOD NAME`, 11px, .14em tracking,
   `#726f68` on light and `#8b897e` on black), then a Regular-400 28px title, then body copy, then its
   figure or evidence module.
8. **Outcome** — three metrics, the first one yellowed, on black.
9. **Footer** — black band, Light-300 line with a yellow full stop, a `Next:` chain to the following
   study, solid and outline CTAs, and utility links (email, LinkedIn) on the same baseline as the read
   link.

The homepage sequence is: white hero → grey client marquee → white case-study index → white mentoring
→ grey testimonials → black footer.

Rather than restate every value here, read it off the design file for the route you are building. The
files are the specification; this README exists to tell you how to treat them.

## Interactions and behaviour

House easing is `cubic-bezier(.4,0,.2,1)`. Hover and state transitions are `.18s ease`. Evidence
animations run once when scrolled into view and never loop. Only the client marquee (46s linear) and
the two videos loop.

Hooks, all handled by the four scripts in this folder:

| Hook | Behaviour | Duration |
|---|---|---|
| `data-reveal="down\|right"` | clip-path wipe on real imagery | 1700ms |
| `data-tilewipe` + `data-tw-i` | clip-path wipe on the frame of a scaled or translated crop, staggered by index × 150ms | 1700ms |
| `data-arc` + `data-c`/`data-off`/`data-delay` | donut ring draw | 1700ms |
| `data-bar` + `data-w`/`data-delay` | bar grow | 1150ms |
| `data-tabgroup` + `data-view` / `data-panelgroup` | segmented pill toggle; replays the arcs and reveals inside the panel it opens | — |
| `data-wf="reveal"` | scroll-linked wireframe → design morph via a `--p` custom property | scroll |
| `data-carousel-track`/`-nav`/`-frac`/`-perview` | paged carousel with a fraction counter | — |
| `data-collage-frame data-motion="wipefade"` | staggered per-column collage reveal | scroll |

Three gotchas that cost real time to find, so do not undo them:

- Reveals animate a **CSS clip-path transition whose resting state is fully visible**, not WAAPI.
  WAAPI clip-path silently no-ops in the authoring runtime and clips the data layer away permanently.
  Numeric properties (`stroke-dashoffset`, `width`) animate fine via WAAPI.
- `data-arc` and `data-bar` are only seeded and observed inside a `[data-panelgroup]` ancestor. A
  standalone donut or bar set still needs that wrapper.
- The E.ON carousel connector hairline lives **inside** the scrolling track as its first absolutely
  positioned child, spanning first-stem centre to last-stem centre. Positioned as a sibling overlay
  instead, it visibly slides on every page change.

`prefers-reduced-motion: reduce` must seed every arc, bar, reveal and tilewipe to its finished state,
pin `data-wf` at `--p: 1`, stop the marquee, and make carousels jump rather than scroll. The scripts
already do this; keep it.

## Design tokens

**Surfaces** — white `#ffffff` (default page) · ivory `#f3eee3` (warm resting band) · grey whisper
`#f4f4f2` · grey soft `#ededeb` · black `#201C16` (statement bands and the footer).

**Ink** — primary `#1a1a17` · body `#4c4b45` · labels `#67665f` · step markers `#726f68` · faint
`#a6a49d` (decorative only) · hairline numerals `#c3c1ba` (decorative only). On black: cream
`#f0ede3`, muted `#9d9b8f`, markers `#8b897e`.

**Accent** — yellow `#ffd400`, used only for: the `//` mark, the full stop after a name, CTA pill
fills, link underlines, the hover wash `rgba(255,212,0,.16)`, and one metric per outcome strip. Never
as text on a light surface.

**Borders and radii** — hairline `rgba(18,18,16,.12)` on light, `rgba(240,237,227,.14)` on black ·
cards 14–16px · pills 100px · images 14px (full-bleed frames drop it).

**Type** — display Light 300, tracking −.02 to −.035em (hero 48–66px, section 34–42px) · titles and
metrics-in-rows Medium 500, −.01em (20–26px) · step titles Regular 400, 28px desktop / 24px mobile ·
body Regular 400, 16–19px, line-height 1.6–1.7 · kickers Semibold 600 tracked caps, 10–11px,
.13–.22em · metrics Light 300, 30–46px with a caps-10px label under.

Numerals never take a trailing dot except in a step marker, where `01.` is deliberate.

**Section padding** — roughly 80–88px vertical on desktop, 52–56px on mobile. It varies band to band
by design; take it from the file.

## Assets

`images/` (photography, screen crops, chart layers, `arcelormittal-hero.mp4`, `dev-build.mp4`, and
`images/eon-collage/` with eighteen phone screens) · `collage/` (twelve HSBC screens) · `uploads/`
(two Laced screenshots) · eight testimonial avatars at the root. 102 files, all present here, all at
the paths the designs reference. Keep the paths.

Videos autoplay muted, loop, `playsinline`, and are framed with a hairline, 14px radius and a soft
shadow, with scrollbars cropped by an `overflow:hidden` wrapper over a slightly oversized video.

## Files in this folder

- `SHIP-MANIFEST.md` — routes, breakpoints, what does not ship. **Read this first.**
- `DESIGN-RULES -rename to CLAUDE.md-.md` — the full design system.
- `RESTORE.md` — how this archive is structured.
- Twelve `.dc.html` design files (see the manifest table for the route each one serves).
- `Final designs - back up restore.dc.html` — the review board showing all twelve together.
- `Toolkit.dc.html` — component kit and aesthetic reference.
- `cs-interactions.js`, `ts-carousel.js`, `hsbc-motion-lab.js`, `lcs-pie.js` — copied across as they
  are. A fifth, `nav-menu.js`, was written during the build for the mobile menu and the
  hide-on-scroll nav; it has no design-file counterpart.
- `support.js` — the authoring runtime. Needed to view the design files; **does not ship**.
- `copy/uxtom-copy-for-review.md` — every line of copy with a stable ID.

## Scope and open items

The site is the homepage plus five case studies. **There is no About page and no Approach page** — do
not build placeholders and do not add them to the nav.

1. ~~**Mobile menu open state is designed.**~~ **Built 17 August 2026** from `Nav Options.dc.html`,
   option `2g`, on all six pages: `nav-menu.js` plus section 2b of `styles.css`. The burger is a real
   button, the panel is a modal dialog that traps Tab, closes on Escape / the cross / any link /
   crossing to desktop, locks body scroll and hands focus back to the burger. Three documented
   deviations from 2g (header padding, brand weight, and a 16px closing line rather than 15px) are in
   the manifest and in the CSS comment.
2. **Three files arrive later.** Thomas is supplying `cv/thomas-saldanha-cv.pdf` and the two
   "Resources from my talks" destinations (`writing/user-research-and-testing/` and `writing/`),
   along with the real label for the second pill, which currently reads the placeholder "Second
   document". Keep all four links in the markup; do not stub pages for them.
3. Route slugs in the manifest are final.
4. The mobile designs carry a mocked phone status bar for review purposes. Do not build it.
5. Tabbed modules (E.ON step 04 learnings, Laced customer support step 01) hide their inactive panel.
   Decide how those behave for search engines and for print.
