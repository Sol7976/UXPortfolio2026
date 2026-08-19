# Ship manifest · uxtom.co.uk

Static site for GitHub Pages, custom domain `www.uxtom.co.uk`.
Everything not listed here is exploration and does not ship.

**Built and live since 17 August 2026 at https://www.uxtom.co.uk.**
See "Deployment" below for how it is hosted and how to change it.

Current as of 18 August 2026.

## Pages (6 routes, 12 designs)

| Route | Desktop design | Mobile design |
|---|---|---|
| `/` | `Homepage Desktop.dc.html` | `Homepage Mobile.dc.html` |
| `/work/arcelormittal/` | `Restore - ArcelorMittal Case Study.dc.html` | `Restore - ArcelorMittal Case Study Mobile v2.dc.html` |
| `/work/hsbc-premier/` | `Restore - HSBC Premier Case Study.dc.html` | `Restore - HSBC Premier Case Study Mobile.dc.html` |
| `/work/eon-app-ia/` | `Restore - E.ON Case Study.dc.html` | `Restore - E.ON Case Study Mobile.dc.html` |
| `/work/laced-authentication/` | `Restore - Laced Authentication Case Study.dc.html` | `Restore - Laced Authentication Case Study Mobile.dc.html` |
| `/work/laced-customer-support/` | `Restore - Laced Customer Support Case Study.dc.html` | `Restore - Laced Customer Support Case Study Mobile.dc.html` |

Desktop and mobile are two designs of the same route, not two routes.
`Final designs - back up restore.dc.html` is the review board that shows all twelve side by side. It is not a page and does not ship.

## Breakpoint contract

The designs are authored at two fixed widths and there is no intermediate design. Do not invent one.

- **≥ 1200px** — serve the desktop design. Every band runs edge to edge; the content column inside grows with the viewport and caps at **1680px**. See "Full-bleed bands" below, which governs every page on the site.
- **900px–1199px** — the same desktop design, scaled down proportionally to the viewport. No reflow, no rearranged grids.
- **< 900px** — serve the mobile design. It is authored on a 440px column with 24px side padding; let that column grow fluidly to the viewport width. Nothing else changes.

## Full-bleed bands, capped column

This applies to the homepage and all five case studies. The reference is `Wide Screen Case Study.dc.html`
(option 3a), built on the real E.ON page.

Every coloured surface — white, ivory `#f3eee3`, grey `#f4f4f2` / `#ededeb`, the black `#201C16`
statement bands and the footer — spans the full viewport at all times. The content inside each band
is capped and centred. Never let a band stop at the content width, and never put a visible page-edge
or card border around the site.

One rule does it. Each band keeps its authored vertical padding and gains a computed horizontal one:

```css
padding-left:  calc((100% - 1680px) / 2 + 48px);
padding-right: calc((100% - 1680px) / 2 + 48px);
```

48px is the case-study gutter; the homepage uses 60px. Below 1680px the calc goes negative, so clamp
it with `max()` and the layout falls back to the plain gutter with no breakpoint needed.

**Figures scale uniformly with the column.** The column grows from the authored 1104px of content to
1584px, a factor of **1.435**. Every figure scales by that factor in **both axes**: width and height
together. Nothing re-crops, because the aspect ratio is preserved: the composition is identical, just
larger. Copy and figures therefore share the same left and right edges, and the band's vertical rhythm
holds.

That is the whole rule. It covers the hero images and videos, the matrix and dendrogram panels, the IA
map, the tree-test and task-summary panels, the axis + data chart stacks, every `[data-panelgroup]`
panel, the step 06 wireframe collage and the step 07 build video, plus the three modules CLAUDE.md
names as locked:

- E.ON hero collage (`aspect-ratio:600/652`, cqw rows, so it scales natively)
- E.ON step 05 hand-off collage (144px phones, 21.6px gaps, eighteen baked `object-position` values)
- Laced authentication step 03 diagonal collage (312px tiles, per-column margin-top stagger)

