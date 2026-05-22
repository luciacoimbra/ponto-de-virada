/* navigation.js — views, modais, intro */

const VIEWS = ['home-view', 'season-view', 'episode-view'];

function showOnly(id) {
  VIEWS.forEach(v => {
    const el = document.getElementById(v);
    if (el) el.classList.toggle('hidden', v !== id);
  });
}

function openSeason(seasonId = 'marcos') {
  loadSeason(`data/seasons/${seasonId}/meta.json`);
}

function goHome()       { showOnly('home-view'); }
function backToSeason() { showOnly('season-view'); }

/* ── Manifesto ── */
function openManifesto()  { document.getElementById('manifestoPopup').classList.add('open'); }
function closeManifesto() { document.getElementById('manifestoPopup').classList.remove('open'); }

/* ── Search ── */
function openSearch() {
  document.getElementById('searchModal').classList.add('open');
  document.getElementById('searchInput').focus();
}
function closeSearch() {
  document.getElementById('searchModal').classList.remove('open');
  document.getElementById('results').innerHTML = '';
  document.getElementById('searchInput').value = '';
}

/* ── Intro expand ── */
function toggleIntro() {
  const el  = document.getElementById('seasonIntro');
  const btn = document.getElementById('expandBtn');
  btn.textContent = el.classList.toggle('collapsed') ? '...mais' : 'mostrar menos';
}

/* ── Backdrop & ESC ── */
document.addEventListener('DOMContentLoaded', () => {

  document.getElementById('manifestoPopup').addEventListener('click', function(e) {
    if (e.target === this) closeManifesto();
  });

  document.getElementById('searchModal').addEventListener('click', function(e) {
    if (e.target === this) closeSearch();
  });

  document.getElementById('scriptureModal').addEventListener('click', function(e) {
    if (e.target === this) closeScripture();
  });

  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') { closeManifesto(); closeSearch(); closeScripture(); }
  });

});

document.addEventListener('DOMContentLoaded', () => {
  showOnly('home-view');
});