/* Deck viewer for the talk page. Framework-free, no dependencies, one instance
   per page. Replaces the authoring component the design bundle shipped
   (deck-stage.js): that file is 2,185 lines, most of it a thumbnail rail, drag
   reorder, a right-click slide menu, print pagination and markup validation,
   all of which are authoring affordances the public page must not carry. What
   a reader needs is here.

   Two presentations, one set of slides:

   >= 900px  the slides are painted at their authored 1920x1080 and the whole
             stage is scaled to the frame, so every slide is pixel-exact and
             nothing reflows. One slide is shown at a time.
   <  900px  the stage is dismantled in CSS (section 22) and each slide lays
             out in normal flow at a phone type scale, inside a fixed 3:4 card
             that scrolls its own content. Same markup, same one-at-a-time
             model: a 1920px stage scaled to a 375px screen would render the
             deck's 25px body text at about 5px, and a card that grew and
             shrank with each slide read as page content rather than a deck.

   The scale is computed here rather than in CSS because CSS cannot divide one
   length by another. It is read from offsetWidth, NOT getBoundingClientRect:
   between 900 and 1199px the site scales .page with a transform, and a
   client rect would report the already-transformed width and scale twice. */
(function () {
  var deck = document.querySelector('[data-deck]');
  if (!deck) return;

  var DESIGN_W = 1920, DESIGN_H = 1080, MIN_DESKTOP = 900;

  var frame  = deck.querySelector('[data-deck-frame]');
  var stage  = deck.querySelector('[data-deck-stage]');
  var slides = [].slice.call(deck.querySelectorAll('[data-deck-slide]'));
  var prev   = deck.querySelector('[data-deck-prev]');
  var next   = deck.querySelector('[data-deck-next]');
  var full   = deck.querySelector('[data-deck-full]');
  var now    = deck.querySelector('[data-deck-now]');
  var total  = deck.querySelector('[data-deck-total]');
  var label  = deck.querySelector('[data-deck-label]');
  var live   = deck.querySelector('[data-deck-live]');
  var chaps  = [].slice.call(deck.querySelectorAll('[data-deck-chapter]'));
  if (!slides.length) return;

  var i = 0;

  /* ---- scale ---------------------------------------------------------- */

  function fit() {
    if (!frame || !stage) return;
    if (innerWidth < MIN_DESKTOP) { stage.style.removeProperty('--dk-k'); return; }
    var w = frame.offsetWidth;
    if (!w) return;
    /* the frame is a 16/9 box, so width alone determines the fit; height is
       carried by aspect-ratio and never disagrees */
    stage.style.setProperty('--dk-k', (w / DESIGN_W).toFixed(5));
  }

  /* ---- navigation ----------------------------------------------------- */

  function slug(n) { return 'slide-' + (n + 1); }

  function show(n, opts) {
    opts = opts || {};
    n = Math.max(0, Math.min(slides.length - 1, n));
    if (n === i && !opts.force) return;
    slides[i].classList.remove('is-on');
    slides[i].setAttribute('aria-hidden', 'true');
    i = n;
    slides[i].classList.add('is-on');
    slides[i].setAttribute('aria-hidden', 'false');

    if (now)   now.textContent = String(i + 1).padStart(2, '0');
    if (label) label.textContent = slides[i].getAttribute('data-label') || '';
    if (prev)  prev.disabled = i === 0;
    if (next)  next.disabled = i === slides.length - 1;
    chapterState();

    /* announced rather than focus-moved: moving focus on every arrow press
       would fight the keyboard user who is holding the key down */
    if (live) live.textContent = 'Slide ' + (i + 1) + ' of ' + slides.length +
      (slides[i].getAttribute('data-label') ? ', ' + slides[i].getAttribute('data-label') : '');

    if (!opts.silent) {
      /* the forward button pulses until the reader moves the deck, by any
         means: the button, the arrows, a swipe or a chapter pill */
      deck.classList.add('is-used');
      if (history.replaceState) history.replaceState(null, '', '#' + slug(i));
    }
    /* below 900px the frame is a fixed-ratio card that scrolls its own content,
       so a new slide starts at its top rather than wherever the last one was
       left. A no-op on desktop, where the frame never scrolls. */
    if (frame) frame.scrollTop = 0;
  }

  function chapterState() {
    for (var c = 0; c < chaps.length; c++) {
      var at = parseInt(chaps[c].getAttribute('data-deck-chapter'), 10) - 1;
      var nextAt = c + 1 < chaps.length
        ? parseInt(chaps[c + 1].getAttribute('data-deck-chapter'), 10) - 1
        : slides.length;
      var on = i >= at && i < nextAt;
      chaps[c].classList.toggle('is-on', on);
      chaps[c].setAttribute('aria-current', on ? 'true' : 'false');
    }
  }

  function fromHash(silent) {
    var m = /^#slide-(\d+)$/.exec(location.hash || '');
    if (!m) return false;
    var n = parseInt(m[1], 10) - 1;
    if (isNaN(n) || n < 0 || n >= slides.length) return false;
    show(n, { silent: silent, force: true });
    return true;
  }

  /* ---- wiring --------------------------------------------------------- */

  if (total) total.textContent = String(slides.length).padStart(2, '0');
  if (prev) prev.addEventListener('click', function () { show(i - 1); });
  if (next) next.addEventListener('click', function () { show(i + 1); });

  chaps.forEach(function (btn) {
    btn.addEventListener('click', function () {
      show(parseInt(btn.getAttribute('data-deck-chapter'), 10) - 1);
    });
  });

  /* a click anywhere on the stage advances, the way the deck was authored to
     behave; a click on a link inside a slide must still follow the link */
  if (frame) frame.addEventListener('click', function (e) {
    if (innerWidth < MIN_DESKTOP) return;          /* mobile scrolls instead */
    if (e.target.closest('a[href], button')) return;
    show(i + 1);
  });

  /* Arrow keys work whenever the deck is on screen, which is what a reader
     expects, but never while they are typing or when the deck is out of view. */
  document.addEventListener('keydown', function (e) {
    if (e.metaKey || e.ctrlKey || e.altKey) return;
    var t = e.target;
    if (t && (t.isContentEditable || /^(input|textarea|select)$/i.test(t.tagName))) return;
    if (!inView()) return;
    var k = e.key;
    if (k === 'ArrowRight' || k === 'PageDown') { e.preventDefault(); show(i + 1); }
    else if (k === 'ArrowLeft' || k === 'PageUp') { e.preventDefault(); show(i - 1); }
    else if (k === 'Home') { e.preventDefault(); show(0); }
    else if (k === 'End') { e.preventDefault(); show(slides.length - 1); }
  });

  function inView() {
    if (!frame) return false;
    var r = frame.getBoundingClientRect();
    return r.bottom > 0 && r.top < innerHeight;
  }

  /* swipe, horizontal only, so a vertical scroll is never hijacked */
  var sx = 0, sy = 0, tracking = false;
  if (frame) {
    frame.addEventListener('touchstart', function (e) {
      if (e.touches.length !== 1) { tracking = false; return; }
      sx = e.touches[0].clientX; sy = e.touches[0].clientY; tracking = true;
    }, { passive: true });
    frame.addEventListener('touchend', function (e) {
      if (!tracking) return;
      tracking = false;
      var t = e.changedTouches[0];
      var dx = t.clientX - sx, dy = t.clientY - sy;
      if (Math.abs(dx) < 45 || Math.abs(dx) < Math.abs(dy) * 1.5) return;
      show(dx < 0 ? i + 1 : i - 1);
    }, { passive: true });
  }

  if (full && frame) {
    if (!frame.requestFullscreen) full.hidden = true;
    else full.addEventListener('click', function () {
      if (document.fullscreenElement) document.exitFullscreen();
      else frame.requestFullscreen().then(fit, function () {});
    });
    document.addEventListener('fullscreenchange', function () {
      deck.classList.toggle('is-full', !!document.fullscreenElement);
      fit();
    });
  }

  addEventListener('resize', fit);
  addEventListener('orientationchange', fit);
  addEventListener('hashchange', function () { fromHash(true); });
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(fit);

  fit();
  slides.forEach(function (s, n) { if (n) s.setAttribute('aria-hidden', 'true'); });
  if (!fromHash(true)) show(0, { silent: true, force: true });
})();
