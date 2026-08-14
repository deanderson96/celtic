(function(){
'use strict';

// Update this timestamp whenever a credible transfer change is committed to the table.
const tableLastUpdated='14 Aug 2026, 07:56';

const speculation=[
  {
    category:'Potential departure',
    player:'Arne Engels',
    previousStatus:'West Ham were preparing an improved package after Celtic rejected earlier approaches.',
    latestUpdate:'Celtic are now reported to have agreed a £22m fee with West Ham for Engels. Personal terms are not expected to be a problem, moving the transfer from active bidding to a reported club-to-club agreement, although the departure has not yet been officially announced.',
    confidence:'High',
    updated:'14 Aug 2026',
    source:'Scottish Sun',
    url:'https://www.thescottishsun.co.uk/sport/16683360/celtic-agree-fee-west-ham-arne-engels/'
  },
  {
    category:'Potential departure',
    player:'Alistair Johnston',
    previousStatus:'Everton’s pursuit had revived, with Johnston viewed as a priority right-back target.',
    latestUpdate:'Johnston has suffered a fresh injury that is expected to keep him out of Celtic’s Champions League play-off and could complicate or delay Everton’s pursuit. No transfer agreement has been reported.',
    confidence:'Medium–High',
    updated:'13 Aug 2026',
    source:'Scottish Sun',
    url:'https://www.thescottishsun.co.uk/sport/16679009/celtic-alistair-johnston-injury-everton/'
  },
  {
    category:'Incoming target',
    player:'Gvidas Gineitis',
    previousStatus:'The player’s agent had confirmed Celtic contact, with no formal offer submitted.',
    latestUpdate:'Celtic remain interested, but Red Bull Salzburg have joined the pursuit. Gineitis is still viewed as a possible midfield option if further departures occur, and no formal Celtic bid has been reported.',
    confidence:'Medium–High',
    updated:'13 Aug 2026',
    source:'Scottish Sun',
    url:'https://www.thescottishsun.co.uk/sport/16681019/celtic-transfer-special-mika-baur-arne-engels-replacement/'
  },
  {
    category:'Incoming target',
    player:'Farès Ghedjemis',
    previousStatus:'Celtic had an opening bid rejected by Frosinone but remained interested.',
    latestUpdate:'Ghedjemis remains on the wider target list, but Celtic’s completed signing of Haissem Hassan reduces the immediate need to accelerate another right-wing deal.',
    confidence:'Medium',
    updated:'13 Aug 2026',
    source:'Scottish Sun',
    url:'https://www.thescottishsun.co.uk/sport/16651499/celtic-transfer-special-kuhn-replacement-alistair-johnston-hassan/'
  },
  {
    category:'Potential departure',
    player:'Dane Murray',
    previousStatus:'Dundee had explored taking Murray on loan.',
    latestUpdate:'Celtic rejected Dundee’s loan approach, materially reducing the likelihood of a short-term exit and indicating they currently intend to retain him.',
    confidence:'Medium–High',
    updated:'5 Aug 2026',
    source:'Scottish Sun',
    url:'https://www.thescottishsun.co.uk/sport/16645908/celtic-rebuff-star-approach-premiership-rivals/'
  },
  {
    category:'Incoming target',
    player:'Greg Taylor',
    previousStatus:'No Celtic return was being actively tracked.',
    latestUpdate:'Celtic are reportedly considering bringing Taylor back from PAOK. Taylor is said to be open to returning, although no formal Celtic approach has been reported and other clubs are interested.',
    confidence:'Medium–High',
    updated:'8 Aug 2026',
    source:'Scottish Sun',
    url:'https://www.thescottishsun.co.uk/sport/16658651/greg-taylor-celtic-return-stunning-transfer-swoop/'
  },
  {
    category:'Incoming target',
    player:'Nick Pope',
    previousStatus:'Celtic had been linked with Pope after his Newcastle future became uncertain.',
    latestUpdate:'The Celtic link has been directly played down. Reporting says Celtic have made no contact over Pope and are looking for a backup goalkeeper rather than a player of his profile and cost, making a move materially less likely.',
    confidence:'Medium–High',
    updated:'11 Aug 2026',
    source:'Football Insider / Shields Gazette',
    url:'https://cominghomenewcastle.sbnation.com/newcastle-united-transfer-news-rumors/23870/celtic-not-interested-in-newcastles-veteran-in-late-transfer-twist-report'
  },
  {
    category:'Incoming target',
    player:'Landon Emenalo',
    previousStatus:'No Celtic move was being tracked.',
    latestUpdate:'Celtic are targeting the Chelsea left-back for a loan move. Emenalo has toured Lennoxtown and is being considered as cover for Kieran Tierney.',
    confidence:'High',
    updated:'13 Aug 2026',
    source:'Scottish Sun',
    url:'https://www.thescottishsun.co.uk/sport/16678559/celtic-loan-swoop-chelsea-lennoxtown-tour-emenalo/'
  },
  {
    category:'Potential departure',
    player:'Reo Hatate',
    previousStatus:'Hatate had previously indicated a desire to leave Celtic this summer.',
    latestUpdate:'Fresh reporting says Mika Baur’s arrival is expected to clear the way for Hatate’s departure. No destination or agreed transfer has yet been reported.',
    confidence:'Medium–High',
    updated:'13 Aug 2026',
    source:'Scottish Sun',
    url:'https://www.thescottishsun.co.uk/sport/16681019/celtic-transfer-special-mika-baur-arne-engels-replacement/'
  },
  {
    category:'Incoming target',
    player:'Ermin Mahmić',
    previousStatus:'No Celtic move was being tracked.',
    latestUpdate:'Celtic are actively tracking the Slovan Liberec forward and have enquired about wage expectations and the club’s asking price. Several European clubs are also interested, so this remains an emerging rather than advanced deal.',
    confidence:'Medium–High',
    updated:'13 Aug 2026',
    source:'Scottish Sun',
    url:'https://www.thescottishsun.co.uk/sport/16681447/celtic-world-cup-wonderkid-askou-rohl-transfer-bosnia/'
  }
];

const esc=value=>String(value??'').replace(/[&<>'"]/g,ch=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[ch]));

function tableHtml(){
  return `<div class="transfer-updated" style="display:flex;align-items:center;justify-content:flex-end;gap:.4rem;margin:0 0 .65rem;font-size:.78rem;opacity:.62"><span aria-hidden="true" style="width:.42rem;height:.42rem;border-radius:50%;background:currentColor;display:inline-block"></span><span>Last updated ${esc(tableLastUpdated)}</span></div><div class="data-table-wrap"><table class="data-table transfer-table"><thead><tr><th>Category</th><th>Player</th><th>Previous status</th><th>Latest credible update</th><th>Confidence</th><th>Source</th></tr></thead><tbody>${speculation.map(item=>`<tr><td><span class="status-chip upcoming">${esc(item.category)}</span></td><td><strong>${esc(item.player)}</strong></td><td>${esc(item.previousStatus)}</td><td>${esc(item.latestUpdate)}</td><td><strong>${esc(item.confidence)}</strong></td><td><a href="${esc(item.url)}" target="_blank" rel="noreferrer">${esc(item.source)}<br><small>${esc(item.updated)}</small> ↗</a></td></tr>`).join('')}</tbody></table></div>`;
}

function render(){
  const grid=document.getElementById('transfer-grid');
  if(!grid)return;
  const html=tableHtml();
  if(grid.innerHTML!==html)grid.innerHTML=html;
}

document.addEventListener('DOMContentLoaded',()=>{
  const grid=document.getElementById('transfer-grid');
  if(!grid)return;
  render();
  const observer=new MutationObserver(()=>{
    observer.disconnect();
    render();
    observer.observe(grid,{childList:true,subtree:true});
  });
  observer.observe(grid,{childList:true,subtree:true});
});
})();
