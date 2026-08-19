/* Mobile menu open state (Nav Options.dc.html, option 2g).
   Shared by the homepage and all five case studies. Plain IIFE, no dependencies.

   The panel is a full-screen dialog that lives as a direct child of <body>,
   outside .viewport, deliberately: at 900-1199px .page carries a transform,
   which would make it the containing block for a position:fixed descendant and
   trap the panel inside the scaled layout. Outside .viewport it is always fixed
   to the actual viewport. It is display:none above 900px in CSS, so nothing here
   needs to care about the breakpoint except the resize guard below.

   Closed state is the `hidden` attribute, which takes it out of the tab order and
   the accessibility tree outright rather than relying on visibility alone. The
   fade is a class applied on the next frame, since an element going from
   display:none cannot transition in the same frame it becomes visible. */
(function () {
  var MQ = '(max-width: 899px)';
  var panel = document.getElementById('nav-menu');
  var toggle = document.querySelector('[data-nav-toggle]');
  if (!panel || !toggle) return;

  var closeBtn = panel.querySelector('[data-nav-close]');
  var reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  /* State is this flag, never the `hidden` attribute: hidden is only set when the
     fade-out finishes, so reading it would report the panel as still open for
     180ms after a close and turn a quick second tap into another close. */
  var opened = false;
  var hideTimer = null;

  function focusable() {
    return [].slice.call(panel.querySelectorAll('a[href],button:not([disabled])'))
      .filter(function (el) { return el.offsetParent !== null; });
  }

  function open() {
    if (opened) return;
    opened = true;
    if (hideTimer) { clearTimeout(hideTimer); hideTimer = null; }
    panel.hidden = false;
    /* the scrollbar is gone with the body locked, so the page must not shift:
       nothing to compensate on a phone, where the scrollbar is an overlay */
    document.documentElement.style.overflow = 'hidden';
    document.body.style.overflow = 'hidden';
    toggle.setAttribute('aria-expanded', 'true');
    if (reduce) panel.classList.add('is-open');
    else requestAnimationFrame(function () { panel.classList.add('is-open'); });
    (closeBtn || panel).focus();
  }

  function close() {
    if (!opened) return;
    opened = false;
    panel.classList.remove('is-open');
    toggle.setAttribute('aria-expanded', 'false');
    document.documentElement.style.overflow = '';
    document.body.style.overflow = '';
    var done = function () { panel.hidden = true; hideTimer = null; };
    if (reduce) done();
    else hideTimer = setTimeout(done, 180);   /* the .18s house transition */
    /* always back to the burger: it is the control that owns the panel, and the
       element focused before opening may not be focusable (body, after a tap) */
    toggle.focus();
  }

  toggle.addEventListener('click', function () { opened ? close() : open(); });
  if (closeBtn) closeBtn.addEventListener('click', close);

  /* a link that leaves the page does not need this, but #work is an in-page
     anchor and would otherwise scroll behind a panel that never closed */
  panel.addEventListener('click', function (e) {
    if (e.target.closest('a[href]')) close();
  });

  document.addEventListener('keydown', function (e) {
    if (!opened) return;
    if (e.key === 'Escape') { e.preventDefault(); close(); return; }
    if (e.key !== 'Tab') return;
    /* keep Tab inside the panel while it is modal */
    var items = focusable();
    if (!items.length) return;
    var first = items[0], last = items[items.length - 1];
    if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
  });

  /* crossing to the desktop design hides the panel in CSS; close it properly so
     the burger's aria-expanded and the body scroll lock do not survive the change */
  addEventListener('resize', function () {
    if (opened && !matchMedia(MQ).matches) close();
  }, { passive: true });
})();


/* Hide-on-scroll-down, show-on-scroll-up nav. Mobile only: the case studies run
   to eight or nine screens, and without this the only way back to the menu is a
   scroll to the very top.

   position:sticky rather than fixed, deliberately. .viewport uses overflow:clip,
   which does not create a scroll container, so sticky behaves normally inside it;
   overflow:hidden would have, and would have pinned the nav to the top of the
   clipped box instead. Fixed would also have risked being clipped by it.

   Runs as its own IIFE so the menu code's early return above cannot skip it. */
(function () {
  var MQ = matchMedia('(max-width: 899px)');
  var nav = document.querySelector('.nav');
  if (!nav) return;

  var last = 0, ticking = false;
  var REVEAL_AT = 120;   /* never hide inside the first screenful */
  var DELTA = 6;         /* ignore jitter and rubber-band wobble */

  function update() {
    ticking = false;
    if (!MQ.matches) { nav.classList.remove('nav--up'); return; }
    var y = scrollY < 0 ? 0 : scrollY;          /* iOS overscrolls past zero */
    if (Math.abs(y - last) < DELTA) return;     /* no update to last: a slow
                                                   scroll accumulates instead */
    if (y > last && y > REVEAL_AT) nav.classList.add('nav--up');
    else nav.classList.remove('nav--up');
    last = y;
  }

  addEventListener('scroll', function () {
    if (!ticking) { ticking = true; requestAnimationFrame(update); }
  }, { passive: true });
})();
