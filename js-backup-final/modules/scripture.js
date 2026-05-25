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

window.openScriptureModal = openScriptureModal;
window.closeScriptureModal = closeScriptureModal;