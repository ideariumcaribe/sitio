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