**Scale, never re-derive.** Multiply the module's own scale factor; do not recompute tile sizes, gaps,
stagger offsets, `object-position` percentages, crop windows, `r`, circumference, `data-c`, `data-off`,
`stroke-width` or `data-w`. Every one of those stays exactly as authored, or the crops shift and the
animation engine seeds the wrong values. A `zoom` or `transform: scale()` on a fit wrapper, driven by a
single `--k` token, is the right mechanism; it is the same `.m-chartfit` pattern the mobile pages
already use. Where a panel sets an explicit `height` or `min-height` in px, that value scales too.

**What this costs.** Raster figures render 43% larger than drawn, so anything exported at 1× will soften
on a 2× display. Watch the E.ON phone-collage crops, the Laced tile crops and the two videos. If any of
them look soft at 2560px, tell me and I will re-export at higher resolution rather than shrinking the
module.

**Leave the scroll animation alone.** The `data-wf="reveal"` frames, the `data-tilewipe` clips, the arcs
and the bars all behave correctly and are signed off. A uniform scale does not disturb them: the wipe
front and the clip fronts are proportional, so they land in the same place relative to the artwork.

**Controls never scale.** The zoom applies to evidence, not to UI. Every `data-tabgroup` pill toggle,`data-carousel-nav` arrow and fraction counter sits **outside** the scaled cell and stays at its authored
size at every width. Scaled up they read as oversized furniture, and their 44px tap targets stop meaning
what they say. Applies to ArcelorMittal step 03, E.ON step 04 and both its IA carousels, and Laced
customer support step 01. Figcaptions, the mono `FIG. NN` tags and caption chips sit outside it too:
they are typography, not evidence, and stay at their authored size. Only type *measures* rescale with
the column, never type sizes. The one deliberate exception is the label type inside a `data-arc` or
`data-bar` module, which scales with its ring or bars so the proportions hold.

**Bleeding modules run to the viewport, not to the column.** Some figures were drawn to bleed off the
band edge: the ArcelorMittal step 06 wireframe collage and step 02 interview wall, the E.ON hero and
step 05 collages, the Laced authentication step 03 diagonal. Their frames must extend past the capped
column to the viewport edge, `calc(50vw - 50%)` on the bleeding side, with `overflow:hidden` on the
band. Otherwise the artwork stops a few pixels short of the screen edge and the bleed reads as a
mistake. Do not rescale the artwork or change the crop: the tiles keep their scaled size and their
position relative to the column's left edge, so the only thing that changes is how much surplus shows.

The drawn surplus is not always enough to reach a 2560px viewport, since it was authored against a
1200px column. Where it falls short, **bleeding modules compute their scale from the viewport rather
than the capped column**: they are decorative bleeds, not measured evidence, so a factor above 1.435 is
acceptable there. One cap: no raster may paint more than 1.35× its source width. Where the cap bites,
shift the artwork toward the bleeding edge instead of growing it, and let the far side crop against the
column. Shifting is only available to **continuous artwork**: any module with a visible structural
start, a tile grid, a column of screens, keeps that edge fixed on the column keyline with its first
unit whole, and simply bleeds as far as the artwork reaches. Cropping into the first tile to close a
gap is the worse trade.

### Type measures rescale with the column

The authored measures were set for a 1104px content column. At 1584px they leave headings and body
copy sitting as narrow stubs in a wide band, so each one scales up. Reference build:
`Wide Screen Case Study.dc.html` (option 3a), where these values are applied to the real E.ON page.

Some authored files carry an explicit cap, some carry none (E.ON steps 03 and 05 have no cap at all,
which is why they read correctly and the capped ones did not). Apply the right-hand column
everywhere, whether or not the source file has a value:

| Role | Size | Authored | Build value |
|---|---|---|---|
| Case-study cover title `h1` | 300 52px | 15ch | `24ch` |
| Step title `h2` | 400 28px | 22–24ch or none | `48ch` |
| Step body `p` | 400 **18px** | 50ch | `63ch` |
| Step body on black | 400 **18px** | 44ch | `55ch` |
| Band statement: context, business problem | 300 32px | 26ch or none | **5/12 of the column** |
| Business problem body | 400 **18px** | 48ch | `63ch`, as the step 01 body |
| Outcome statement | 300 34px | 28ch | `40ch` |
| Pull-out line | 300 22px | 70ch | `70ch`, unchanged |
| Homepage hero `h1` | 300 60px | 24ch | `26ch` |
| Homepage hero body | 400 **21px** | 52ch | `62ch` |
| Homepage section heading `h2` | 300 34px | 38ch | `44ch` |
| Homepage mentoring body | 400 **18px** | 52ch | `62ch` |
| Index-row discipline line | 600 11px caps | none | none, it is a single line |

