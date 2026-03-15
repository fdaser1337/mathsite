export const CONFIG = {
  SEARCH_LIMIT: 10,
  ANIMATION_DURATION: 300,
  STORAGE_KEYS: {
    THEME: 'mathlab-theme',
    BOOKMARKS: 'mathlab-bookmarks',
    PROGRESS: 'mathlab-progress',
    NOTES: 'mathlab-notes'
  },
  API_ENDPOINTS: {
    THEOREMS: '/data/theorems.json',
    EXERCISES: '/data/exercises.json',
    RELATIONS: '/data/relations.json'
  },
  UI: {
    MOBILE_BREAKPOINT: 768,
    TABLET_BREAKPOINT: 1024,
    DEBOUNCE_DELAY: 300
  },
  MATH: {
    MATHJAX_CONFIG: {
      tex: {
        inlineMath: [['$', '$'], ['\\(', '\\)']]
      }
    }
  }
};
