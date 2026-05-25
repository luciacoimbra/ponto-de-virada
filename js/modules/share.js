function exportEpisodeSummary(id) {

  const ep = AppState.episode;

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

    <div class="share-challenge-label">
  desafio da semana
</div>

<div class="share-challenge">
  ${ep.challenge || ''}
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

  const card =
    document.getElementById('share-card');

  if (!card) return;

  const canvas =
    await html2canvas(card, {
      scale: window.devicePixelRatio || 2,
      useCORS: true,
      backgroundColor: '#000',
      windowWidth: card.scrollWidth,
      windowHeight: card.scrollHeight
    });

  const link =
    document.createElement('a');

  link.download = 'celula.png';

  link.href =
    canvas.toDataURL('image/png');

  link.click();
}

function closeShareModal() {

  const modal =
    document.querySelector('.share-modal');

  if (modal) modal.remove();
}

window.exportEpisodeSummary = exportEpisodeSummary;
window.downloadShareCard = downloadShareCard;
window.closeShareModal = closeShareModal;