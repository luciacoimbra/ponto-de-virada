function goToNextBlock() {

  const items =
    document.querySelectorAll('.timeline-item');

  if (!items.length) return;

  const isLast =
    AppState.timeline.current === items.length - 1;

  if (isLast) {

    const leaderArea =
      document.querySelector('.leader-tools');

    if (leaderArea) {

      leaderArea.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }

    return;
  }

  toggleTimeline(AppState.timeline.current + 1);
}

function goToPreviousBlock() {

  const prev =
    Math.max(
      AppState.timeline.current - 1,
      0
    );

  toggleTimeline(prev);
}

function updateTimelineStates() {

  const items =
    document.querySelectorAll('.timeline-item');

  items.forEach((item, index) => {

    item.classList.remove(
      'is-current',
      'is-completed',
      'is-future'
    );

    if (index === AppState.timeline.current) {

      item.classList.add('is-current');
      item.classList.remove('hidden');

    } else {

      item.classList.add(
        index < AppState.timeline.current
          ? 'is-completed'
          : 'is-future'
      );

      item.classList.add('hidden');
    }
  });
}

function renderEpisodeNavigation() {

  return `

    <div class="episode-navigation">

      <button
        class="episode-nav-btn"
        onclick="goToPreviousBlock()"
      >

        anterior

      </button>

      <div class="episode-progress">

        <div
          class="episode-progress-bar"
          id="episode-progress-bar"
        ></div>

      </div>

      <button
        class="episode-nav-btn"
        onclick="goToNextBlock()"
      >

        próximo

      </button>

    </div>
  `;
}

function updateEpisodeProgress() {

  const items =
    document.querySelectorAll('.timeline-item');

  const progress =
    document.getElementById('episode-progress-bar');

  const nextBtn =
    document.querySelector(
      '.episode-navigation .episode-nav-btn:last-child'
    );

  if (!progress || !items.length) return;

  const percentage =
    ((AppState.timeline.current + 1) / items.length) * 100;

  progress.style.width = `${percentage}%`;

  if (nextBtn) {

    const isLast =
      AppState.timeline.current === items.length - 1;

    nextBtn.textContent =
      isLast ? 'fechar' : 'próximo';
  }
}

function toggleTimeline(index) {

  const items =
    document.querySelectorAll('.timeline-item');

  if (!items.length) return;

  AppState.timeline.current =
    Math.max(
      0,
      Math.min(index, items.length - 1)
    );

  updateTimelineStates();

  updateEpisodeProgress();

  requestAnimationFrame(() => {

    requestAnimationFrame(() => {

      const currentItem =
        document.querySelector('.timeline-item.is-current');

      if (!currentItem) return;

      const headerOffset = 90;

      const y =
        currentItem.getBoundingClientRect().top +
        window.scrollY -
        headerOffset;

      window.scrollTo({
        top: y,
        behavior: 'smooth'
      });
    });
  });
}

window.goToNextBlock = goToNextBlock;
window.goToPreviousBlock = goToPreviousBlock;
window.updateTimelineStates = updateTimelineStates;
window.renderEpisodeNavigation = renderEpisodeNavigation;
window.updateEpisodeProgress = updateEpisodeProgress;
window.toggleTimeline = toggleTimeline;