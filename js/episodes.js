/* episodes.js — carrega temporada via fetch e renderiza episódios */

const AppState = {
  season: null,
  episode: null,
  scripture: null
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
  <div class="episode-card" data-id="${ep.id}">
    ${isEpisodeCompleted(ep.id)
  ? '<div class="episode-completed">concluído</div>'
  : ''}
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

    markEpisodeAsCompleted(id);

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
  renderLeaderArea(ep.id);

showOnly('episode-view');
updateTimelineProgress();

setTimeout(() => {

  loadLeaderHistory(ep.id);

  loadPrayerRequests(ep.id);

}, 0);

    showOnly('episode-view');

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

  const paragraphs = (block.content || [])
    .map(p => `<p>${p}</p>`)
    .join('');

  const questions = (block.questions || [])
    .map(q => `<li>${q}</li>`)
    .join('');

  let state = 'future';

  if (index === 0) {
    state = 'current';
  }

  return `
    <section class="timeline-item ${state}" data-index="${index}">

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

        <div class="timeline-preview line-clamp">
          ${paragraphs}
        </div>

        ${questions ? `
          <div class="discussion-list">
            <ol>
              ${questions}
            </ol>
          </div>
        ` : ''}

        <button class="timeline-more">
          mais
        </button>

      </div>
    </section>
  `;
}

/* ══════════════════════════════════════
   SCRIPTURE MODAL
══════════════════════════════════════ */
function openScripture(btn) {
  const ref  = btn.getAttribute('data-ref');
  const text = btn.getAttribute('data-text');

  document.getElementById('scriptureRef').textContent  = ref;
  document.getElementById('scriptureText').textContent = text;
  document.getElementById('scriptureModal').classList.add('open');
}

function closeScripture() {
  document.getElementById('scriptureModal').classList.remove('open');
}

