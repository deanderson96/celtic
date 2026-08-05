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
    previousStatus:'Everton interest was credible, but reports of an imminent deal were not supported by a formal bid.',
    latestUpdate:'Everton continue to monitor Johnston and have held contact, but are also pursuing Atlético Madrid right-back Nahuel Molina. No formal Johnston bid has been reported.',
    confidence:'Medium',
    updated:'5 Aug 2026',
    source:'Scottish Sun',
    url:'https://www.thescottishsun.co.uk/sport/16643259/alistair-johnston-celtic-future-everton-transfer-talks/'
  },
  {
    category:'Incoming target',
    player:'Haissem Hassan',
    previousStatus:'Celtic remained interested after Hassan rejected a Saudi offer.',
    latestUpdate:'Hassan has reportedly agreed personal terms with Marseille. Marseille still need a club-to-club agreement, but Celtic’s chances have materially decreased.',
    confidence:'Medium–High',
    updated:'5 Aug 2026',
    source:'Scottish Sun',
    url:'https://www.thescottishsun.co.uk/sport/16646267/celtic-transfer-target-agrees-rival-club-deal/'
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
    previousStatus:'Celtic interest had developed into an active pursuit.',
    latestUpdate:'Celtic’s opening bid has reportedly been rejected by Frosinone. The player remains a target, but valuation and rival interest are obstacles.',
    confidence:'Medium–High',
    updated:'5 Aug 2026',
    source:'Scottish Sun',
    url:'https://www.thescottishsun.co.uk/sport/16644244/celtic-west-ham-arne-engels-bid-transfer-latest/'
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
