# Open Graph share image — direction 3a

1200 x 630. White page, wordmark and url on one line at matched size and
tracking, the statement on a single line at 46px closing on the yellow full
stop, three metrics with client attribution, and the Laced step 03 collage
along the foot at the baked crop (scale .943, offset -1.39em / +7.98em,
rotation -19deg, tiles 312px at 3:2 with 17px gaps, exactly as the case study).

## File

    og-image.png    1200 x 630, ships at the repo root

## Head tags — all six pages

Absolute URLs are required: crawlers do not resolve relative paths.

    <meta property="og:type" content="website">
    <meta property="og:site_name" content="Thomas Saldanha">
    <meta property="og:title" content="Thomas Saldanha · UX and product design leader">
    <meta property="og:description" content="Thomas Saldanha, UX and product design leader. Selected work for ArcelorMittal, HSBC, E.ON and Laced.">
    <meta property="og:url" content="https://www.uxtom.co.uk/">
    <meta property="og:image" content="https://www.uxtom.co.uk/og-image.png">
    <meta property="og:image:width" content="1200">
    <meta property="og:image:height" content="630">
    <meta property="og:image:alt" content="Thomas Saldanha, UX and product design leader. I help teams find clarity in complex problems.">
    <meta name="twitter:card" content="summary_large_image">

Per page, change only `og:url` and `og:title`, and keep everything else:

    index.html                              https://www.uxtom.co.uk/
    work/arcelormittal/                     ArcelorMittal · Global website rebuild
    work/hsbc-premier/                      HSBC · Premier proposition redesign
    work/laced-authentication/              Laced · End-to-end authentication redesign
    work/laced-customer-support/            Laced · Customer support redesign
    work/eon-app-ia/                        E.ON · App IA & navigation redesign

Keep each case study's `og:title` in the form `<Client> <study> · Thomas Saldanha`
so the platform text and the image do not repeat each other.

## Notes

- One image for all six pages. Per-study images are possible from the same
  board by swapping the collage band and the three metrics; say the word.
- The tags sit with the favicon links, under `<title>` and the description.
- LinkedIn caches aggressively. After deploying, run the page through the
  LinkedIn Post Inspector once to force a re-scrape.
- No text sits within 68px of any edge, so a platform that trims a few
  per cent takes only white.
