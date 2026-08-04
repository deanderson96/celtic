# Celtic FC Supporters Hub

A static, responsive Celtic FC dashboard hosted directly by GitHub Pages.

Live site: `https://deanderson96.github.io/celtic/`

## Features

- Full-season Celtic fixture list assembled across the competitions listed by TheSportsDB
- Scottish Premiership coverage shown against the 38-match season total; the final five post-split games appear when officially published
- Upcoming and completed fixture filters
- Recent results
- Full current first-team squad, grounded in Celtic's official squad page and enriched with TheSportsDB player data
- Next-match preview with both team badges, league positions, recent results, venue and latest meeting
- All kickoff times displayed in Europe/London time, including BST
- Subtle highlighting for matches at Celtic Park
- Latest transfer reports from a strict source whitelist, labelled as official, confirmed, report or speculation
- Scottish Premiership table
- Dedicated Europe page limited to the Champions League, Europa League and Conference League
- Responsive layout using `#172B23` as the primary background colour

## Data refresh

The site is served as plain HTML, CSS, JavaScript and JSON from `main`; no build process is required. A scheduled GitHub Action refreshes `data.json` every day from TheSportsDB, Celtic's official squad page and a curated transfer-news feed. GitHub Pages republishes automatically after the generated data is committed.

The browser also has a direct TheSportsDB v1 API fallback, so core team, fixture, squad and table information can still appear when a generated refresh is unavailable.

## Files

- `index.html` — main hub
- `europe.html` — Celtic's active UEFA competitions
- `styles.css` — shared responsive design
- `app.js` — main-page data and rendering logic
- `europe.js` — European fixture filtering
- `data.json` — generated season, squad, preview and transfer-news data
- `.github/workflows/refresh-data.yml` — daily data refresh

## Disclaimer

This is an unofficial supporter project and is not affiliated with Celtic Football Club. Sports data is supplied by TheSportsDB. Transfer reports remain the responsibility of their original publishers and should be treated as speculation unless officially confirmed.
