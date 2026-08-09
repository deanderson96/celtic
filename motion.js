(function(){
'use strict';
const reduced=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const revealSelector='.club-overview,.metric-grid,.preview-panel,.side-stack,.fixtures-panel,.transfer-panel,.table-panel,.europe-summary-panel,.europe-fixtures-panel,.europe-metrics';
const itemSelector='.result-row,.news-item,.data-table tbody tr,.europe-match';
const DATA_REFRESH_MS=60*60*1000;
let lastDataRefresh=Date.now();

function refreshVisibleData(){
  if(document.visibilityState!=='visible'||Date.now()-lastDataRefresh<DATA_REFRESH_MS)return;
  lastDataRefresh=Date.now();
  const refreshButton=document.getElementById('refresh');
  if(refreshButton&&!refreshButton.disabled)refreshButton.click();
  else location.reload();
}
setInterval(refreshVisibleData,DATA_REFRESH_MS);
document.addEventListener('visibilitychange',refreshVisibleData);

function setScrollState(){document.body.classList.toggle('motion-scrolled',window.scrollY>18)}
setScrollState();
window.addEventListener('scroll',setScrollState,{passive:true});

if(!reduced && 'IntersectionObserver' in window){
  const observer=new IntersectionObserver(entries=>{
    for(const entry of entries){
      if(!entry.isIntersecting)continue;
      entry.target.classList.add('is-visible');
      observer.unobserve(entry.target);
    }
  },{threshold:.08,rootMargin:'0px 0px -5% 0px'});

  function observeReveals(root=document){
    root.querySelectorAll?.(revealSelector).forEach((el,index)=>{
      if(el.classList.contains('motion-reveal'))return;
      el.classList.add('motion-reveal');
      el.style.setProperty('--motion-delay',`${Math.min(index%4,3)*65}ms`);
      observer.observe(el);
    });
  }

  function animateItems(root=document){
    root.querySelectorAll?.(itemSelector).forEach((el,index)=>{
      if(el.classList.contains('motion-item'))return;
      el.classList.add('motion-item');
      el.style.setProperty('--motion-delay',`${Math.min(index,8)*38}ms`);
      requestAnimationFrame(()=>requestAnimationFrame(()=>el.classList.add('is-visible')));
    });
  }

  observeReveals();
  animateItems();

  const mutations=new MutationObserver(records=>{
    for(const record of records){
      for(const node of record.addedNodes){
        if(!(node instanceof Element))continue;
        if(node.matches(itemSelector))animateItems(node.parentElement||document);
        else animateItems(node);
      }
    }
  });
  mutations.observe(document.body,{childList:true,subtree:true});
}else{
  document.querySelectorAll(revealSelector).forEach(el=>el.classList.add('motion-reveal','is-visible'));
}

if(!reduced){
  document.addEventListener('click',event=>{
    const link=event.target.closest('a[href]');
    if(!link||event.defaultPrevented||event.button!==0||event.metaKey||event.ctrlKey||event.shiftKey||event.altKey)return;
    if(link.target==='_blank'||link.hasAttribute('download'))return;
    const url=new URL(link.href,location.href);
    if(url.origin!==location.origin)return;
    if(url.pathname===location.pathname&&url.search===location.search&&url.hash)return;
    event.preventDefault();
    document.body.classList.add('motion-leaving');
    window.setTimeout(()=>{location.href=url.href},470);
  });
}
})();
