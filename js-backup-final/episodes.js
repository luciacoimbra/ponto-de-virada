/* ══════════════════════════════════════
   LOAD SEASON
══════════════════════════════════════ */
async function loadSeason(file) {
  try {
    const res = await fetch(file);
    if (!res.ok) throw new Error('Arquivo não encontrado: ' + file);
    const season = await res.json();
setSeason(season);
    buildEpisodeList();
    document.addEventListener('click', (e) => {
  const card = e.target.closest('.episode-card');
  if (!card) return;

  const id = Number(card.dataset.id);
  if (!id) return;

  const ep =
    AppState.season.episodes.find(e => e.id === id);

  if (ep?.status === 'coming-soon') return;

  openEpisode(id);
});
    updateSeasonCTA();
    showOnly('season-view');
  } catch (err) {
    console.error('Erro ao carregar temporada:', err);
    alert('Não foi possível carregar a temporada. Verifique sua conexão.');
  }
}

/* ══════════════════════════════════════
   BUILD EPISODE LIST (season view)
══════════════════════════════════════ */
function buildEpisodeList() {
  if (!AppState.season) return;

  const container = document.getElementById('episodeList');
  if (!container) return;

  container.innerHTML = AppState.season.episodes.map(ep => `
  <div
    class="episode-card ${ep.status === 'coming-soon' ? 'coming-soon' : ''}"
    data-id="${ep.id}"
  >

    ${ep.status === 'coming-soon'
      ? '<div class="coming-soon-badge">em breve</div>'
      : ''
    }

    ${isEpisodeCompleted(ep.id)
      ? '<div class="episode-completed">concluído</div>'
      : ''
    }

    <img
      src="${ep.img}"
      class="episode-image"
      alt="Episódio ${ep.id} — ${ep.title}"
      loading="lazy"
    >

    <div class="episode-card-content">
      <div class="episode-number">EPISÓDIO ${ep.id}</div>
      <h3>${ep.title}</h3>
      <p>${ep.subtitle}</p>
    </div>
  </div>
`).join('');
}

/* ══════════════════════════════════════
   OPEN EPISODE
══════════════════════════════════════ */
async function openEpisode(id) {

  if (!AppState.season) return;

  const epMeta =
    AppState.season.episodes.find(e => e.id === id);

  if (!epMeta) {
    alert('Episódio não encontrado');
    return;
  }

  try {

    const response = await fetch(epMeta.file);

    if (!response.ok) {
      throw new Error('Erro ao carregar episódio');
    }

    const ep = await response.json();
    setEpisode(ep);

    const hero = `
      <div class="episode-hero"
           style="background-image:url('${ep.img}')">

        <div class="episode-overlay"></div>

        <div class="episode-hero-content">

          <div class="episode-kicker">
            EPISÓDIO ${ep.id}
          </div>

          <h1>${ep.title}</h1>

          <p>${ep.subtitle}</p>

        </div>
      </div>
    `;

    const summary = ep.summary
  ? `
    <section class="episode-summary">
      <p>${ep.summary}</p>
    </section>
  `
  : '';
  
    const scripture =
      renderScriptureHighlight(
        ep.scriptureHighlight
    );


    const blocks = ep.blocks.map((block, index) =>
  renderBlock(block, index)
).join('');

    document.getElementById(
  'episodeContent'
).innerHTML =
  hero +
  summary +
  scripture +
  blocks +
  renderEpisodeNavigation() +
  renderLeaderArea(ep.id);

setTimeout(() => {

  loadLeaderHistory(ep.id);

  loadPrayerRequests(ep.id);

}, 0);

    showOnly('episode-view');

    AppState.timeline.current = 0;

    updateTimelineStates();

  } catch(error) {

    console.error(error);

    alert('Não foi possível abrir o episódio.');

  }
}

/* ══════════════════════════════════════
   RENDER BLOCK — detecta tipo e renderiza
══════════════════════════════════════ */
function renderScriptureHighlight(scripture) {

  if (!scripture) return '';

  AppState.scripture = scripture;

  return `

    <section class="scripture-highlight">

      <div class="scripture-inner"
           onclick="openScriptureModal()">

        <div class="scripture-reference">

          ${scripture.reference}

        </div>

        <div class="scripture-verse">

  <span class="verse-text">
    “${scripture.verse}”
  </span>

  <span class="verse-reference-inline">
    ${scripture.highlightVerse}
  </span>

</div>

        <div class="scripture-read-more">

          ler passagem completa

        </div>

      </div>

    </section>
  `;
}

