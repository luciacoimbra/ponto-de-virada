/* episodes.js — carrega temporada via fetch e renderiza episódios */

const AppState = {
  season: null,
  episode: null,
  scripture: null,

  timeline: {
    current: 0
  }
};

function setSeason(season) {
  AppState.season = season;
}

function setEpisode(episode) {
  AppState.episode = episode;
}

function setScripture(scripture) {
  AppState.scripture = scripture;
}

window.AppState = AppState;
window.setSeason = setSeason;
window.setEpisode = setEpisode;
window.setScripture = setScripture;