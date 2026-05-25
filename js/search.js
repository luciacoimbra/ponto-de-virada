/* search.js — busca nos episódios carregados */

async function performSearch() {
  const input = document.getElementById('searchInput');
  const results = document.getElementById('results');

  if (!input || !results) return;

  const term = input.value.trim().toLowerCase();

  if (!term) {
    results.innerHTML = '';
    return;
  }

  const episodes = getLoadedEpisodes();

  if (!episodes.length) {
    results.innerHTML = `
      <div class="result">
        <p>Entre na temporada antes de pesquisar.</p>
      </div>
    `;
    return;
  }

  const matches = [];

  for (const epMeta of episodes) {
    if (epMeta.status === 'coming-soon') continue;

    try {
      const response = await fetch(epMeta.file);
      const ep = await response.json();

      const searchableText = [
        ep.title,
        ep.subtitle,
        ep.summary,
        ep.challenge,
        ep.scriptureHighlight?.reference,
        ep.scriptureHighlight?.highlightVerse,
        ep.scriptureHighlight?.verse,
        ep.scriptureHighlight?.fullText,
        ...(ep.blocks || []).flatMap(block => [
          block.label,
          block.title,
          block.subtitle,
          ...(block.content || []),
          ...(block.questions || []),
          ...(block.steps || []).flatMap(step => [
            step.title,
            step.text
          ])
        ])
      ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase();

      if (searchableText.includes(term)) {
        matches.push({
  episode: ep,
  blockIndex: findMatchingBlockIndex(ep, term)
});
      }

    } catch (error) {
      console.warn('Erro ao buscar no episódio:', epMeta.file, error);
    }
  }

  if (!matches.length) {
    results.innerHTML = `
      <div class="result">
        <p>Nenhum resultado encontrado.</p>
      </div>
    `;
    return;
  }

  results.innerHTML = matches.map(match => `
  <div
    class="result"
    onclick="openEpisodeFromSearch(${match.episode.id}, ${match.blockIndex})"
  >
    <h4>${match.episode.title}</h4>
    <p>${match.episode.subtitle || match.episode.summary || ''}</p>
  </div>
`).join('');
}

function findMatchingBlockIndex(ep, term) {
  if (!ep.blocks || !term) return 0;

  const normalizedTerm = term.toLowerCase();

  const index = ep.blocks.findIndex(block => {
    const blockText = [
      block.label,
      block.title,
      block.subtitle,
      ...(block.content || []),
      ...(block.questions || []),
      ...(block.steps || []).flatMap(step => [
        step.title,
        step.text
      ])
    ]
      .filter(Boolean)
      .join(' ')
      .toLowerCase();

    return blockText.includes(normalizedTerm);
  });

  return index >= 0 ? index : 0;
}

async function openEpisodeFromSearch(id, blockIndex = 0) {
  closeSearch();

  await openEpisode(id);

  setTimeout(() => {
    toggleTimeline(blockIndex);
  }, 150);
}