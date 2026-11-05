(function(){
  var body=document.body;
  function setLang(l){
    body.setAttribute('data-lang',l);
    document.documentElement.setAttribute('lang',l);
    document.querySelectorAll('.langs button').forEach(function(b){b.setAttribute('aria-pressed',String(b.dataset.lang===l));});
    try{localStorage.setItem('ic-lang',l);}catch(e){}
  }
  var saved=null; try{saved=localStorage.getItem('ic-lang');}catch(e){}
  setLang(saved==='en'?'en':'es');
  document.querySelectorAll('.langs button').forEach(function(b){b.addEventListener('click',function(){setLang(b.dataset.lang);});});
  var btn=document.getElementById('copy-email'), st=document.getElementById('copy-status'), em=document.getElementById('email');
  btn.addEventListener('click',function(){
    var en=body.getAttribute('data-lang')==='en';
    var ok=function(){st.textContent=en?'Copied':'Copiado';};
    var fallback=function(){var r=document.createRange();r.selectNodeContents(em);var s=window.getSelection();s.removeAllRanges();s.addRange(r);st.textContent=en?'Selected':'Seleccionado';};
    try{navigator.clipboard.writeText(em.textContent).then(ok,fallback);}catch(e){fallback();}
  });
})();

// Portadas del Internet Archive: si una miniatura no carga, prueba otras dos direcciones del mismo libro.
(function(){
  var alt=function(id){return ['https://archive.org/download/'+id+'/__ia_thumb.jpg','https://archive.org/download/'+id+'/page/n0_w300.jpg'];};
  var fix=function(img){
    var id=img.getAttribute('data-ia'); if(!id) return;
    var n=+(img.getAttribute('data-intento')||0), urls=alt(id);
    if(n<urls.length){img.setAttribute('data-intento',n+1); img.src=urls[n];}
  };
  document.querySelectorAll('img[data-ia]').forEach(function(img){
    img.addEventListener('error',function(){fix(img);});
    if(img.complete && img.naturalWidth===0 && img.getAttribute('src')) fix(img);
  });
})();

// Copiar al portapapeles (botones con data-copiar, p. ej. «Copiar enlace»).
(function(){
  document.querySelectorAll('[data-copiar]').forEach(function(b){
    b.addEventListener('click',function(){
      var en=document.body.getAttribute('data-lang')==='en', o=b.innerHTML;
      var ok=function(){b.textContent=en?'Copied':'Copiado'; setTimeout(function(){b.innerHTML=o;},1600);};
      var viejo=function(){var i=document.createElement('input');i.value=b.getAttribute('data-copiar');document.body.appendChild(i);i.select();try{document.execCommand('copy');ok();}catch(e){}i.remove();};
      try{navigator.clipboard.writeText(b.getAttribute('data-copiar')).then(ok,viejo);}catch(e){viejo();}
    });
  });
})();

// Vistos recientemente (página de la Biblioteca): lee la lista que guarda cada obra en este navegador.
(function(){
  var cont=document.getElementById('vistos'), ul=document.getElementById('vistos-lista'); if(!cont||!ul) return;
  var lista=[]; try{lista=JSON.parse(localStorage.getItem('ic-vistos')||'[]');}catch(e){}
  if(!lista.length) return;
  lista.slice(0,6).forEach(function(x){
    var li=document.createElement('li'), a=document.createElement('a'), im=document.createElement('img'), t=document.createElement('span'), s=document.createElement('span');
    a.href='/biblioteca/obras/'+encodeURIComponent(x.id)+'/'; im.src='https://archive.org/services/img/'+encodeURIComponent(x.id); im.alt=''; im.loading='lazy'; im.width=180; im.height=240;
    t.className='t'; t.textContent=x.t; s.className='s'; s.textContent=x.s; a.appendChild(im); a.appendChild(t); a.appendChild(s); li.appendChild(a); ul.appendChild(li);
  });
  cont.hidden=false;
  var b=document.getElementById('vistos-borrar'); if(b) b.addEventListener('click',function(){try{localStorage.removeItem('ic-vistos');}catch(e){} cont.hidden=true;});
})();

// Volver arriba: aparece al bajar más de dos pantallas.
(function(){
  var a=document.getElementById('arriba'); if(!a) return; var vis=false;
  var ver=function(){var v=window.scrollY>window.innerHeight*2; if(v!==vis){vis=v; a.hidden=!v;}};
  window.addEventListener('scroll',ver,{passive:true}); ver();
  a.addEventListener('click',function(e){e.preventDefault(); window.scrollTo({top:0,behavior:(window.matchMedia&&matchMedia('(prefers-reduced-motion: reduce)').matches)?'auto':'smooth'}); var h=document.querySelector('main h1'); if(h){h.setAttribute('tabindex','-1'); h.focus({preventScroll:true});}});
})();

// Formulario de suscripción de Substack: se carga cuando el lector se acerca a él (no en la carga inicial de la página).
(function(){
  var f=document.querySelectorAll('iframe[data-src]'); if(!f.length) return;
  var cargar=function(el){ if(!el.getAttribute('src')) el.setAttribute('src', el.getAttribute('data-src')); };
  if(!('IntersectionObserver' in window)){ window.addEventListener('load',function(){ f.forEach(cargar); }); return; }
  var io=new IntersectionObserver(function(es){ es.forEach(function(e){ if(e.isIntersecting){ cargar(e.target); io.unobserve(e.target); } }); },{rootMargin:'900px 0px'});
  var empezar=function(){ f.forEach(function(el){ io.observe(el); }); };
  if(document.readyState==='complete') empezar(); else window.addEventListener('load',empezar);
})();
