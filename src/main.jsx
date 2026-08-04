import React, { useEffect, useMemo, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { HashRouter, NavLink, Route, Routes } from 'react-router-dom';
import { formatDate, getCelticTeam, getNextEvents, getPlayers, getPreviousEvents, isEuropeanEvent } from './api';
import './styles.css';

const placeholderBadge = 'https://www.thesportsdb.com/images/media/team/badge/9n1m4a1534886499.png';

function Layout({ children }) {
  return <div className="app-shell">
    <header className="topbar">
      <NavLink className="brand" to="/"><span className="shamrock">☘</span><span><strong>Celtic FC</strong><small>Supporters Hub</small></span></NavLink>
      <nav><NavLink to="/">Home</NavLink><NavLink to="/europe">Europe</NavLink></nav>
    </header>
    {children}
    <footer><div><strong>Celtic FC Supporters Hub</strong><p>Unofficial fan project. Not affiliated with Celtic Football Club.</p></div><a href="https://www.thesportsdb.com" target="_blank" rel="noreferrer">Data by TheSportsDB</a></footer>
  </div>;
}

function Empty({ children }) { return <div className="empty">{children}</div>; }
function Loading() { return <div className="loading"><span></span><span></span><span></span></div>; }

function MatchCard({ event, result = false }) {
  const score = result && event.intHomeScore != null ? `${event.intHomeScore} – ${event.intAwayScore}` : 'vs';
  return <article className="match-card">
    <div className="match-meta"><span>{event.strLeague || 'Competition TBC'}</span><span>{formatDate(event.dateEvent, event.strTime)}</span></div>
    <div className="teams"><strong>{event.strHomeTeam}</strong><b>{score}</b><strong>{event.strAwayTeam}</strong></div>
    <p>{event.strVenue || 'Venue TBC'}</p>
  </article>;
}

function Home({ data, loading, error }) {
  const [query, setQuery] = useState('');
  const players = useMemo(() => data.players.filter(p => `${p.strPlayer} ${p.strPosition}`.toLowerCase().includes(query.toLowerCase())), [data.players, query]);
  if (loading) return <main><Loading /></main>;
  return <main>
    <section className="hero wrap">
      <div><p className="eyebrow">One club. One hub.</p><h1>Everything Celtic, together.</h1><p className="lead">Fixtures, results, squad information and the Bhoys' European journey in one central dashboard.</p><div className="actions"><a className="button primary" href="#fixtures">View fixtures</a><NavLink className="button secondary" to="/europe">Celtic in Europe</NavLink></div></div>
      <article className="club-card"><img src={data.team?.strBadge || placeholderBadge} alt="Celtic badge"/><div><p className="eyebrow">The Bhoys</p><h2>{data.team?.strTeam || 'Celtic FC'}</h2><p>{data.team?.strStadium || 'Celtic Park'} · {data.team?.intFormedYear || '1887'}</p><span className="pill">{data.team?.strLeague || 'Scottish Premiership'}</span></div></article>
    </section>
    {error && <div className="notice wrap">Live data is temporarily unavailable. The page will work once TheSportsDB responds or a valid API key is configured.</div>}
    <section className="stats-strip"><div><span>Next match</span><strong>{data.next[0]?.strEvent || 'TBC'}</strong></div><div><span>Latest score</span><strong>{data.previous[0] ? `${data.previous[0].intHomeScore}–${data.previous[0].intAwayScore}` : 'TBC'}</strong></div><div><span>European status</span><strong>{[...data.next, ...data.previous].some(isEuropeanEvent) ? 'Active campaign' : 'No current fixtures'}</strong></div></section>
    <Section id="fixtures" eyebrow="Coming up" title="Fixtures">{data.next.length ? <div className="match-grid">{data.next.map(e => <MatchCard key={e.idEvent} event={e}/>)}</div> : <Empty>No upcoming fixtures were returned by the API.</Empty>}</Section>
    <Section eyebrow="Full time" title="Recent results" alternate>{data.previous.length ? <div className="match-grid">{data.previous.map(e => <MatchCard key={e.idEvent} event={e} result/>)}</div> : <Empty>No recent results were returned by the API.</Empty>}</Section>
    <Section eyebrow="The Bhoys" title="First-team squad"><label className="search">Search players<input value={query} onChange={e => setQuery(e.target.value)} placeholder="Name or position"/></label>{players.length ? <div className="squad-grid">{players.map(player => <article className="player" key={player.idPlayer}><div className="player-image">{player.strCutout || player.strThumb ? <img src={player.strCutout || player.strThumb} alt=""/> : <span>{player.strPlayer?.split(' ').map(n=>n[0]).join('').slice(0,2)}</span>}</div><div><h3>{player.strPlayer}</h3><p>{player.strPosition || 'Player'}</p><small>{player.strNationality || ''}</small></div></article>)}</div> : <Empty>No players match your search.</Empty>}</Section>
  </main>;
}

function Section({ id, eyebrow, title, alternate, children }) { return <section id={id} className={`section ${alternate ? 'alternate' : ''}`}><div className="wrap"><div className="section-title"><p className="eyebrow">{eyebrow}</p><h2>{title}</h2></div>{children}</div></section>; }

function Europe({ data, loading }) {
  if (loading) return <main><Loading /></main>;
  const europeanNext = data.next.filter(isEuropeanEvent);
  const europeanPrevious = data.previous.filter(isEuropeanEvent);
  const all = [...europeanNext, ...europeanPrevious];
  const competition = all[0]?.strLeague;
  return <main>
    <section className="europe-hero"><div className="wrap"><p className="eyebrow">Celtic in Europe</p><h1>{competition || 'European football'}</h1><p className="lead">This page only displays UEFA competitions in which Celtic have fixtures returned by TheSportsDB.</p></div></section>
    <Section eyebrow="Current campaign" title={competition || 'No active competition found'}>{all.length ? <><div className="campaign-card"><span className="pill">UEFA</span><h3>{competition}</h3><p>{europeanNext.length} upcoming · {europeanPrevious.length} completed</p></div>{europeanNext.length > 0 && <><h3 className="subheading">Upcoming</h3><div className="match-grid">{europeanNext.map(e => <MatchCard key={e.idEvent} event={e}/>)}</div></>}{europeanPrevious.length > 0 && <><h3 className="subheading">Results</h3><div className="match-grid">{europeanPrevious.map(e => <MatchCard key={e.idEvent} event={e} result/>)}</div></>}</> : <Empty>Celtic do not currently have Champions League, Europa League or Conference League events in the available API response.</Empty>}</Section>
  </main>;
}

function App() {
  const [state, setState] = useState({ team: null, players: [], next: [], previous: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  useEffect(() => { (async () => { try { const team = await getCelticTeam(); if (!team) throw new Error('Celtic team not found'); const [players, next, previous] = await Promise.all([getPlayers(team.idTeam), getNextEvents(team.idTeam), getPreviousEvents(team.idTeam)]); setState({ team, players, next, previous }); } catch (e) { setError(e.message); } finally { setLoading(false); } })(); }, []);
  return <Layout><Routes><Route path="/" element={<Home data={state} loading={loading} error={error}/>}/><Route path="/europe" element={<Europe data={state} loading={loading}/>}/></Routes></Layout>;
}

createRoot(document.getElementById('root')).render(<React.StrictMode><HashRouter><App /></HashRouter></React.StrictMode>);
