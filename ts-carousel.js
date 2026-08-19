(function(){
  if(window.__tsCarousel) return; window.__tsCarousel = true;
  var RM = (window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches) || false;
  function metrics(track){
    var cards = track.querySelectorAll('[data-carousel-card]');
    var per = parseInt(track.getAttribute('data-carousel-perview')||'1',10) || 1;
    var maxsl = Math.max(0, track.scrollWidth - track.clientWidth);
    var pages = Math.max(1, Math.ceil(cards.length/per));
    var base = cards.length ? cards[0].offsetLeft : 0;
    var targets = [];
    for(var p=0;p<pages;p++){
      var card = cards[Math.min(p*per, cards.length-1)];
      targets.push(card ? Math.min(Math.max(card.offsetLeft - base, 0), maxsl) : 0);
    }
    return {per:per, maxsl:maxsl, pages:pages, targets:targets};
  }
  function goToPage(track, t){
    var m = metrics(track);
    t = Math.min(Math.max(t,0), m.pages-1);
    track.dataset.page = t;
    updateDots(track, t);
    var to = m.targets[t], from = track.scrollLeft;
    if(to === from) return;
    if(RM){ track.scrollLeft = to; return; }
    track._prog = Date.now()+9999;
    var pb = track.style.scrollBehavior, ps = track.style.scrollSnapType;
    track.style.scrollBehavior = 'auto'; track.style.scrollSnapType = 'none';
    if(track._raf) cancelAnimationFrame(track._raf);
    var start = null, dur = 420;
    function step(ts){
      if(start==null) start = ts;
      var p = Math.min((ts-start)/dur, 1), e = 1-Math.pow(1-p,3);
      track.scrollLeft = from + (to-from)*e;
      if(p<1){ track._raf = requestAnimationFrame(step); }
      else { track.scrollLeft = to; track.style.scrollBehavior = pb; track.style.scrollSnapType = ps; track._prog = 0; track._raf = 0; }
    }
    track._raf = requestAnimationFrame(step);
  }
  function activeIdx(track){
    var m = metrics(track), sl = track.scrollLeft, best=0, bd=1e9;
    for(var i=0;i<m.targets.length;i++){ var d=Math.abs(m.targets[i]-sl); if(d<bd){bd=d;best=i;} }
    return best;
  }
  function updateDots(track, forceIdx){
    var key = track.getAttribute('data-carousel-track-el');
    var idx = (forceIdx!=null) ? forceIdx : activeIdx(track);
    track.dataset.page = idx;
    var frac = document.querySelector("[data-carousel-frac='"+key+"']");
    if(frac){ frac.textContent = ('0'+(idx+1)).slice(-2); }
  }
  document.addEventListener('click', function(e){
    var nav = e.target.closest && e.target.closest('[data-carousel-nav]');
    if(nav){
      var track = document.querySelector(nav.getAttribute('data-carousel-track'));
      if(track){ var cur = track.dataset.page!=null ? parseInt(track.dataset.page,10) : activeIdx(track); goToPage(track, cur + (nav.getAttribute('data-carousel-nav')==='next'?1:-1)); }
      return;
    }
  });
  document.addEventListener('scroll', function(e){
    var t = e.target;
    if(t && t.getAttribute && t.getAttribute('data-carousel-track-el')){ if(t._prog && Date.now() < t._prog) return; updateDots(t); }
  }, true);
})();
