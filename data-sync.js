(function(){
'use strict';
const SNAPSHOT_POLL=5*60*1000;
let snapshotStamp='',live=null,reapplying=false;
const clean=v=>String(v??'').replace(/\s+/g,' ').trim();
const norm=v=>clean(v).normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]/g,'');
const sameMatch=(text,e)=>{const n=norm(text);return n.includes(norm(e.strHomeTeam))&&n.includes(norm(e.strAwayTeam))};
const londonNow=()=>new Intl.DateTimeFormat('en-GB',{timeZone:'Europe/London',hour:'2-digit',minute:'2-digit',timeZoneName:'short'}).format(new Date());
function setText(el,value){if(el&&el.textContent!==String(value))el.textContent=String(value)}
function patchFixtureTable(root,event,detail){if(!root)return;for(const row of root.querySelectorAll('tr')){if(!sameMatch(row.textContent,event))continue;setText(row.querySelector('.score'),`${event.intHomeScore??'–'}–${event.intAwayScore??'–'}`);const chip=row.querySelector('.status-chip');if(chip){chip.classList.remove('upcoming','complete');chip.classList.add(detail.isFinal?'complete':'upcoming');setText(chip,detail.isFinal?'FT':event.statusLabel||'LIVE')}}}
function patchHome(detail){const e=detail.event;if(detail.isLive){setText(document.getElementById('next-summary'),`LIVE · ${e.strHomeTeam} ${e.intHomeScore??'–'}–${e.intAwayScore??'–'} ${e.strAwayTeam}`);setText(document.getElementById('next-date-summary'),e.statusLabel||'Live');const fresh=document.getElementById('freshness-summary');setText(fresh,'Live');setText(document.getElementById('updated'),`Live checked ${londonNow()}`)}
 patchFixtureTable(document.getElementById('fixtures-grid'),e,detail);
 const preview=document.querySelector('#preview-content .preview');if(preview&&sameMatch(preview.textContent,e)){setText(preview.querySelector('.preview-vs'),`${e.intHomeScore??'–'}–${e.intAwayScore??'–'}`);setText(preview.querySelector('.preview-top strong'),detail.isFinal?'Full time':e.statusLabel||'Live');const h=document.querySelector('#preview .panel-heading h2');setText(h,detail.isFinal?'Latest match':'Current match context');const badge=document.querySelector('#preview .panel-badge');if(badge)setText(badge,detail.isFinal?'FT':`LIVE · ${detail.source}`)}
 const note=document.getElementById('live-table-note');if(note)note.remove();if(/premiership|premier league|spfl/i.test(e.strLeague||'')){const heading=document.querySelector('#table .panel-heading>div');if(heading){const p=document.createElement('p');p.id='live-table-note';p.className='panel-note';p.textContent=detail.isFinal?'Official standings will update when the league table source publishes the result.':'Official standings do not include the in-progress match.';heading.appendChild(p)}}
 if(detail.isFinal)addFinalResult(e)}
function addFinalResult(e){const grid=document.getElementById('results-grid');if(!grid||sameMatch(grid.textContent,e))return;const a=document.createElement('article');a.className='result-row';a.dataset.liveFinal='1';a.innerHTML=`<div class="result-date">Today</div><div class="result-fixture"><strong>${escapeHtml(e.strHomeTeam)} v ${escapeHtml(e.strAwayTeam)}</strong><span>${escapeHtml(e.strLeague||'Competition')}</span></div><div class="result-score">${escapeHtml(e.intHomeScore)}–${escapeHtml(e.intAwayScore)}</div>`;grid.prepend(a);while(grid.children.length>5)grid.lastElementChild?.remove()}
function patchEurope(detail){const e=detail.event;if(!/champions league|europa league|conference league|uefa/i.test(e.strLeague||''))return;patchFixtureTable(document.getElementById('europe-grid'),e,detail);if(detail.isLive){setText(document.getElementById('europe-next'),`LIVE · ${e.intHomeScore??'–'}–${e.intAwayScore??'–'}`);setText(document.getElementById('europe-next-date'),e.statusLabel||'Live')}const hi=document.getElementById('europe-highlight');if(hi&&sameMatch(hi.textContent,e)){const vs=hi.querySelector('.europe-vs');if(vs)setText(vs,`${e.intHomeScore??'–'}–${e.intAwayScore??'–'}`)}}
function escapeHtml(v){return String(v??'').replace(/[&<>'"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]))}
function apply(){if(!live||reapplying)return;reapplying=true;try{if(document.body.dataset.page==='home')patchHome(live);if(document.body.dataset.page==='europe')patchEurope(live)}finally{reapplying=false}}
window.addEventListener('celtic:match-update',ev=>{live=ev.detail;apply()});
window.addEventListener('celtic:match-clear',()=>{live=null;document.getElementById('live-table-note')?.remove()});
function observe(id){const el=document.getElementById(id);if(!el)return;new MutationObserver(()=>{if(live)setTimeout(apply,0)}).observe(el,{childList:true,subtree:true})}
['fixtures-grid','preview-content','europe-grid','europe-highlight'].forEach(observe);
async function snapshotCheck(initial=false){try{const r=await fetch(`data.json?v=${Date.now()}`,{cache:'no-store'});if(!r.ok)return;const d=await r.json(),stamp=String(d.generatedAt||'');if(initial||!snapshotStamp){snapshotStamp=stamp;return}if(stamp&&stamp!==snapshotStamp){snapshotStamp=stamp;const btn=document.getElementById('refresh');if(btn&&!btn.disabled){btn.click();setTimeout(apply,1800)}else if(document.body.dataset.page==='europe'){location.reload()}}}catch(_){}}
document.addEventListener('visibilitychange',()=>{if(document.visibilityState==='visible'){snapshotCheck();setTimeout(apply,100)}});
setInterval(()=>snapshotCheck(),SNAPSHOT_POLL);
snapshotCheck(true);
})();