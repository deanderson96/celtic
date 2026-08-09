(function(){
'use strict';
const TDB_API='https://www.thesportsdb.com/api/v1/json/123';
const ESPN_ORIGINS=['https://site.api.espn.com','https://site.web.api.espn.com'];
const CELTIC_ID='133647';
const POLL_MS=60*1000;
const LIVE_STATUSES=new Set(['1H','HT','2H','ET','P','BT','SUSP','INT']);
const STATUS_LABELS={
  '1H':'First half','HT':'Half-time','2H':'Second half','ET':'Extra time','P':'Penalty shootout',
  'BT':'Extra-time break','SUSP':'Suspended','INT':'Interrupted'
};
let busy=false;
let currentId='';

const esc=value=>String(value??'').replace(/[&<>'"]/g,ch=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[ch]));
const clean=value=>String(value??'').replace(/\s+/g,' ').trim();
const eventDate=e=>{if(!e?.dateEvent)return null;const d=new Date(`${e.dateEvent}T${String(e.strTime||'15:00:00').slice(0,8)}Z`);return Number.isNaN(d.valueOf())?null:d};
const liveStatus=e=>String(e?.strStatus||'').toUpperCase();
const isTdbLive=e=>LIVE_STATUSES.has(liveStatus(e));

const style=document.createElement('style');
style.textContent=`
.live-match-panel{grid-column:span 12;border-color:rgba(66,216,134,.25);background:linear-gradient(135deg,#1d382d,#142820);box-shadow:0 20px 55px rgba(0,0,0,.22),inset 0 1px 0 rgba(255,255,255,.03)}
.live-match-panel .panel-heading{align-items:center}.live-match-kicker{display:flex;align-items:center;gap:8px}.live-pulse{width:8px;height:8px;border-radius:50%;background:var(--green-bright);box-shadow:0 0 0 0 rgba(66,216,134,.45);animation:livePulse 1.8s infinite}.live-status{display:inline-flex;align-items:center;gap:7px;padding:6px 10px;border-radius:999px;background:rgba(66,216,134,.11);color:#92eab9;font-size:10px;font-weight:900;letter-spacing:.07em;text-transform:uppercase}
.live-body{display:grid;grid-template-columns:minmax(330px,.85fr) minmax(0,1.15fr);min-height:230px}.live-scoreboard{display:flex;flex-direction:column;justify-content:center;padding:26px 30px;border-right:1px solid var(--line)}.live-competition{display:flex;align-items:center;justify-content:space-between;gap:16px;color:var(--muted);font-size:10px}.live-score-grid{display:grid;grid-template-columns:minmax(0,1fr) auto minmax(0,1fr);align-items:center;gap:18px;margin-top:22px}.live-team{text-align:center;min-width:0}.live-team img{width:64px;height:64px;object-fit:contain}.live-team strong{display:block;margin-top:8px;font-size:15px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.live-score{min-width:108px;text-align:center}.live-score strong{display:block;font-size:42px;line-height:1;letter-spacing:-.06em}.live-score span{display:block;margin-top:7px;color:var(--green-bright);font-size:10px;font-weight:900;letter-spacing:.08em;text-transform:uppercase}.live-meta{margin-top:20px;text-align:center;color:var(--muted-2);font-size:10px}
.live-stats{padding:22px 26px}.live-stats-head{display:flex;align-items:end;justify-content:space-between;gap:16px;margin-bottom:13px}.live-stats-head strong{font-size:14px}.live-stats-head small{color:var(--muted-2);font-size:9px}.live-stat-list{display:grid;gap:4px}.live-stat{display:grid;grid-template-columns:54px minmax(0,1fr) 54px;align-items:center;gap:12px;padding:9px 10px;border-radius:9px;background:rgba(0,0,0,.09)}.live-stat-value{font-size:12px;font-weight:900}.live-stat-value:last-child{text-align:right}.live-stat-main{display:grid;gap:5px;text-align:center}.live-stat-main span{color:var(--muted);font-size:9px;font-weight:800}.live-stat-track{height:4px;border-radius:99px;background:rgba(255,255,255,.07);overflow:hidden;display:flex}.live-stat-track i:first-child{height:100%;background:var(--green-bright)}.live-stat-track i:last-child{height:100%;background:rgba(255,255,255,.27)}.live-no-stats{display:grid;place-items:center;min-height:145px;padding:20px;border:1px dashed var(--line-strong);border-radius:12px;color:var(--muted);text-align:center;font-size:11px}.live-source{margin-top:12px;color:var(--muted-2);font-size:8px;text-align:right}
@keyframes livePulse{0%{box-shadow:0 0 0 0 rgba(66,216,134,.42)}70%{box-shadow:0 0 0 8px rgba(66,216,134,0)}100%{box-shadow:0 0 0 0 rgba(66,216,134,0)}}
@media(max-width:920px){.live-body{grid-template-columns:1fr}.live-scoreboard{border-right:0;border-bottom:1px solid var(--line)}}
@media(max-width:560px){.live-scoreboard,.live-stats{padding:18px 16px}.live-score-grid{gap:9px}.live-team img{width:48px;height:48px}.live-team strong{font-size:12px}.live-score{min-width:78px}.live-score strong{font-size:32px}.live-stat{grid-template-columns:42px minmax(0,1fr) 42px;gap:7px}.live-stats-head{align-items:flex-start;flex-direction:column}}
`;
document.head.appendChild(style);

async function fetchJsonUrl(url){
  const controller=new AbortController();
  const timer=setTimeout(()=>controller.abort(),10000);
  try{
    const response=await fetch(url,{cache:'no-store',signal:controller.signal});
    if(!response.ok)throw new Error(`HTTP ${response.status}`);
    return response.json();
  }finally{clearTimeout(timer)}
}

async function tdbJson(path){return fetchJsonUrl(`${TDB_API}/${path}`)}

async function espnJson(path){
  let lastError=null;
  for(const origin of ESPN_ORIGINS){
    try{return await fetchJsonUrl(`${origin}${path}`)}catch(error){lastError=error}
  }
  throw lastError||new Error('ESPN feed unavailable');
}

async function staticData(){
  const response=await fetch(`data.json?v=${Date.now()}`,{cache:'no-store'});
  if(!response.ok)throw new Error('Dataset unavailable');
  return response.json();
}

function candidateEvents(data){
  const now=Date.now();
  return (data.fixtures||[]).filter(event=>{
    const kickoff=eventDate(event)?.valueOf();
    if(!kickoff)return false;
    const celtic=String(event.idHomeTeam||'')===CELTIC_ID||String(event.idAwayTeam||'')===CELTIC_ID||/celtic/i.test(`${event.strHomeTeam||''} ${event.strAwayTeam||''}`);
    return celtic&&kickoff>=now-4*60*60*1000&&kickoff<=now+45*60*1000;
  }).sort((a,b)=>Math.abs((eventDate(a)?.valueOf()||0)-now)-Math.abs((eventDate(b)?.valueOf()||0)-now));
}

function espnLeague(event){
  const name=String(event?.strLeague||'').toLowerCase();
  if(name.includes('champions league'))return 'uefa.champions';
  if(name.includes('europa conference')||name.includes('conference league'))return 'uefa.europa.conf';
  if(name.includes('europa league'))return 'uefa.europa';
  if(name.includes('league cup'))return 'sco.cis';
  if(name.includes('fa cup')||name.includes('scottish cup'))return 'sco.tennents';
  return 'sco.1';
}

function dateKey(event){return String(event?.dateEvent||'').replaceAll('-','')}

function espnCompetitors(event){return event?.competitions?.[0]?.competitors||[]}

function espnTeamName(competitor){return competitor?.team?.displayName||competitor?.team?.shortDisplayName||competitor?.team?.name||''}

function isCelticEspnEvent(event){return espnCompetitors(event).some(c=>/celtic/i.test(espnTeamName(c)))}

function isEspnLive(event){
  const type=event?.status?.type||{};
  return type.state==='in'||type.completed===false&&Number(event?.status?.period||0)>0;
}

function normaliseEspnEvent(event,candidate,leagueName){
  const competition=event.competitions?.[0]||{};
  const competitors=competition.competitors||[];
  const home=competitors.find(c=>c.homeAway==='home')||competitors[0]||{};
  const away=competitors.find(c=>c.homeAway==='away')||competitors[1]||{};
  const status=event.status||{};
  const displayClock=clean(status.displayClock||status.type?.shortDetail||status.type?.detail||'Live');
  return {
    idEvent:String(event.id||candidate.idEvent||''),
    espnId:String(event.id||''),
    homeEspnId:String(home.id||home.team?.id||''),
    awayEspnId:String(away.id||away.team?.id||''),
    strHomeTeam:espnTeamName(home)||candidate.strHomeTeam,
    strAwayTeam:espnTeamName(away)||candidate.strAwayTeam,
    intHomeScore:home.score??candidate.intHomeScore??'–',
    intAwayScore:away.score??candidate.intAwayScore??'–',
    strHomeTeamBadge:home.team?.logo||candidate.strHomeTeamBadge||'',
    strAwayTeamBadge:away.team?.logo||candidate.strAwayTeamBadge||'',
    strLeague:leagueName||candidate.strLeague||'Competition',
    strVenue:competition.venue?.fullName||candidate.strVenue||'Venue TBC',
    strStatus:displayClock,
    _statusLabel:displayClock,
    _provider:'ESPN live feed'
  };
}

async function findEspnLive(candidate){
  const league=espnLeague(candidate);
  const board=await espnJson(`/apis/site/v2/sports/soccer/${league}/scoreboard?dates=${dateKey(candidate)}&v=${Date.now()}`);
  const event=(board.events||[]).find(item=>isCelticEspnEvent(item)&&isEspnLive(item));
  if(!event)return null;
  return normaliseEspnEvent(event,candidate,board.leagues?.[0]?.name||candidate.strLeague);
}

function statValue(stat){return stat?.displayValue??stat?.value??''}

function normaliseEspnStats(summary,event){
  const teams=summary?.boxscore?.teams||[];
  if(teams.length<2)return [];
  const home=teams.find(row=>String(row.team?.id||'')===event.homeEspnId)||teams.find(row=>/kilmarnock/i.test(row.team?.displayName||'')===/kilmarnock/i.test(event.strHomeTeam))||teams[0];
  const away=teams.find(row=>String(row.team?.id||'')===event.awayEspnId)||teams.find(row=>row!==home)||teams[1];
  const homeMap=new Map((home?.statistics||[]).map(stat=>[stat.name||stat.abbreviation||stat.displayName,stat]));
  const awayMap=new Map((away?.statistics||[]).map(stat=>[stat.name||stat.abbreviation||stat.displayName,stat]));
  const priority=['possessionPct','totalShots','shotsOnTarget','wonCorners','foulsCommitted','offsides','yellowCards','saves','totalPasses','passPct'];
  const seen=new Set();
  const keys=[];
  for(const key of priority)if(homeMap.has(key)&&awayMap.has(key))keys.push(key);
  for(const key of homeMap.keys())if(!keys.includes(key)&&awayMap.has(key))keys.push(key);
  const rows=[];
  for(const key of keys){
    const h=homeMap.get(key),a=awayMap.get(key);
    const hv=statValue(h),av=statValue(a);
    if(hv===''&&av==='')continue;
    const label=clean(h?.displayName||a?.displayName||h?.shortDisplayName||a?.shortDisplayName||key.replace(/([A-Z])/g,' $1'));
    const id=label.toLowerCase();
    if(seen.has(id))continue;
    seen.add(id);
    rows.push({strStat:label,intHome:hv,intAway:av});
    if(rows.length>=10)break;
  }
  return rows;
}

async function espnStats(event){
  if(!event.espnId)return [];
  try{
    const league=espnLeague({strLeague:event.strLeague});
    const summary=await espnJson(`/apis/site/v2/sports/soccer/${league}/summary?event=${encodeURIComponent(event.espnId)}&v=${Date.now()}`);
    return normaliseEspnStats(summary,event);
  }catch(_){return []}
}

async function findTdbLive(candidate){
  try{
    const fresh=(await tdbJson(`lookupevent.php?id=${encodeURIComponent(candidate.idEvent)}`)).events?.[0];
    return fresh&&isTdbLive(fresh)?{...fresh,_provider:'TheSportsDB live feed'}:null;
  }catch(_){return null}
}

async function tdbStats(id){
  try{return (await tdbJson(`lookupeventstats.php?id=${encodeURIComponent(id)}`)).eventstats||[]}catch(_){return []}
}

function numeric(value){
  const match=String(value??'').replace(',','').match(/-?\d+(?:\.\d+)?/);
  return match?Number(match[0]):null;
}

function statRow(stat){
  const home=stat.intHome??stat.strHome??'';
  const away=stat.intAway??stat.strAway??'';
  const hv=numeric(home),av=numeric(away),total=(hv??0)+(av??0);
  const hp=total>0&&hv!=null?Math.max(0,Math.min(100,(hv/total)*100)):50;
  const ap=total>0&&av!=null?Math.max(0,Math.min(100,(av/total)*100)):50;
  return `<div class="live-stat"><span class="live-stat-value">${esc(home)}</span><div class="live-stat-main"><span>${esc(stat.strStat||'Match stat')}</span><div class="live-stat-track" aria-hidden="true"><i style="width:${hp}%"></i><i style="width:${ap}%"></i></div></div><span class="live-stat-value">${esc(away)}</span></div>`;
}

function ensurePanel(){
  let panel=document.getElementById('live-match-centre');
  if(panel)return panel;
  const dashboard=document.querySelector('.dashboard');
  if(!dashboard)return null;
  panel=document.createElement('section');
  panel.id='live-match-centre';
  panel.className='panel live-match-panel';
  panel.setAttribute('aria-live','polite');
  const preview=document.getElementById('preview');
  if(preview)dashboard.insertBefore(panel,preview);else dashboard.prepend(panel);
  return panel;
}

function removePanel(){
  document.getElementById('live-match-centre')?.remove();
  currentId='';
}

function statusText(event){return event._statusLabel||STATUS_LABELS[liveStatus(event)]||event.strStatus||'Live'}

function render(event,stats){
  const panel=ensurePanel();
  if(!panel)return;
  const checked=new Intl.DateTimeFormat('en-GB',{timeZone:'Europe/London',hour:'2-digit',minute:'2-digit',timeZoneName:'short'}).format(new Date());
  const venue=event.strVenue||'Venue TBC';
  const homeScore=event.intHomeScore??'–',awayScore=event.intAwayScore??'–';
  panel.innerHTML=`
    <div class="panel-heading">
      <div><p class="kicker live-match-kicker"><span class="live-pulse"></span>Live match centre</p><h2>${esc(event.strHomeTeam||'Home')} v ${esc(event.strAwayTeam||'Away')}</h2></div>
      <span class="live-status"><span class="live-pulse"></span>${esc(statusText(event))}</span>
    </div>
    <div class="live-body">
      <div class="live-scoreboard">
        <div class="live-competition"><span>${esc(event.strLeague||'Competition')}</span><span>${esc(venue)}</span></div>
        <div class="live-score-grid">
          <div class="live-team"><img src="${esc(event.strHomeTeamBadge||'')}" alt=""><strong>${esc(event.strHomeTeam||'Home')}</strong></div>
          <div class="live-score"><strong>${esc(homeScore)}–${esc(awayScore)}</strong><span>${esc(statusText(event))}</span></div>
          <div class="live-team"><img src="${esc(event.strAwayTeamBadge||'')}" alt=""><strong>${esc(event.strAwayTeam||'Away')}</strong></div>
        </div>
        <div class="live-meta">Automatically checked every minute · Last checked ${esc(checked)}</div>
      </div>
      <div class="live-stats">
        <div class="live-stats-head"><strong>Match statistics</strong><small>Availability depends on the live provider feed</small></div>
        ${stats.length?`<div class="live-stat-list">${stats.map(statRow).join('')}</div>`:'<div class="live-no-stats">Live statistics have not been published by the available feeds yet. This panel checks again automatically every minute.</div>'}
        <div class="live-source">Source: ${esc(event._provider||'Live football data feed')}</div>
      </div>
    </div>`;
  currentId=String(event.idEvent||'');
}

async function refresh(){
  if(busy||document.visibilityState==='hidden')return;
  busy=true;
  try{
    const data=await staticData();
    const candidates=candidateEvents(data).slice(0,2);
    for(const candidate of candidates){
      try{
        const espn=await findEspnLive(candidate);
        if(espn){render(espn,await espnStats(espn));return}
      }catch(_){}
      const tdb=await findTdbLive(candidate);
      if(tdb){render(tdb,await tdbStats(tdb.idEvent));return}
    }
    removePanel();
  }catch(_){
    if(!currentId)removePanel();
  }finally{busy=false}
}

document.addEventListener('visibilitychange',()=>{if(document.visibilityState==='visible')refresh()});
window.setInterval(refresh,POLL_MS);
refresh();
})();
