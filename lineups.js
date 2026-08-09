(function(){
'use strict';
const API='https://www.thesportsdb.com/api/v1/json/123';
const TEAM_ID='133647';
const POLL_MS=5*60*1000;
const WINDOW_MS=3*60*60*1000;
let busy=false;
let lastEventId='';
let lastRenderedKey='';

const style=document.createElement('style');
style.textContent=`
.preview-lineups{border-top:1px solid var(--line);background:rgba(0,0,0,.075)}
.lineup-heading{display:flex;align-items:end;justify-content:space-between;gap:18px;padding:16px 20px;border-bottom:1px solid var(--line)}
.lineup-heading span,.lineup-team-heading span{display:block;color:var(--green-bright);font-size:9px;font-weight:900;letter-spacing:.12em;text-transform:uppercase}
.lineup-heading strong{display:block;margin-top:3px;font-size:14px}.lineup-heading small{color:var(--muted-2);font-size:9px;text-align:right}
.lineup-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:0}.lineup-team{padding:18px 20px}.lineup-team+ .lineup-team{border-left:1px solid var(--line)}
.lineup-team-heading{display:flex;align-items:center;gap:10px;margin-bottom:12px}.lineup-team-heading img{width:34px;height:34px;object-fit:contain}.lineup-team-heading h4{margin:2px 0 0;font-size:13px}
.lineup-team ol{list-style:none;margin:0;padding:0;display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:6px 12px}.lineup-team li{min-width:0;display:grid;grid-template-columns:24px minmax(0,1fr);align-items:center;gap:7px;padding:6px 7px;border-radius:8px;background:rgba(255,255,255,.025)}
.lineup-order{width:22px;height:22px;display:grid;place-items:center;border-radius:6px;background:#10241c;color:#8ce8b5;font-size:8px;font-weight:900}.lineup-team li strong{display:block;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;font-size:10px}.lineup-team li small{display:block;margin-top:1px;color:var(--muted-2);font-size:8px}
.lineup-source{padding:9px 20px;border-top:1px solid var(--line);color:var(--muted-2);font-size:8px;text-align:right}
@media(max-width:680px){.lineup-heading{align-items:flex-start;flex-direction:column}.lineup-heading small{text-align:left}.lineup-grid{grid-template-columns:1fr}.lineup-team+ .lineup-team{border-left:0;border-top:1px solid var(--line)}.lineup-team ol{grid-template-columns:1fr 1fr}}
@media(max-width:420px){.lineup-team ol{grid-template-columns:1fr}}
`;
document.head.appendChild(style);

const esc=value=>String(value??'').replace(/[&<>'"]/g,ch=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[ch]));
const clean=value=>String(value??'').replace(/\s+/g,' ').trim();
const normalise=value=>clean(value).normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]/g,'');
const eventDate=e=>{if(!e?.dateEvent)return null;const d=new Date(`${e.dateEvent}T${String(e.strTime||'15:00:00').slice(0,8)}Z`);return Number.isNaN(d.valueOf())?null:d};
const isCompleted=e=>e?.intHomeScore!=null&&e?.intAwayScore!=null;

async function fetchJson(url){
  const controller=new AbortController();
  const timer=setTimeout(()=>controller.abort(),10000);
  try{
    const response=await fetch(url,{cache:'no-store',signal:controller.signal});
    if(!response.ok)throw new Error(`HTTP ${response.status}`);
    return response.json();
  }finally{clearTimeout(timer)}
}

async function fetchText(url){
  const controller=new AbortController();
  const timer=setTimeout(()=>controller.abort(),10000);
  try{
    const response=await fetch(url,{cache:'no-store',signal:controller.signal});
    if(!response.ok)throw new Error(`HTTP ${response.status}`);
    return response.text();
  }finally{clearTimeout(timer)}
}

async function currentEvent(){
  const data=await fetchJson(`data.json?v=${Date.now()}`);
  const events=(data.fixtures||[]).filter(e=>!isCompleted(e)).sort((a,b)=>(eventDate(a)?.valueOf()||0)-(eventDate(b)?.valueOf()||0));
  const now=Date.now()-3*60*60*1000;
  return events.find(e=>(eventDate(e)?.valueOf()||0)>=now)||events[0]||null;
}

function apiStarters(rows,event){
  const starters=(rows||[]).filter(row=>String(row?.strSubstitute||'No').toLowerCase()!=='yes');
  const home=starters.filter(row=>String(row.idTeam||'')===String(event.idHomeTeam||'')||String(row.strHome||'').toLowerCase()==='yes');
  const away=starters.filter(row=>String(row.idTeam||'')===String(event.idAwayTeam||'')||String(row.strHome||'').toLowerCase()==='no');
  if(home.length<11||away.length<11)return null;
  return {source:'TheSportsDB API',home:home.slice(0,11),away:away.slice(0,11)};
}

function eventSlug(event){
  return clean(`${event.strHomeTeam||'home'}-vs-${event.strAwayTeam||'away'}`).toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'');
}

function segmentBetween(markup,startLabel,endLabel){
  const start=markup.toLowerCase().indexOf(startLabel.toLowerCase());
  if(start<0)return '';
  const end=markup.toLowerCase().indexOf(endLabel.toLowerCase(),start+startLabel.length);
  return markup.slice(start,end>start?end:undefined);
}

function scrapeStartingXI(fragment,home,event){
  if(!fragment||typeof DOMParser==='undefined')return [];
  const doc=new DOMParser().parseFromString(fragment,'text/html');
  const cells=[...doc.querySelectorAll('td')];
  const players=[];
  for(const cell of cells){
    const link=[...cell.querySelectorAll('a[href*="/player/"]')].find(a=>clean(a.textContent));
    if(!link)continue;
    const name=clean(link.textContent);
    if(!name||players.some(p=>normalise(p.strPlayer)===normalise(name)))continue;
    const match=(link.getAttribute('href')||'').match(/\/player\/(\d+)/);
    players.push({
      idPlayer:match?.[1]||'',
      idEvent:String(event.idEvent||''),
      idTeam:String(home?event.idHomeTeam:event.idAwayTeam),
      strTeam:home?event.strHomeTeam:event.strAwayTeam,
      strPlayer:name,
      strHome:home?'Yes':'No',
      strSubstitute:'No',
      intSquadNumber:'',
      strPosition:''
    });
  }
  return players.slice(0,11);
}

async function websiteStarters(event){
  const url=`https://www.thesportsdb.com/event/${encodeURIComponent(event.idEvent)}-${eventSlug(event)}`;
  const markup=await fetchText(url);
  const homeFragment=segmentBetween(markup,'Home Team Lineup','Away Team Lineup');
  const awayFragment=segmentBetween(markup,'Away Team Lineup','Event Statistics');
  const home=scrapeStartingXI(homeFragment,true,event);
  const away=scrapeStartingXI(awayFragment,false,event);
  if(home.length!==11||away.length!==11)return null;
  return {source:'TheSportsDB event page',home,away};
}

async function getLineup(event){
  try{
    const data=await fetchJson(`${API}/lookuplineup.php?id=${encodeURIComponent(event.idEvent)}`);
    const full=apiStarters(data.lineup||[],event);
    if(full)return full;
  }catch(_){}
  try{return await websiteStarters(event)}catch(_){return null}
}

function playerRow(player,index){
  const number=clean(player.intSquadNumber);
  const position=clean(player.strPosition);
  const meta=[number?`#${number}`:'',position].filter(Boolean).join(' · ');
  return `<li><span class="lineup-order">${index+1}</span><div><strong>${esc(player.strPlayer||'')}</strong>${meta?`<small>${esc(meta)}</small>`:''}</div></li>`;
}

function teamLineup(title,badge,players){
  return `<section class="lineup-team"><div class="lineup-team-heading">${badge?`<img src="${esc(badge)}" alt="">`:''}<div><span>Starting XI</span><h4>${esc(title)}</h4></div></div><ol>${players.map(playerRow).join('')}</ol></section>`;
}

function render(event,lineup){
  const preview=document.querySelector('#preview-content .preview');
  if(!preview||!lineup)return false;
  const key=`${event.idEvent}:${lineup.home.map(p=>p.idPlayer||p.strPlayer).join(',')}:${lineup.away.map(p=>p.idPlayer||p.strPlayer).join(',')}`;
  if(key===lastRenderedKey&&preview.querySelector('.preview-lineups'))return true;
  preview.querySelector('.preview-lineups')?.remove();
  const block=document.createElement('section');
  block.className='preview-lineups';
  block.innerHTML=`<div class="lineup-heading"><div><span>Confirmed teams</span><strong>Starting lineups</strong></div><small>Shown only when a complete 11-v-11 lineup is available</small></div><div class="lineup-grid">${teamLineup(event.strHomeTeam,event.strHomeTeamBadge,lineup.home)}${teamLineup(event.strAwayTeam,event.strAwayTeamBadge,lineup.away)}</div><div class="lineup-source">Source: ${esc(lineup.source)}</div>`;
  const note=preview.querySelector('.preview-note');
  if(note)preview.insertBefore(block,note);else preview.appendChild(block);
  lastRenderedKey=key;
  return true;
}

async function refreshLineup(force=false){
  if(busy||document.visibilityState==='hidden')return;
  busy=true;
  try{
    const event=await currentEvent();
    if(!event)return;
    const kickoff=eventDate(event)?.valueOf()||0;
    const nearMatch=Math.abs(kickoff-Date.now())<=WINDOW_MS;
    if(!force&&!nearMatch&&String(event.idEvent)===lastEventId)return;
    lastEventId=String(event.idEvent||'');
    const lineup=await getLineup(event);
    if(lineup)render(event,lineup);
  }catch(_){}finally{busy=false}
}

const observer=new MutationObserver(()=>{
  if(document.querySelector('#preview-content .preview')&&!document.querySelector('.preview-lineups'))refreshLineup(true);
});
const previewContent=document.getElementById('preview-content');
if(previewContent)observer.observe(previewContent,{childList:true,subtree:true});

document.addEventListener('visibilitychange',()=>{if(document.visibilityState==='visible')refreshLineup(true)});
window.setInterval(()=>refreshLineup(false),POLL_MS);
refreshLineup(true);
})();