48ch on step titles is set from the length of E.ON step 05, which Thomas signed off directly: most
titles then sit on one line and only the longest wrap to two.

**Body copy is 18px and the body measures were retuned to it (13 August).** Body was 16px in the
case studies and 17px for the homepage's mentoring lede; all of it is now 18px, and the hero lede
went 19px to 21px so it still reads a clear step above body.

The step-body measure came down from 75ch to 63ch at the same time, and the black variant from 66ch
to 55ch. That is not a consequence of the size change: a `ch` cap and the average character both
scale with the font, so characters per line is font-size independent and 75ch was always about 89
characters. 89 is past the 45–75 comfortable range and over the 80 that WCAG 1.4.8 (AAA) asks for.
Counted on the built pages, 63ch now gives 76–77 characters at the 1680 cap and 56–60 at 1200,
where these paragraphs are limited by their grid column rather than the cap, so nothing below about
1240px moved. On black stays a step tighter than on light, as the authored 44ch/50ch pair did.

The band statement is the one measure given as a fraction rather than a `ch` value: five twelfths of
the content column, so 460px against the authored 1104 and 660px at the 1680 cap. It is one shared
measure for the context statement and the business problem statement, replacing the separate `ch`
values they used to carry, and it is a column narrower than the half-column the design files carry as
`max-width:552px`.

The business problem body shares both vertical edges with the step 01 body, at every viewport. Its
grid column is the step 01 copy cell, and it carries the step body's own 63ch. Put that cap on the
grid column instead and the last track shortens, which pushes the paragraph right and breaks the left
edge: at the 1680 cap it sat 32px off. Column for position, `ch` for measure.

Where a piece of running text is not named above, match the row whose **layout context** it shares,
not the one whose authored value it happens to equal. Text in a two-column block takes the homepage
body treatment (a modest increase, because its column is already narrow); text spanning a full band
takes the step-body treatment.

**Display headings take `text-wrap: balance`, not `pretty` (13 August).** `pretty` only pulls the
last line up; on a two- or three-line display line it leaves a long first line and a stub, which is
what made the homepage h1 and the HSBC step 02 title read as over-long on a wide screen. Counted at
the 1680 cap, before and after:

| | `pretty` | `balance` |
|---|---|---|
| Homepage hero `h1` | 629 + 467 | 573 + 523 |
| HSBC step 02 `h2` | 743 + 245 | 469 + 519 |
| HSBC black outcome `h2` | 756 + 768 + 180 | 554 + 567 + 584 |
| Context statement | 656 + 602 + 646 + 179 | 494 + 464 + 576 + 548 |

It applies to every `h1`, `h2` and band statement, changes nothing on a single-line heading, changes
no measure, and is ignored by browsers that do not support it, which simply get today's behaviour.
Chrome balances up to four lines and falls back beyond that, which is the right cut-off.

Running text keeps `text-wrap: pretty`: quotes, ledes, the testimonial and feedback blockquotes.
Either way, do not add manual `<br>` or non-breaking spaces to force breaks.

Two-column step layouts (`grid 1fr 1.15fr`, title left / body right) keep their proportions as the
band widens. The columns get wider, the text inside them takes the measure above and sits left.

The mobile designs include a mocked phone status bar (time, signal, battery) at the top. That is presentation for the review board only. **Do not build it.**

Route slugs above are final. Do not change them.

## Two things the design files get wrong

Both are bugs in the reference, not intent. Fix them in the build; do not reproduce them.

- **The ArcelorMittal font links omitted Newsreader.** Its step 02 pull quote asks for
  `'Newsreader', serif` italic, so the reference renders it in Times. Both ArcelorMittal design files
  have been corrected to load `Newsreader:ital,opsz,wght@1,6..72,400;1,6..72,500`, matching the other
  four studies. Newsreader italic is the editorial accent throughout the site.
