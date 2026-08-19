# Favicon — direction 2a

TS in Hanken Grotesk Regular 400 at 0.24em tracking, ink #1a1a17 on white,
closing on the yellow #ffd400 full stop at 0.085 of the em. Cap height is 46%
of the em, roughly a third of the artboard. One step lighter than the nav
wordmark, which is Medium 500.

## Files (ship at the repo root, next to index.html)

    favicon.ico            16 + 32 + 48 in one container
    favicon-16.png         rendered at true 16px, not downscaled
    favicon-32.png         rendered at true 32px, not downscaled
    favicon-48.png
    apple-touch-icon.png   180x180, white ground, no rounded corners (iOS masks its own)
    favicon-512.png        master artboard, for stores / og fallbacks

Every cut is the same em-based geometry rendered at its own size, so the small
files are native rasterisations rather than resized copies of the master.

## Head snippet — paste into all six pages

    <link rel="icon" href="/favicon.ico" sizes="any">
    <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32.png">
    <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16.png">
    <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png">

Root-absolute paths, so the same four lines work from index.html and from the
work/<slug>/ pages without rewriting.

The six pages:

    index.html
    work/arcelormittal/index.html
    work/eon/index.html
    work/hsbc-premier/index.html
    work/laced-authentication/index.html
    work/laced-customer-support/index.html

Place the links directly under the <title> and <meta name="description">, above
the stylesheet link.

## Honest note on 16px

At 16px cap height is about 5.3px and the 0.24em tracking closes to under 2px,
so the S softens. Weight makes almost no difference at this size: 400 and 500
rasterise to nearly the same grey coverage. The yellow stop lands near 1.4px
and still reads. Crisp from 32px up.
