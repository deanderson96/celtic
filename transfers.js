(function(){
'use strict';

const speculation=[
  {
    category:'Potential departure',
    player:'Arne Engels',
    previousStatus:'West Ham had submitted an improved second bid after agreeing personal terms with the player.',
    latestUpdate:'West Ham are preparing a third bid reported at about £25m. Celtic have not accepted an offer and want Engels available for the Champions League play-off.',
    confidence:'High',
    updated:'5 Aug 2026',
    source:'Scottish Sun',
    url:'https://www.thescottishsun.co.uk/sport/16644244/celtic-west-ham-arne-engels-bid-transfer-latest/'
  },
  {
    category:'Potential departure',
    player:'Alistair Johnston',
    previousStatus:'Everton were interested, but no formal bid had been reported and the move remained uncertain.',
    latestUpdate:'Johnston has reportedly told Celtic he wants to pursue a Premier League move. Everton remain the leading suitor, while Celtic are reluctant to sell before the Champions League play-off and are reported to value him at around £15m–£20m.',
    confidence:'Medium',
    updated:'6 Aug 2026',
    source:'Scottish Sun',
    url:'https://www.thescottishsun.co.uk/sport/16649036/alistair-johnston-wants-celtic-exit-premier-league/'
  },
  {
    category:'Incoming target',
    player:'Haissem Hassan',
    previousStatus:'Reports had indicated Hassan agreed personal terms with Marseille, making Celtic outsiders.',
    latestUpdate:'Celtic are now reported to be very close to a deal with Real Oviedo, with Hassan preferring the Celtic move and negotiations advanced around a package worth roughly £9m–£9.5m. The transfer is not yet official.',
    confidence:'Medium–High',
    updated:'7 Aug 2026',
    source:'Scottish Sun',
    url:'https://www.thescottishsun.co.uk/sport/16650981/celtic-close-signing-winger-blockbuster-transfer/'
  },
  {
    category:'Incoming target',
    player:'Mika Baur',
    previousStatus:'Personal terms were reported agreed, with Celtic negotiating with Paderborn.',
    latestUpdate:'Paderborn have rejected Celtic’s offers and publicly indicated they expect Baur to stay. The pursuit remains possible but has lost momentum.',
    confidence:'High',
    updated:'2 Aug 2026',
    source:'Scottish Sun',
    url:'https://www.thescottishsun.co.uk/sport/16633569/mika-baur-celtic-transfer-paderborn-boss-cold-water/'
  },
  {
    category:'Incoming target',
    player:'Gvidas Gineitis',
    previousStatus:'Reported as a possible midfield replacement if Engels leaves.',
    latestUpdate:'The player’s agent confirmed Celtic have made contact, while clarifying that no formal offer has been submitted.',
    confidence:'High',
    updated:'3 Aug 2026',
    source:'Scottish Sun',
    url:'https://www.thescottishsun.co.uk/sport/16638341/celtic-target-agent-ready-cooperate-transfer-update/'
  },
  {
    category:'Incoming target',
    player:'Farès Ghedjemis',
    previousStatus:'Celtic had an opening bid rejected by Frosinone but remained actively interested.',
    latestUpdate:'Celtic now appear to be prioritising Haissem Hassan for the right-wing role, with Hassan viewed as the more attainable deal. Ghedjemis remains on the wider target list, but the likelihood of Celtic pushing this deal immediately has decreased.',
    confidence:'Medium–High',
    updated:'7 Aug 2026',
    source:'Scottish Sun',
    url:'https://www.thescottishsun.co.uk/sport/16651499/celtic-transfer-special-kuhn-replacement-alistair-johnston-hassan/'
  },
  {
    category:'Potential departure',
    player:'Dane Murray',
    previousStatus:'No active departure was being tracked.',
    latestUpdate:'Celtic have reportedly rejected Dundee’s request to take Murray on loan, materially reducing the likelihood of a short-term exit and indicating they currently intend to retain him.',
    confidence:'Medium–High',
    updated:'5 Aug 2026',
    source:'Scottish Sun',
    url:'https://www.thescottishsun.co.uk/sport/16645908/celtic-rebuff-star-approach-premiership-rivals/'
  }
];

const esc=value=>String(value??'').replace(/[&<>'"]/g,ch=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[ch]));

function tableHtml(){
  return `<div class="data-table-wrap"><table class="data-table transfer-table"><thead><tr><th>Category</th><th>Player</th><th>Previous status</th><th>Latest credible update</th><th>Confidence</th><th>Source</th></tr></thead><tbody>${speculation.map(item=>`<tr><td><span class="status-chip upcoming">${esc(item.category)}</span></td><td><strong>${esc(item.player)}</strong></td><td>${esc(item.previousStatus)}</td><td>${esc(item.latestUpdate)}</td><td><strong>${esc(item.confidence)}</strong></td><td><a href="${esc(item.url)}" target="_blank" rel="noreferrer">${esc(item.source)}<br><small>${esc(item.updated)}</small> ↗</a></td></tr>`).join('')}</tbody></table></div>`;
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
