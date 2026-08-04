# Celtic FC Supporters Hub

A responsive, unofficial Celtic FC dashboard built with React and Vite. It brings club details, upcoming fixtures, recent results, first-team players and Celtic's current European campaign into one place.

## Features

- Celtic FC club overview
- Upcoming fixtures and recent results
- Searchable first-team squad
- Dedicated Europe page
- Automatic filtering for UEFA Champions League, Europa League and Conference League events
- Responsive layout using `#172B23` as the primary background colour
- Graceful empty and API-error states

## Data source

Sports data is supplied by [TheSportsDB](https://www.thesportsdb.com/documentation).

The app uses the free development key (`123`) by default. For production, copy `.env.example` to `.env` and add your own API key:

```bash
VITE_SPORTSDB_API_KEY=your_key_here
```

The free API may return fewer upcoming or previous events than paid plans. The Europe page only displays competitions found in Celtic's returned event data.

## Run locally

```bash
npm install
npm run dev
```

Create a production build with:

```bash
npm run build
```

## Main files

- `src/api.js` — TheSportsDB client and European competition filtering
- `src/main.jsx` — application routes and UI components
- `src/styles.css` — responsive Celtic-themed visual design

## Disclaimer

This is an unofficial supporter project and is not affiliated with Celtic Football Club.