/* ══════════════════════════════════════
   TOGGLE BLOCK
══════════════════════════════════════ */
function toggleBlock(button) {
  const block     = button.closest('.cinematic-block');
  const container = document.getElementById('episodeContent');
  const isActive  = block.classList.contains('active');

  container.querySelectorAll('.cinematic-block').forEach(b => b.classList.remove('active'));
  if (!isActive) block.classList.add('active');
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

  const progress = Storage.getProgress(id);

  return progress.completed;
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

function openScriptureModal() {

  const scripture = AppState.scripture;

  if (!scripture) return;

  const formattedText =
    scripture.fullText
      .split('\n\n')
      .map(p => `<p>${p}</p>`)
      .join('');

  const modal = document.createElement('div');

  modal.className = 'scripture-modal';

  modal.innerHTML = `

    <div class="scripture-modal-overlay"
         onclick="closeScriptureModal()"></div>

    <div class="scripture-modal-content">

      <button class="scripture-close"
              onclick="closeScriptureModal()">

        ✕

      </button>

      <div class="scripture-modal-header">

        ${scripture.reference}

      </div>

      <div class="scripture-modal-text">

        ${formattedText}

      </div>

    </div>
  `;

  document.body.appendChild(modal);
}

function closeScriptureModal() {

  const modal =
    document.querySelector('.scripture-modal');

  if (modal) modal.remove();
}

function renderLeaderArea(id) {

  return `

    <section class="leader-tools">

      <div class="card leader-card">

        <div class="leader-label">

          NOTAS DO LÍDER

        </div>

        <textarea
  id="leader-notes-${id}"
  class="leader-textarea"
  placeholder="Escreva observações, insights e direcionamentos..."
></textarea>

<div
  id="leader-history-${id}"
  class="leader-history"
></div>

<div class="leader-actions">

  <button
  class="btn btn-gold leader-save-btn"
  onclick="saveLeaderNotes(${id})"
>

    salvar notas

  </button>

</div>

      </div>

      <div class="card leader-card">

        <div class="leader-label">

          PEDIDOS DE ORAÇÃO

        </div>

        <div
          id="prayer-list-${id}"
          class="prayer-list"
        ></div>

        <div class="prayer-input-row">

          <input
            id="prayer-input-${id}"
            class="prayer-input"
            placeholder="Adicionar pedido..."
          />

          <button
            class="btn btn-gold prayer-add-btn"
            onclick="addPrayer(${id})"
          >

            adicionar

          </button>

        </div>

      </div>

<div class="export-actions">

  <button
  class="btn btn-gold export-btn"
  onclick="exportEpisodeSummary(${id})"
>

  Compartilhar

</button>

  <div
  id="export-card-${id}"
  class="export-card"
>

  <div class="export-overlay"></div>

  <div class="export-content">

    <div class="export-kicker">

      RESUMO DA CÉLULA

    </div>

    <div class="export-title">

      Episódio ${id}

    </div>

    <div
      id="export-prayers-${id}"
      class="export-prayers"
    ></div>

  </div>

</div>

</div>
      
    </section>
  `;
}

function saveLeaderNotes(id) {

  const textarea =
    document.getElementById(
      `leader-notes-${id}`
    );

  if (!textarea) return;

  const value =
    textarea.value.trim();

  if (!value) return;

  const notes = Storage.getNotes(id);

  notes.unshift({
    text: value,
    date: new Date().toLocaleString()
  });

  Storage.saveNotes(id, notes);

  textarea.value = '';

  loadLeaderHistory(id);

  const btn =
    document.querySelector(
      `.leader-save-btn`
    );

  if (btn) {

    const original =
      btn.textContent;

    btn.textContent =
      'salvo ✓';

    setTimeout(() => {

      btn.textContent =
        original;

    }, 1800);
  }
}

function loadLeaderNotes(id) {

  const saved =
    localStorage.getItem(
      `leader-notes-${id}`
    );

  if (!saved) return;

  const textarea =
    document.getElementById(
      `leader-notes-${id}`
    );

  if (textarea)
    textarea.value = saved;
}

function addPrayer(id) {

  const input =
    document.getElementById(
      `prayer-input-${id}`
    );

  if (!input.value.trim()) return;

  const prayers = Storage.getPrayers(id);

prayers.push(input.value);

Storage.savePrayers(id, prayers);

  input.value = '';

  loadPrayerRequests(id);
}

function removePrayer(id, index) {

  const prayers = Storage.getPrayers(id);

prayers.splice(index, 1);

Storage.savePrayers(id, prayers);

  loadPrayerRequests(id);
}

function loadPrayerRequests(id) {

  const container =
    document.getElementById(
      `prayer-list-${id}`
    );

  if (!container) return;

  const prayers = Storage.getPrayers(id);

  if (!prayers.length) {

    container.innerHTML = `

      <div class="empty-prayer">

        nenhum pedido registrado

      </div>
    `;

    return;
  }

  container.innerHTML = `

    <div class="prayer-history-title">

      pedidos registrados

    </div>

    ${prayers.map((p, index) => `

      <div class="prayer-item">

        <div class="prayer-text">

          ${p}

        </div>

        <button
          class="prayer-remove"
          onclick="removePrayer(${id}, ${index})"
        >

          ✕

        </button>

      </div>

    `).join('')}
  `;
}

function loadLeaderHistory(id) {

  const container =
    document.getElementById(
      `leader-history-${id}`
    );

  if (!container) return;

  const notes =
    JSON.parse(
      localStorage.getItem(
        `leader-notes-history-${id}`
      ) || '[]'
    );

  if (!notes.length) {

    container.innerHTML = '';

    return;
  }

  container.innerHTML = `

    <div class="leader-history-title">

      notas salvas

    </div>

    ${notes.map(note => `

      <div class="leader-history-item">

        <div class="leader-history-date">

          ${note.date}

        </div>

        <div class="leader-history-text">

          ${note.text}

        </div>

      </div>

    `).join('')}
  `;
}

function exportEpisodeSummary(id) {

  const ep =
    AppState.episode;

  if (!ep) return;

  const prayers =
    JSON.parse(
      localStorage.getItem(
        `prayers-${id}`
      ) || '[]'
    );

  const modal =
    document.createElement('div');

  modal.className =
    'share-modal';

  modal.innerHTML = `

    <div class="share-overlay"
         onclick="closeShareModal()"></div>

    <div class="share-modal-content">

      <button
        class="share-close"
        onclick="closeShareModal()"
      >

        ✕

      </button>

      <div
  id="share-card"
  class="share-card"
>

  <img
    src="${ep.img}"
    class="share-bg"
  />

  <div class="share-gradient"></div>

  <div class="share-content">

    <div class="share-meta">

      ${AppState.season?.title || ''}
      • Episódio ${ep.id}

    </div>

    <div class="share-title">

      ${ep.title}

    </div>

    <div class="share-scripture">

      ${ep.scriptureHighlight.reference}

    </div>

    <div class="share-verse">

      “${ep.scriptureHighlight.verse}”

      <span class="share-verse-ref">

        ${ep.scriptureHighlight.highlightVerse}

      </span>

    </div>

    <div class="share-summary">

      ${ep.summary || ''}

    </div>

    <div class="share-section-title">

      pedidos de oração

    </div>

    ${prayers.map(p => `

      <div class="share-prayer">

        • ${p}

      </div>

    `).join('')}

  </div>

</div>

      <button
        class="btn btn-glass download-share-btn"
        onclick="downloadShareCard()"
      >

        Baixar

      </button>

    </div>
  `;

  document.body.appendChild(modal);
}

async function downloadShareCard() {
  const card = document.getElementById('share-card');
  if (!card) return;

  const canvas = await html2canvas(card, {
    scale: window.devicePixelRatio || 2,
    useCORS: true,
    backgroundColor: '#000',
    windowWidth: card.scrollWidth,
    windowHeight: card.scrollHeight
  });

  const link = document.createElement('a');
  link.download = 'celula.png';
  link.href = canvas.toDataURL('image/png');
  link.click();
}

function closeShareModal() {

  const modal =
    document.querySelector(
      '.share-modal'
    );

  if (modal) modal.remove();
}

function updateTimelineProgress() {
  const items = document.querySelectorAll('.timeline-item');

  const ep = window.AppState?.episode;

  if (!ep) return;

  const progress = Storage.getProgress();

  const episodeData = progress[ep.id];

  const lastIndex = episodeData?.lastIndex ?? -1;

  items.forEach((item) => {

    const index = Number(item.dataset.index);

    item.classList.remove(
      'is-future',
      'is-current',
      'is-completed'
    );

    if (episodeData?.completed || index < lastIndex - 1) {

      item.classList.add('is-completed');

    } else if (index === lastIndex - 1) {

      item.classList.add('is-current');

    } else {

      item.classList.add('is-future');
    }

  });
}

function toggleTimeline(button) {

  const preview =
    button.parentElement.querySelector(
      '.timeline-preview'
    );

  if (!preview) return;

  const expanded =
    !preview.classList.contains('line-clamp');

  if (expanded) {

    preview.classList.add('line-clamp');

    button.textContent = 'mais';

  } else {

    preview.classList.remove('line-clamp');

    button.textContent = 'menos';
  }
}

function markEpisodeAsCompleted(id) {

  Storage.markEpisodeCompleted(id, {
  completed: true,
  lastIndex: Infinity
});

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

window.loadSeason = loadSeason;
window.openEpisode = openEpisode;
window.updateSeasonCTA = updateSeasonCTA;

document.addEventListener('click', (e) => {
  const btn = e.target.closest('.timeline-more');
  if (!btn) return;

  toggleTimeline(btn);
});