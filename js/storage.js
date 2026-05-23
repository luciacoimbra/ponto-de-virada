/* storage.js — camada única de persistência */

const Storage = {
  keys: {
    PROGRESS: 'episode-progress',
    PRAYERS: (id) => `prayers-${id}`,
    NOTES: (id) => `leader-notes-history-${id}`
  },

  /* ─────────────────────────────
     PROGRESSO
  ───────────────────────────── */

  getProgress() {
    return JSON.parse(localStorage.getItem(this.keys.PROGRESS) || '{}');
  },

  saveProgress(progress) {
    localStorage.setItem(this.keys.PROGRESS, JSON.stringify(progress));
  },

  markEpisodeCompleted(id, data) {
    const progress = this.getProgress();

    progress[id] = {
      ...(progress[id] || {}),
      ...data,
    };

    this.saveProgress(progress);
  },

  /* ─────────────────────────────
     PRAYERS
  ───────────────────────────── */

  getPrayers(id) {
    return JSON.parse(localStorage.getItem(this.keys.PRAYERS(id)) || '[]');
  },

  savePrayers(id, list) {
    localStorage.setItem(this.keys.PRAYERS(id), JSON.stringify(list));
  },

  /* ─────────────────────────────
     NOTES
  ───────────────────────────── */

  getNotes(id) {
    return JSON.parse(localStorage.getItem(this.keys.NOTES(id)) || '[]');
  },

  saveNotes(id, list) {
    localStorage.setItem(this.keys.NOTES(id), JSON.stringify(list));
  }
};