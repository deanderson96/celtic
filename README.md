# Celtic FC Supporters Hub

A static, responsive Celtic FC dashboard hosted directly by GitHub Pages.

Live site: `https://deanderson96.github.io/celtic/`

## Features

- Full-season Celtic fixture list assembled across the competitions listed by TheSportsDB
- Upcoming and completed fixture filters
- Recent results
- Full Celtic squad with player and position search
- Next-match preview with both team badges, league positions, recent results, venue and latest meeting
- Subtle highlighting for matches at Celtic Park
- Scottish Premiership table
- Dedicated Europe page limited to the Champions League, Europa League and Conference League
- Responsive layout using `#172B23` as the primary background colour

## Data refresh

The site is served as plain HTML, CSS, JavaScript and JSON from `main`; no build process is required. A scheduled GitHub Action refreshes `data.json` every day from TheSportsDB. It expands the club and season pages into a complete public dataset, then GitHub Pages republishes automatically.

The browser also has a direct v1 API fallback, so core team, fixture, squad and table information can still appear when a generated refresh is unavailable.

## Files

- `index.html` — main hub
- `europe.html` — Celtic's active UEFA competitions
- `styles.css` — shared responsive design
- `app.js` — main-page data and rendering logic
- `europe.js` — European fixture filtering
- `data.json` — generated season, squad and preview data
- `.github/workflows/refresh-data.yml` — daily data refresh

## Disclaimer

This is an unofficial supporter project and is not affiliated with Celtic Football Club. Sports data is supplied by TheSportsDB.
