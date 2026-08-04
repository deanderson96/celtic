const API_KEY = import.meta.env.VITE_SPORTSDB_API_KEY || '123';
const API_ROOT = `https://www.thesportsdb.com/api/v1/json/${API_KEY}`;
const CELTIC_NAME = 'Celtic';
const EUROPE_NAMES = ['champions league', 'europa league', 'conference league', 'uefa'];

async function request(path) {
  const response = await fetch(`${API_ROOT}/${path}`);
  if (!response.ok) throw new Error(`TheSportsDB request failed (${response.status})`);
  return response.json();
}

export async function getCelticTeam() {
  const data = await request(`searchteams.php?t=${encodeURIComponent(CELTIC_NAME)}`);
  const teams = data.teams || [];
  return teams.find((team) => team.strTeam === 'Celtic') || teams[0] || null;
}

export async function getPlayers(teamId) {
  const data = await request(`lookup_all_players.php?id=${teamId}`);
  return data.player || [];
}

export async function getNextEvents(teamId) {
  const data = await request(`eventsnext.php?id=${teamId}`);
  return data.events || [];
}

export async function getPreviousEvents(teamId) {
  const data = await request(`eventslast.php?id=${teamId}`);
  return data.results || [];
}

export function isEuropeanEvent(event) {
  const haystack = `${event.strLeague || ''} ${event.strEvent || ''}`.toLowerCase();
  return EUROPE_NAMES.some((name) => haystack.includes(name));
}

export function formatDate(date, time) {
  if (!date) return 'TBC';
  const value = new Date(`${date}T${time || '15:00:00'}`);
  if (Number.isNaN(value.getTime())) return date;
  return new Intl.DateTimeFormat('en-GB', {
    weekday: 'short', day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit'
  }).format(value);
}
