/* search.js — busca nos episódios carregados */

function performSearch() {
  const q         = document.getElementById('searchInput').value.toLowerCase().trim();
  const container = document.getElementById('results');
  container.innerHTML = '';

  if (q.length < 2) return;

  const episodes = getLoadedEpisodes();

  if (episodes.length === 0) {
    container.innerHTML = '<p style="color:var(--soft);font-size:14px;padding:8px 0;">Abra uma temporada antes de pesquisar.</p>';
    return;
  }

  const found = episodes.filter(ep => {
    const blocksText = (ep.blocks || []).map(b =>
      b.title + ' ' +
      (b.content || []).join(' ') +
      (b.questions || []).join(' ') +
      (b.closing || '') +
      (b.scripture ? b.scripture.highlight + ' ' + b.scripture.full_text : '') +
      (b.beyond ? Object.values(b.beyond).join(' ') : '') +
      (b.playlist ? b.playlist.map(t => t.title + ' ' + t.artist).join(' ') : '')
    ).join(' ');

    return (ep.title + ' ' + ep.subtitle + ' ' + blocksText).toLowerCase().includes(q);
  });

  if (found.length === 0) {
    container.innerHTML = '<p style="color:var(--soft);font-size:14px;padding:8px 0;">Nenhum resultado encontrado.</p>';
    return;
  }

  found.forEach(ep => {
    const div = document.createElement('div');
    div.className = 'result';
    div.innerHTML = `<h4>${ep.title}</h4><p>${ep.subtitle}</p>`;
    div.addEventListener('click', () => {
      closeSearch();
      openEpisode(ep.id);
    });
    container.appendChild(div);
  });
}