- **The case-study design files set no page text colour**, so the brand mark inherits the browser's
  black. Use `#201C16`, as the homepage does. Applies to all five studies.
- **The homepage design file omits `text-decoration:none` on `a`.** All five case-study files carry
  it in their helmet; the homepage file does not, so the browser's dark default underline paints
  under every anchor that has not reset it locally. The most visible is the hero's Download CV,
  whose own span already carries the yellow 2px rule the design asks for, so it renders with two
  underlines, one of them dark. The build sets `a{text-decoration:none}` globally and underlines
  only where the system asks for one.
- **`.cs-footer-link` has no hover state in any case-study design file**, so the generic
  `a:hover{color:#1a1a17}` in the helmet takes it: "View the next case study" turns dark ink on the
  black footer and all but disappears. The build pins it to the footer cream instead. It currently
  has no hover feedback at all, which is worth a decision at some point.

## Build, as delivered

Plain static HTML, one stylesheet, five scripts. No framework, no build step, no dependencies. Six HTML files, `styles.css`, and the scripts listed under "Shared scripts". Every asset path is relative, which is what lets the site work unchanged at the custom domain and at the project-repo URL. The only absolute URLs on the site are the canonical and Open Graph tags, which crawlers require.

## Deployment

| | |
|---|---|
| Live at | https://www.uxtom.co.uk |
| Repo | `github.com/Sol7976/UXPortfolio2026` (public) |
| Design source | `github.com/Sol7976/UXPortfolio2026-backup` (private, the `_design` folder) |
| Hosting | GitHub Pages, deploy from branch `main`, folder `/` |
| DNS | GoDaddy. `www` CNAME to `sol7976.github.io`; apex on GitHub's four A records, redirecting to `www` |
| HTTPS | Enforced. Let's Encrypt, auto-renewing |
| Deploy time | About 80 seconds from push to live |

**To change the site:** edit, then commit and push. GitHub rebuilds automatically.

```
git -C ~/Desktop/UXPortfolio2026 add -A
git -C ~/Desktop/UXPortfolio2026 commit -m "what changed"
git -C ~/Desktop/UXPortfolio2026 push
```

The design source is a separate repo living inside `_design`, which the site repo gitignores. Same three commands in that folder to version a design change.

**Search.** Verified in Google Search Console via a `google-site-verification` meta tag on the homepage. `sitemap.xml` lists all six routes and is submitted; `robots.txt` points at it. After any change to a page's title or description, re-run the URL through Search Console's URL Inspection and through the LinkedIn Post Inspector, which caches share previews for about a week.

**Description length: 100 to 160 characters, every page.** LinkedIn's Post Inspector warns below 100 and Google truncates around 160. Three pages breached it on 18 Aug 2026 and were rewritten rather than trimmed: the homepage sat at 84, Laced customer support at 95, and ArcelorMittal ran to 175 and would have been cut mid-sentence in search results. All six now land between 107 and 159.

Each page's `meta description`, `og:description` and `twitter:description` carry the **same string**. Change one and change all three, or the search result and the share preview drift apart. Note that a curly apostrophe counts as two bytes, so a `grep`-style byte count reads longer than the character count.

**Titles** are `<Study> · <Client> · Thomas Saldanha` on the case studies and `Thomas Saldanha · <role>` on the homepage. The role appears in metadata only and never in visible copy, so a repositioning is a metadata edit; check the description still fits the band afterwards, since a longer role can push it past 160.

**Local preview.** `.claude/nocache-server.py` serves the folder with caching off, so an edit shows on reload rather than being served stale. Dev only, not part of the site.

## Scope

There is no About page and no Approach page. The site is the homepage plus five case studies. Do not build placeholders for them and do not add them to the nav.

**Outstanding:**

**Three files Thomas is supplying later.** Build the links now, leave the destinations to arrive:

- `cv/thomas-saldanha-cv.pdf` — linked from two CTAs.
- `writing/user-research-and-testing/` and `writing/` — the two "Resources from my talks" pills on the homepage. Keep both pills. The second one's label is still placeholder copy reading "Second document"; Thomas is supplying the real label with the file.