function renderBlock(block, index) {

  const subtitle = block.subtitle
    ? `<p class="timeline-subtitle">${block.subtitle}</p>`
    : '';

  const paragraphs = (block.content || [])
    .map(p => `<p>${p}</p>`)
    .join('');

  const steps = (block.steps || [])
    .map((step, i) => `
      <div class="leader-step">
        <div class="leader-step-number">${i + 1}</div>
        <div>
          <h3>${step.title}</h3>
          <p>${step.text}</p>
        </div>
      </div>
    `)
    .join('');

  const questions = (block.questions || [])
    .map((q, i) => `
      <div class="question-card">
        <div class="question-number">Pergunta ${i + 1}</div>
        <p>${q}</p>
      </div>
    `)
    .join('');

  return `
    <section class="timeline-item" data-index="${index}">

      <div class="timeline-marker">
        <div class="timeline-dot"></div>
        <div class="timeline-line"></div>
      </div>

      <div class="timeline-content">

        <div class="timeline-label">
          ${block.label || ''}
        </div>

        <h2 class="timeline-title">
          ${block.title || ''}
        </h2>

        ${subtitle}

        <div class="timeline-preview">
          ${steps}
          ${questions}
          ${paragraphs}
        </div>

      </div>
    </section>
  `;
}

/* ══════════════════════════════════════
   UTILS
══════════════════════════════════════ */
function escAttr(str) {
  return (str || '').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
}

/* ══════════════════════════════════════
   SEARCH SUPPORT — expõe dados ao search.js
══════════════════════════════════════ */
function getLoadedEpisodes() {
  return AppState.season ? AppState.season.episodes : [];
}

function isEpisodeCompleted(id) {
  const progress = Storage.getProgress();
  return !!progress[id]?.completed;
}

function updateSeasonCTA() {
  const button = document.getElementById('seasonCTA');
  if (!button) return;

  const progress = Storage.getProgress();

  const hasProgress = Object.keys(progress)
    .some(id => progress[id]?.completed);

  button.textContent = hasProgress
    ? 'próximo episódio'
    : 'entrar na temporada';
}

function saveEpisodeProgress(index) {

  const ep = window.AppState?.episode;
  if (!ep) return;

  const progress = Storage.getProgress();

  if (!progress[ep.id]) {
    progress[ep.id] = {
      completed: false,
      lastIndex: 0
    };
  }

  progress[ep.id].lastIndex = index + 1;

  const total = ep.blocks?.length || 0;

  if (progress[ep.id].lastIndex >= total) {
    progress[ep.id].completed = true;
  }

  Storage.saveProgress(progress);

  updateTimelineProgress();
}

function updateTimelineProgress() {

  const items =
    document.querySelectorAll('.timeline-item');

  const ep = AppState.episode;

  if (!ep) return;

  const progress =
    Storage.getProgress();

  const episodeData =
    progress[ep.id] || {};

  const lastIndex =
    episodeData.lastIndex || 0;

  items.forEach((item) => {

    const index =
      Number(item.dataset.index);

    item.classList.remove(
      'is-future',
      'is-current',
      'is-completed'
    );

    if (episodeData.completed) {

      item.classList.add('is-completed');
      return;
    }

    if (index < lastIndex - 1) {

      item.classList.add('is-completed');

    } else if (index === lastIndex - 1) {

      item.classList.add('is-current');

    } else {

      item.classList.add('is-future');
    }

  });
}

function markEpisodeAsCompleted(id) {

  const progress =
    Storage.getProgress();

  const ep =
    AppState.episode;

  const totalBlocks =
    ep?.blocks?.length || 0;

  progress[id] = {
    completed: true,
    lastIndex: totalBlocks
  };

  Storage.saveProgress(progress);

  updateSeasonCTA();
}

function getNextEpisode() {

  const season = AppState.season;

  if (!season) return null;

  const progress = Storage.getProgress();

const completed = Object.keys(progress)
  .filter(id => progress[id]?.completed);

  return season.episodes.find(
    ep => !completed.includes(ep.id)
  );
}

function markBlockAsRead(index) {

  const ep = AppState.episode;

  if (!ep) return;

  const progress = Storage.getProgress();

  if (!progress[ep.id]) {

    progress[ep.id] = {
      completed: false,
      lastIndex: 0
    };
  }

  if (index + 1 > progress[ep.id].lastIndex) {

    progress[ep.id].lastIndex = index + 1;
  }

  Storage.saveProgress(progress);

  updateTimelineProgress();
}

function toggleEpisodeCompleted(id) {

  const progress = Storage.getProgress();
  const ep = AppState.episode;
  const totalBlocks = ep?.blocks?.length || 0;

  const isCompleted =
    !!progress[id]?.completed;

  progress[id] = {
    completed: !isCompleted,
    lastIndex: !isCompleted ? totalBlocks : 0
  };

  Storage.saveProgress(progress);

  updateSeasonCTA();
  buildEpisodeList();

  const btn =
    document.querySelector('.complete-episode-btn');

  if (btn) {
  btn.textContent = !isCompleted
    ? 'Episódio concluído ✓'
    : 'Marcar episódio como concluído';

  btn.classList.toggle('completed', !isCompleted);
}
}

function openNextEpisode() {
  const current = AppState.episode;
  const season = AppState.season;

  if (!current || !season) return;

  const next = season.episodes.find(ep => ep.id === current.id + 1);

  if (!next || next.status === 'coming-soon') {
    alert('Próximo episódio em breve.');
    return;
  }

  openEpisode(next.id);
}

window.loadSeason = loadSeason;
window.openEpisode = openEpisode;
window.updateSeasonCTA = updateSeasonCTA;