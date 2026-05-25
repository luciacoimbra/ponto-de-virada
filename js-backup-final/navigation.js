/* ══════════════════════════════════════
   NAVIGATION (TELAS)
══════════════════════════════════════ */

const VIEWS = ['home-view', 'season-view', 'episode-view'];

function showOnly(id) {
  VIEWS.forEach(v => {
    const el = document.getElementById(v);
    if (el) el.classList.toggle('hidden', v !== id);
  });
}

function goHome() {
  showOnly('home-view');
}

function backToSeason() {
  collapseSeasonIntro();
  collapseSeasonIntro();
showOnly('season-view');
}

function openSeason(seasonId = 'marcos') {
  loadSeason(`data/seasons/${seasonId}/meta.json`);
}

/* ══════════════════════════════════════
   MODALS
══════════════════════════════════════ */

function openManifesto() {
  document.getElementById('manifestoPopup').classList.add('open');
}

function closeManifesto() {
  document.getElementById('manifestoPopup').classList.remove('open');
}

function openSearch() {
  document.getElementById('searchModal').classList.add('open');
  document.getElementById('searchInput').focus();
}

function closeSearch() {
  document.getElementById('searchModal').classList.remove('open');
  document.getElementById('results').innerHTML = '';
  document.getElementById('searchInput').value = '';
}

function closeScripture() {
  document.getElementById('scriptureModal').classList.remove('open');
}

/* ══════════════════════════════════════
   UI BEHAVIOR (GLOBAL EVENTS)
══════════════════════════════════════ */

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
    if (e.key === 'Escape') {
      closeManifesto();
      closeSearch();
      closeScripture();
    }
  });

  showOnly('home-view');
});

function toggleIntro() {
  const intro = document.getElementById('seasonIntro');
  const btn = document.getElementById('expandBtn');

  if (!intro || !btn) return;

  const isCollapsed = intro.classList.toggle('collapsed');

  btn.textContent = isCollapsed
    ? '...mais'
    : 'mostrar menos';
}

function collapseSeasonIntro() {
  const intro = document.getElementById('seasonIntro');
  const btn = document.getElementById('expandBtn');

  if (!intro || !btn) return;

  intro.classList.add('collapsed');
  btn.textContent = '...mais';
}