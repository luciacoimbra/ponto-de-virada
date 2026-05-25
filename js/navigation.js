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
  window.scrollTo({
  top: 0,
  behavior: 'smooth'
  
});
const intro = document.getElementById('seasonIntro');
const expandBtn = document.getElementById('expandBtn');

if (intro && expandBtn) {
  intro.classList.add('collapsed');
  expandBtn.textContent = '...mais';
}
}

function backToSeason() {
  collapseSeasonIntro();
  collapseSeasonIntro();
showOnly('season-view');
window.scrollTo({
  top: 0,
  behavior: 'smooth'
});
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

function showAppMessage(message) {
  const popup = document.createElement('div');

  popup.className = 'popup open';

  popup.innerHTML = `
    <div class="popup-card">
      <h2 class="font-display">Algo não carregou</h2>
      <p>${message}</p>
      <button class="close-btn" onclick="this.closest('.popup').remove()">
        Fechar ×
      </button>
    </div>
  `;

  document.body.appendChild(popup);
}

function openComingSoonEpisode() {
  showAppMessage(
    'Este episódio ainda está em desenvolvimento. Novas lições serão adicionadas em breve.'
  );
}