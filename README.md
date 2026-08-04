# Celtic FC Supporters Hub

A fully static, responsive Celtic FC information hub hosted directly with GitHub Pages.

## Live site

https://deanderson96.github.io/celtic/

## Features

- Celtic club overview
- Upcoming fixtures and recent scores
- Scottish Premiership league table
- Searchable and filterable first-team squad
- Separate Europe page
- Europe page only displays UEFA Champions League, Europa League or Conference League events returned for Celtic
- Responsive design using `#172B23` as the primary background colour
- Partial-data and API-error handling

## Data

The site loads live sports data in the visitor's browser using TheSportsDB v1 API and its public free key.

The free API limits some endpoints, including the number of players and team events returned. The interface clearly handles those limitations rather than failing or displaying invented information.

## GitHub Pages

GitHub Pages serves the repository's `main` branch from the repository root. There is no build step, package installation, framework runtime or deployment workflow.

The complete site consists of:

- `index.html` — main Celtic hub
- `europe.html` — Celtic's UEFA competition page
- `README.md` — project documentation

Any update committed to `main` is published automatically by GitHub Pages.

## Disclaimer

This is an unofficial supporter project and is not affiliated with Celtic Football Club.