**These four CTAs are commented out in `index.html` as of 17 August 2026**, so nothing on the live site links to a file that does not exist. Each block carries an uncomment-ready note. Two of them comment out the wrapper as well as the link: `.hero-cta` carries a 42px top margin that would leave dead space, and `.mentor-res` would leave the "Resources from my talks" label with nothing under it. The footer keeps its email CTA, so only the link is commented there. Restore by deleting the two comment lines around each block, and replace the second pill's placeholder "Second document" label with the real one.
- ~~**Mobile menu open state**~~ — **built, 17 August 2026**, from option `2g` in `Nav Options.dc.html`. Full-screen white panel on all six pages, driven by `nav-menu.js`: brand mark left, 17px close cross in a 44px target right, three stacked links (Work, LinkedIn with the external arrow, the email address) at 26px vertical padding on hairline separators, each with the 2px yellow underline at rest, closing on a line of body copy. Three deviations from 2g, all noted in section 2b of `styles.css`: the header row takes the nav bar's own 10/24/16 padding so the brand does not shift when the menu opens, the brand reuses `.brand` rather than 2g's 500/.22em, and the closing line is 16px rather than 15px to hold the body floor. The burger is now a real `<button>` with `aria-expanded`/`aria-controls`; the panel is `role="dialog" aria-modal="true"`, traps Tab, closes on Escape, on the close cross, on any link and on crossing to the desktop breakpoint, locks body scroll while open and returns focus to the burger.

## Shared scripts

| File | Used by | Purpose |
|---|---|---|
| `cs-interactions.js` | every case study | `data-reveal`, `data-arc`, `data-bar`, `data-tilewipe`, `data-tabgroup`/`data-panelgroup`, `data-wf` |
| `ts-carousel.js` | E.ON (both), homepage testimonials | paged carousels (`data-carousel-*`) |
| `hsbc-motion-lab.js` | HSBC step 04, both E.ON collages | scroll-scrubbed wipe/fade collage |
| `lcs-pie.js` | Laced customer support step 01 | sequential multi-segment doughnut |
| `nav-menu.js` | every page | mobile menu open state (option `2g`), and the hide-on-scroll-down nav |

All five are plain IIFEs with no dependencies. `cs-interactions.js` exposes `window.__csRescan()` and `lcs-pie.js` exposes `window.__lcsPie()`; call them after any DOM change.

`support.js` is the design-tool runtime that renders these prototype files. **It does not ship.** In the real site the markup is static HTML.

## Assets

`images/` holds every photograph, screen crop, chart layer and video. `collage/` holds the twelve HSBC step 04 screens. `uploads/` holds two Laced screenshots. Eight testimonial avatars sit at the root. 102 files in total, all present in this archive.

Crops listed in `images/laced-step03-collage.LOCKED.txt` are fixed and must not be re-derived or re-trimmed.

Charts are split into two stacked layers (a transparent axis PNG and a data PNG). Only the data layer animates. Keep both.

## Accessibility contract

- Body text ≥16px, tracked caps labels ≥10px, tap targets ≥44px.
- Ink `#1a1a17`, body `#4c4b45`, labels `#67665f`, step markers `#726f68`. `#84837d` is retired.
- Yellow `#ffd400` is never text on a light surface. One yellow metric per outcome strip, always the first, desktop and mobile alike.
- Every nav, footer and index-row link is a real `<a href>`.
- Focus ring: `2px solid #ffd400`, `outline-offset:3px`, on `:focus-visible` only.
- `prefers-reduced-motion: reduce` seeds all evidence to its finished state and stops the marquee and carousels.
- One `<h1>` per page (the case-study title); step titles are `<h2>`. No `<h3>`.
- Every page carries `lang="en-GB"`, a `<title>` and a `<meta name="description">`.

## Reference

`Toolkit.dc.html` is the component kit and the written aesthetic reference. `DESIGN-RULES -rename to CLAUDE.md-.md` holds the full system rules. `copy/uxtom-copy-for-review.md` holds every line of copy with an ID.
