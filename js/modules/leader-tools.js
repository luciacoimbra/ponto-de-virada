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

<div class="leader-actions">
  <button
    class="btn btn-gold leader-save-btn"
    onclick="saveLeaderNotes(${id})"
  >
    salvar notas
  </button>
</div>

<div
  id="leader-history-${id}"
  class="leader-history"
></div>

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
  class="btn btn-gold complete-episode-btn"
  onclick="toggleEpisodeCompleted(${id})"
>
  ${isEpisodeCompleted(id) ? 'Episódio concluído ✓' : 'Marcar episódio como concluído'}
</button>

  <button
  class="btn btn-gold export-btn"
  onclick="exportEpisodeSummary(${id})"
>

  Compartilhar

</button>

</div>
      
<div class="episode-bottom-links">
  <button onclick="backToSeason()">
    ← voltar para temporada
  </button>

  <button onclick="openNextEpisode()">
    próximo episódio →
  </button>
</div>

    </section>
  `;
}

function saveLeaderNotes(id) {
  const textarea = document.getElementById(`leader-notes-${id}`);
  if (!textarea) return;

  const value = textarea.value.trim();
  if (!value) return;

  const notes = Storage.getNotes(id);

  notes.unshift({
    text: value,
    date: new Date().toLocaleString()
  });

  Storage.saveNotes(id, notes);

  textarea.value = '';
  loadLeaderHistory(id);

  const btn = document.querySelector('.leader-save-btn');

  if (btn) {
    const original = btn.textContent;
    btn.textContent = 'salvo ✓';

    setTimeout(() => {
      btn.textContent = original;
    }, 1800);
  }
}

function addPrayer(id) {
  const input = document.getElementById(`prayer-input-${id}`);
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
  const container = document.getElementById(`prayer-list-${id}`);
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
  const container = document.getElementById(`leader-history-${id}`);
  if (!container) return;

  const notes = Storage.getNotes(id);

  if (!notes.length) {
    container.innerHTML = '';
    return;
  }

  container.innerHTML = `
    <div class="leader-history-title">
      notas salvas
    </div>

    ${notes.map((note, index) => `
      <div class="leader-history-item">
        <button
          class="leader-note-remove"
          onclick="removeLeaderNote(${id}, ${index})"
        >
          ✕
        </button>

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

function removeLeaderNote(id, index) {
  const notes = Storage.getNotes(id);

  notes.splice(index, 1);
  Storage.saveNotes(id, notes);

  loadLeaderHistory(id);
}

window.renderLeaderArea = renderLeaderArea;
window.saveLeaderNotes = saveLeaderNotes;
window.addPrayer = addPrayer;
window.removePrayer = removePrayer;
window.loadPrayerRequests = loadPrayerRequests;
window.loadLeaderHistory = loadLeaderHistory;
window.removeLeaderNote = removeLeaderNote;