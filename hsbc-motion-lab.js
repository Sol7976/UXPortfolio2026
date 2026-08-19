// HSBC 04 collage · scroll motion lab. Five modes, all scrubbed by scroll position
// (reversible both directions), smoothed with a light lerp for an inertial, sleek feel.
(function(){
  if(window.__hsbcMotionLab) return;
  var units=[], reduced=window.matchMedia&&matchMedia('(prefers-reduced-motion: reduce)').matches;
  function clamp(t){return t<0?0:t>1?1:t}
  function ease(t){t=clamp(t);return t*t*(3-2*t)}
  function prog(p,s,w){return clamp((p-s)/w)}
  function scan(){
    units=[];
    document.querySelectorAll('[data-motion]').forEach(function(frame){
      var inner=frame.firstElementChild; if(!inner) return;
      var cols=[].slice.call(inner.children).map(function(col,ci){
        return {el:col, ci:ci, depth:parseFloat(col.getAttribute('data-depth'))||0,
          cells:[].slice.call(col.children).map(function(cell,ri){
            return {el:cell, img:cell.querySelector('img'), ri:ri};
          })};
      });
      cols.forEach(function(c){c.el.style.willChange='transform,opacity';
        c.cells.forEach(function(cl){cl.el.style.willChange='transform';
          if(cl.img)cl.img.style.willChange='transform,clip-path'})});
      units.push({el:frame, mode:frame.getAttribute('data-motion'), cols:cols, sp:-1, last:-1});
    });
  }
  function apply(u,p){
    var n=u.cols.length;
    if(u.mode==='rise'){
      u.cols.forEach(function(c,i){
        var d=i/Math.max(1,n-1);
        var vi=ease(prog(p,.03+d*.10,.24)), vo=ease(prog(1-p,.02+d*.05,.20));
        c.el.style.transform='translate3d(0,'+(((1-vi)-(1-vo))*48).toFixed(2)+'px,0)';
        c.el.style.opacity=Math.min(vi,vo).toFixed(3);
      });
    } else if(u.mode==='parallax'){
      var h=u.el.offsetHeight;
      u.cols.forEach(function(c){
        c.el.style.transform='translate3d(0,'+((0.5-p)*c.depth*h).toFixed(2)+'px,0)';
      });
    } else if(u.mode==='wipe'){
      u.cols.forEach(function(c){
        c.cells.forEach(function(cl){
          if(!cl.img) return;
          var d=(cl.ri+c.ci*.55)/3.65;
          var vi=ease(prog(p,.04+d*.15,.22)), vo=ease(prog(1-p,.03+d*.07,.18)), v=Math.min(vi,vo);
          cl.img.style.clipPath='inset(0 0 '+((1-v)*100).toFixed(2)+'% 0)';
        });
      });
    } else if(u.mode==='wipefade'){
      u.cols.forEach(function(c){
        c.cells.forEach(function(cl){
          if(!cl.img) return;
          var d=(cl.ri+c.ci*.55)/3.65;
          var vi=ease(prog(p,.04+d*.15,.22)), vo=ease(prog(1-p,.03+d*.07,.18)), v=Math.min(vi,vo);
          cl.img.style.clipPath='inset(0 0 '+((1-v)*100).toFixed(2)+'% 0)';
          cl.img.style.opacity=v.toFixed(3);
        });
      });
    } else if(u.mode==='wipesoft'){
      u.cols.forEach(function(c){
        c.cells.forEach(function(cl){
          if(!cl.img) return;
          var d=(cl.ri+c.ci*.55)/3.65;
          var vi=ease(prog(p,.04+d*.15,.25)), vo=ease(prog(1-p,.03+d*.08,.21)), v=Math.min(vi,vo);
          var top=Math.max(0,v*100-24), bot=Math.min(100,v*100+3);
          var g='linear-gradient(to bottom, #000 '+top.toFixed(1)+'%, transparent '+bot.toFixed(1)+'%)';
          cl.img.style.maskImage=g; cl.img.style.webkitMaskImage=g;
          cl.img.style.opacity=(0.18+v*0.82).toFixed(3);
        });
      });
    } else if(u.mode==='wipescale'){
      u.cols.forEach(function(c){
        c.cells.forEach(function(cl){
          if(!cl.img) return;
          var d=(cl.ri+c.ci*.55)/3.65;
          var vi=ease(prog(p,.04+d*.15,.22)), vo=ease(prog(1-p,.03+d*.07,.18)), v=Math.min(vi,vo);
          cl.img.style.clipPath='inset(0 0 '+((1-v)*100).toFixed(2)+'% 0)';
          cl.img.style.opacity=v.toFixed(3);
          cl.img.style.transform='scale('+(1.07-v*0.07).toFixed(4)+')';
        });
      });
    } else if(u.mode==='depth'){
      u.cols.forEach(function(c,i){
        var vi=ease(prog(p,.05+i*.045,.28)), vo=ease(prog(1-p,.03,.22)), v=Math.min(vi,vo);
        c.cells.forEach(function(cl){
          cl.el.style.transform='scale('+(0.958+v*0.042).toFixed(4)+')';
          if(cl.img)cl.img.style.transform='scale('+(1+(1-v)*0.14).toFixed(4)+')';
        });
      });
    } else if(u.mode==='pan'){
      u.cols.forEach(function(c){
        c.cells.forEach(function(cl){
          if(!cl.img) return;
          var d=(cl.ri*.55+c.ci*.28)/1.94;
          var vi=ease(prog(p,.04+d*.14,.24)), vo=ease(prog(1-p,.03+d*.06,.18)), v=Math.min(vi,vo);
          var dir=((cl.ri+c.ci)%2?1:-1);
          cl.img.style.transform='translate3d(0,'+(dir*(1-v)*6).toFixed(3)+'%,0) scale('+(1+(1-v)*0.16).toFixed(4)+')';
        });
      });
    }
  }
  function loop(){
    var vh=innerHeight;
    units.forEach(function(u){
      var r=u.el.getBoundingClientRect();
      var p=clamp((vh-r.top)/(vh+r.height));
      if(u.sp<0)u.sp=p;
      u.sp+=(p-u.sp)*0.18;
      if(Math.abs(p-u.sp)<0.0005)u.sp=p;
      if(u.last===u.sp)return;
      u.last=u.sp;
      apply(u,u.sp);
    });
    requestAnimationFrame(loop);
  }
  window.__hsbcMotionLab=function(){scan()};
  if(reduced){window.__hsbcMotionLab=function(){};return}
  scan();
  requestAnimationFrame(loop);
})();
