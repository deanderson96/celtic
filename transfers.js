(function(){
'use strict';

// Update this timestamp whenever a credible transfer change is committed to the table.
const tableLastUpdated='9 Aug 2026, 09:22';

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
    previousStatus:'Everton’s interest had appeared to cool after no fee was agreed with Celtic.',
    latestUpdate:'Everton’s pursuit has revived materially. Johnston is reported as David Moyes’ priority right-back target, an Everton scout watched him against Dundee, and Martin O’Neill said Moyes has indicated an offer is planned. No formal bid has yet been reported.',
    confidence:'Medium–High',
    updated:'8 Aug 2026',
    source:'Scottish Sun',
    url:'https://www.thescottishsun.co.uk/sport/16658638/andy-burnham-begs-everton-sign-alistair-johnston/'
  },
  {
    category:'Incoming target',
    player:'Haissem Hassan',
    previousStatus:'Celtic had moved into pole position and were reported to be very close to an agreement with Real Oviedo.',
    latestUpdate:'Celtic are reported to be finalising a deal worth roughly £9m–£9.5m for Hassan, with the transfer described as being in its closing stages. It remains unofficial until the clubs announce completion.',
    confidence:'High',
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
  },
  {
    category:'Incoming target',
    player:'Greg Taylor',
    previousStatus:'No Celtic return was being actively tracked; Celtic had been exploring other left-back options.',
    latestUpdate:'Celtic are reportedly considering bringing Taylor back from PAOK after missing out on Marcelo Saracchi. Taylor is said to be open to returning, although Celtic have not made a formal approach and Burnley and Málaga are also interested.',
    confidence:'Medium–High',
    updated:'8 Aug 2026',
    source:'Scottish Sun',
    url:'https://www.thescottishsun.co.uk/sport/16658651/greg-taylor-celtic-return-stunning-transfer-swoop/'
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
