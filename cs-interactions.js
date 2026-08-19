(function(){
 if(window.__csInit) return; window.__csInit=true;
 var EASE="cubic-bezier(.4,0,.2,1)";
 var RM=(window.matchMedia&&matchMedia("(prefers-reduced-motion: reduce)").matches)||false;
 function vh(){ return window.innerHeight||800; }
 function inView(el){ var r=el.getBoundingClientRect(); if(!r.width && !r.height) return false; return r.top < vh()*0.85 && r.bottom > vh()*0.12; }

 /* ---------- tree-test donuts + bars (data-arc / data-bar) ---------- */
 function seedTT(p){
  if(RM){ p.querySelectorAll("[data-arc]").forEach(function(c){ c.style.strokeDashoffset=c.dataset.off; }); p.querySelectorAll("[data-bar]").forEach(function(b){ b.style.width=b.dataset.w; }); p.querySelectorAll("[data-bar-v]").forEach(function(b){ b.style.height=b.dataset.h; }); return; }
  p.querySelectorAll("[data-arc]").forEach(function(c){ c.style.strokeDashoffset=c.dataset.c; });
  p.querySelectorAll("[data-bar]").forEach(function(b){ b.style.width="0%"; });
  p.querySelectorAll("[data-bar-v]").forEach(function(b){ b.style.height="0%"; });
 }
 function playTT(p){
  if(p.__ttPlayed) return; p.__ttPlayed=true;
  if(RM){ p.querySelectorAll("[data-arc]").forEach(function(c){ c.style.strokeDashoffset=c.dataset.off; }); p.querySelectorAll("[data-bar]").forEach(function(b){ b.style.width=b.dataset.w; }); p.querySelectorAll("[data-bar-v]").forEach(function(b){ b.style.height=b.dataset.h; }); return; }
  p.querySelectorAll("[data-arc]").forEach(function(c){ c.style.strokeDashoffset=c.dataset.off; c.animate([{strokeDashoffset:+c.dataset.c},{strokeDashoffset:+c.dataset.off}],{duration:1700,delay:(+c.dataset.delay||0)*1.4,easing:EASE,fill:"both"}); });
  p.querySelectorAll("[data-bar]").forEach(function(b){ b.style.width=b.dataset.w; b.animate([{width:"0%"},{width:b.dataset.w}],{duration:1150,delay:(+b.dataset.delay||0),easing:EASE,fill:"both"}); });
  p.querySelectorAll("[data-bar-v]").forEach(function(b){ b.style.height=b.dataset.h; b.animate([{height:"0%"},{height:b.dataset.h}],{duration:1150,delay:(+b.dataset.delay||0),easing:EASE,fill:"both"}); });
 }
 var ttIO=new IntersectionObserver(function(es){ es.forEach(function(e){ if(e.isIntersecting) playTT(e.target); }); },{threshold:0.2});

 /* ---------- image reveal (data-reveal) — same timing as tree test ---------- */
 function fromR(img){ return img.dataset.reveal==="down" ? "inset(0 0 100% 0)" : "inset(0 100% 0 0)"; }
 function playR(img){ if(img.__played) return; img.__played=true; if(RM){ img.style.transition="none"; img.style.clipPath="inset(0 0 0 0)"; return; } var f=fromR(img); img.style.transition="none"; img.style.clipPath=f; void img.offsetWidth; img.style.transition="clip-path 1700ms cubic-bezier(.4,0,.2,1)"; requestAnimationFrame(function(){ requestAnimationFrame(function(){ img.style.clipPath="inset(0 0 0 0)"; }); }); }
 var rIO=new IntersectionObserver(function(es){ es.forEach(function(e){ if(e.isIntersecting) e.target.querySelectorAll("img[data-reveal]").forEach(playR); }); },{threshold:0.2});

 /* ---------- (re)scan: seed + observe + play-if-already-in-view; idempotent ---------- */
 function rescan(){
  document.querySelectorAll("[data-panelgroup]").forEach(function(p){
   if(!p.querySelector("[data-arc],[data-bar],[data-bar-v]")) return;
   if(!p.__ttSeeded){ p.__ttSeeded=true; seedTT(p); ttIO.observe(p); }
   if(!p.__ttPlayed && getComputedStyle(p).display!=="none" && inView(p)) playTT(p);
  });
  var seen=[];
  document.querySelectorAll("img[data-reveal]").forEach(function(img){
   if(!img.__revInit){ img.__revInit=true; img.style.clipPath=fromR(img); }
   var p=img.closest("[data-panelgroup]")||img.parentElement;
   if(p && seen.indexOf(p)<0){ seen.push(p); if(!p.__revObs){ p.__revObs=true; rIO.observe(p); } }
   if(!img.__played){ var host=img.closest("[data-panelgroup]"); var hid=host && getComputedStyle(host).display==="none"; if(!hid && inView(img)) playR(img); }
  });
  twScan();
  ttCheck();
 }
 window.__csRescan=rescan;

 /* ---------- frame wipe (data-tilewipe on the overflow:hidden wrapper) ---------- */
 function twOne(el){
  if(el.__twPlayed) return;
  el.__twPlayed=true;
  if(RM){ el.style.transition="none"; el.style.clipPath="inset(0 0 0 0)"; return; }
  var i=parseFloat(el.dataset.twI)||0, d=parseFloat(el.dataset.twD)||1700;
  el.style.transition="clip-path "+d+"ms cubic-bezier(.4,0,.2,1) "+(i*150)+"ms";
  el.style.clipPath="inset(0 0 0 0)";
 }
 function twPlay(el){
  var p=el.parentElement;
  if(p) p.querySelectorAll(":scope > [data-tilewipe]").forEach(twOne);
  twOne(el);
 }
 function twCheck(){
  var left=false;
  document.querySelectorAll("[data-tilewipe]").forEach(function(el){
   if(el.__twPlayed) return;
   var r=el.getBoundingClientRect();
   if(r.top<innerHeight*0.9 && r.bottom>0) twPlay(el); else left=true;
  });
  return left;
 }
 var twIO=new IntersectionObserver(function(es){ es.forEach(function(e){ if(e.isIntersecting) twPlay(e.target); }); },{threshold:0});
 var twPolling=false, twN=0;
 function twLoop(){
  var left=twCheck();
  if(left && twN++ < 3600) requestAnimationFrame(twLoop); else twPolling=false;
 }
 function twScan(){
  var els=document.querySelectorAll("[data-tilewipe]");
  if(!els.length) return;
  els.forEach(function(el){
   if(!el.__twInit){ el.__twInit=true; el.style.clipPath=RM?"inset(0 0 0 0)":"inset(0 0 100% 0)"; }
   if(!el.__twObs){ el.__twObs=true; twIO.observe(el); }
  });
  if(!twBound){ twBound=true; ["scroll","resize","wheel","pointermove","pointerup","keyup"].forEach(function(t){ addEventListener(t,function(){ twCheck(); if(!twPolling){ twPolling=true; twN=0; requestAnimationFrame(twLoop); } },{passive:true}); }); }
  if(!twPolling){ twPolling=true; twN=0; requestAnimationFrame(twLoop); }
 }
 var twBound=false;

 /* ---------- scroll-position fallback for chart groups (IO can miss half-clipped/panned boards) ---------- */
 function ttCheck(){
  document.querySelectorAll("[data-panelgroup]").forEach(function(p){
   if(p.__ttPlayed) return;
   if(!p.querySelector("[data-arc],[data-bar],[data-bar-v]")) return;
   var r=p.getBoundingClientRect();
   if(!r.width && !r.height) return;
   if(r.top < innerHeight*0.9 && r.bottom > 0) playTT(p);
  });
 }
 addEventListener("scroll", ttCheck, {passive:true});
 addEventListener("resize", ttCheck, {passive:true});
 addEventListener("wheel", ttCheck, {passive:true});
 addEventListener("pointerup", ttCheck, {passive:true});

 /* ---------- tabs (data-tabgroup) + replay on switch ---------- */
 document.addEventListener("click",function(e){
  var b=e.target.closest && e.target.closest("[data-tabgroup]"); if(!b) return;
  var g=b.getAttribute("data-tabgroup"), v=b.getAttribute("data-view");
  document.querySelectorAll('[data-tabgroup="'+g+'"]').forEach(function(btn){ btn.setAttribute("style", btn.getAttribute("data-view")===v ? btn.getAttribute("data-on") : btn.getAttribute("data-off")); });
  document.querySelectorAll('[data-panelgroup="'+g+'"]').forEach(function(p){ p.style.display = p.getAttribute("data-view")===v ? (p.getAttribute("data-disp")||"") : "none"; });
  setTimeout(function(){
   var p=document.querySelector('[data-panelgroup="'+g+'"][data-view="'+v+'"]'); if(!p) return;
   if(p.querySelector("[data-arc],[data-bar],[data-bar-v]")){ p.__ttPlayed=false; playTT(p); }
   p.querySelectorAll("img[data-reveal]").forEach(function(img){ img.__played=false; playR(img); });
  },50);
 });

 /* ---------- wireframe scroll reveal (data-wf) ---------- */
 (function(){
  function clamp(v,a,b){return v<a?a:(v>b?b:v);}
  function smooth(t){return t*t*(3-2*t);}
  var goingUp=false;
  function prog(el){ var r=el.getBoundingClientRect(), h=vh(); var c=r.top+r.height/2; var startpos=h*(goingUp?0.60:0.70), endpos=h*0.48; return clamp((startpos-c)/(startpos-endpos),0,1); }
  function apply(el){ var p=RM?1:smooth(prog(el)); el.style.setProperty("--pos",(p*100).toFixed(2)+"%"); el.style.setProperty("--p",p.toFixed(3)); }
  function applyAll(){ var els=document.querySelectorAll('[data-wf="reveal"]'); for(var i=0;i<els.length;i++) apply(els[i]); }
  window.addEventListener("scroll", applyAll, true);
  window.addEventListener("resize", applyAll, true);
  var lastY=window.pageYOffset||0;
  function tick(){ var y=window.pageYOffset||0; if(y<lastY-0.5)goingUp=true; else if(y>lastY+0.5)goingUp=false; lastY=y; applyAll(); requestAnimationFrame(tick); }
  requestAnimationFrame(tick); applyAll();
 })();

 /* ---------- boot + stay alive across DC re-renders ---------- */
 var raf=0;
 function schedule(){ if(raf) return; raf=requestAnimationFrame(function(){ raf=0; rescan(); }); }
 function start(){
  rescan();
  try{ new MutationObserver(schedule).observe(document.body,{childList:true,subtree:true}); }catch(e){}
  window.addEventListener('scroll', schedule, true);
  window.addEventListener('resize', schedule, true);
 }
 if(document.readyState!=="loading") start(); else document.addEventListener("DOMContentLoaded",start);
})();
