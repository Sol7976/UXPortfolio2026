/* Sequential multi-segment doughnut for the Laced customer support studies.
   Self-contained: seeds, observes and replays independently of any DC lifecycle.
   Hooks: circle[data-pie] / circle[data-pie-m] with data-c (circumference) + data-off. */
(function () {
  if (window.__lcsPie) return;
  var SEL = '[data-pie],[data-pie-m]';
  var reduce = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;

  function hosts() {
    var set = [];
    document.querySelectorAll(SEL).forEach(function (c) {
      var h = c.closest('svg');
      if (h && set.indexOf(h) === -1) set.push(h);
    });
    return set;
  }

  function seed(h) {
    h.querySelectorAll(SEL).forEach(function (c) {
      if (c.__pieSeeded) return;
      c.__pieSeeded = true;
      c.style.strokeDashoffset = reduce ? c.dataset.off : c.dataset.c;
    });
    if (reduce) h.__pieDone = true;
  }

  function play(h) {
    if (h.__pieDone) return;
    var r = h.getBoundingClientRect();
    if (!r.width && !r.height) return;
    if (!(r.top < innerHeight * 0.9 && r.bottom > 0)) return;
    h.__pieDone = true;
    var t = 0;
    h.querySelectorAll(SEL).forEach(function (c) {
      var C = +c.dataset.c, off = +c.dataset.off;
      var dur = Math.max(170, Math.round(1700 * ((C - off) / C)));
      c.style.strokeDashoffset = off;
      c.animate([{ strokeDashoffset: C }, { strokeDashoffset: off }],
        { duration: dur, delay: t, easing: 'linear', fill: 'both' });
      t += dur;
    });
  }

  function scan() {
    hosts().forEach(function (h) {
      seed(h);
      if (!h.__pieObs && window.IntersectionObserver) {
        h.__pieObs = new IntersectionObserver(function (es) {
          if (es.some(function (e) { return e.isIntersecting; })) play(h);
        }, { threshold: 0.15 });
        h.__pieObs.observe(h);
      }
      play(h);
    });
  }

  function replay(root) {
    (root || document).querySelectorAll(SEL).forEach(function (c) {
      var h = c.closest('svg');
      if (h) h.__pieDone = false;
      c.style.strokeDashoffset = reduce ? c.dataset.off : c.dataset.c;
    });
    if (!reduce) setTimeout(scan, 40);
  }

  window.__lcsPie = scan;
  window.__lcsPieReplay = replay;

  addEventListener('scroll', scan, { passive: true });
  document.addEventListener('scroll', scan, { passive: true, capture: true });
  addEventListener('resize', scan, { passive: true });
  addEventListener('wheel', scan, { passive: true });
  document.addEventListener('click', function (e) {
    var b = e.target.closest && e.target.closest('[data-tabgroup="lcs-src"],[data-tabgroup="lcs-src-m"]');
    if (!b) return;
    replay(b.closest('.sc-host') || document);
  }, true);

  function boot() { scan(); requestAnimationFrame(scan); setTimeout(scan, 400); }
  if (document.readyState !== 'loading') boot();
  else addEventListener('DOMContentLoaded', boot);
  setInterval(scan, 500);
})();
