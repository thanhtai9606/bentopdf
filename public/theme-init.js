(function () {
  var THEME_KEY = 'bentopdf-theme';
  var LOCALE_KEY = 'bentopdf-locale';
  var pref = localStorage.getItem(THEME_KEY) || 'system';
  var resolved = pref;
  if (pref === 'system') {
    resolved = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }
  var root = document.documentElement;
  root.classList.remove('light', 'soft', 'dark');
  root.classList.add(resolved);
  root.dataset.themePreference = pref;
  var locale = localStorage.getItem(LOCALE_KEY) || 'vi';
  root.lang = locale;
})();
