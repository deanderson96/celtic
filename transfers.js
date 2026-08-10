(function(){
'use strict';

// Update this timestamp whenever a credible transfer change is committed to the table.
const tableLastUpdated='10 Aug 2026, 09:02';

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
    previousStatus:'The player’s agent had confirmed Celtic contact, with no formal offer submitted.',
    latestUpdate:'Celtic remain interested, but Red Bull Salzburg have now joined the pursuit and view Gineitis as a midfield option. The added competition modestly reduces Celtic’s likelihood of completing a deal, and no formal Celtic bid has been reported.',
    confidence:'Medium–High',
    updated:'10 Aug 2026',
    source:'Scottish Sun',
    url:'https://www.thescottishsun.co.uk/sport/16665279/celtic-transfer-target-wanted-danny-rohl-rangers-salzburg/'
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
  },
  {
    category:'Incoming target',
    player:'Nick Pope',
    previousStatus:'No Celtic move for Pope was being actively tracked.',
    latestUpdate:'Celtic are reportedly monitoring Pope’s situation at Newcastle after he fell down the goalkeeping pecking order. No Celtic bid or formal approach has been reported, so this remains an emerging target rather than an advanced deal.',
    confidence:'Medium',
    updated:'9 Aug 2026',
    source:'Scottish Sun',
    url:'https://www.thescottishsun.co.uk/sport/16664731/pope-celtic-goalkeeper-newcastle-sinisalo-doohan/'
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
