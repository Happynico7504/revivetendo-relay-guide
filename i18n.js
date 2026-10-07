// Hand-written translations. The pages carry the English text; every
// translatable element has a data-i18n key, and lang/<code>.js registers that
// language's strings for those keys (missing keys stay English). Loaded in
// <head>: the language is picked before the page shows (?lang=, saved choice,
// browser languages), and for other languages the page stays hidden until
// the strings are applied, so English never flashes.
(function () {
  var LANGS = { en: 'English', de: 'Deutsch', es: 'Español', fr: 'Français', it: 'Italiano', ja: '日本語' };
  var STORAGE_KEY = 'revivetendo-lang';

  var I18N = window.I18N = {
    langs: LANGS,
    strings: {},
    register: function (code, strings) {
      this.strings[code] = strings;
      if (code === this.lang && document.readyState !== 'loading') apply();
    },
    // t returns the current language's string for key, or fallback (English).
    t: function (key, fallback) {
      var d = this.strings[this.lang];
      return (d && d[key]) || fallback;
    }
  };

  function stored() {
    try { return localStorage.getItem(STORAGE_KEY); } catch (e) { return null; }
  }

  function pick() {
    var q = /[?&]lang=([a-z]{2})/.exec(location.search);
    if (q && LANGS[q[1]]) return q[1];
    var s = stored();
    if (s && LANGS[s]) return s;
    var prefs = navigator.languages || [navigator.language || 'en'];
    for (var i = 0; i < prefs.length; i++) {
      var code = String(prefs[i]).toLowerCase().split('-')[0];
      if (LANGS[code]) return code;
    }
    return 'en';
  }

  I18N.lang = pick();
  var root = document.documentElement;
  root.lang = I18N.lang;

  if (I18N.lang !== 'en') {
    // Hidden until the strings are applied; shown anyway after 3 s if the
    // language file fails to load.
    root.classList.add('i18n-loading');
    setTimeout(function () { root.classList.remove('i18n-loading'); }, 3000);
    var script = document.createElement('script');
    script.src = 'lang/' + I18N.lang + '.js';
    script.onerror = function () { root.classList.remove('i18n-loading'); };
    document.head.appendChild(script);
  }

  // apply runs once the page and (for other languages) the strings are both there.
  var applied = false;
  function apply() {
    if (applied) return;
    if (I18N.lang !== 'en' && !I18N.strings[I18N.lang]) {
      addSwitcher(); // strings still loading; register() calls apply again
      return;
    }
    applied = true;
    if (I18N.strings[I18N.lang]) {
      var els = document.querySelectorAll('[data-i18n]');
      for (var i = 0; i < els.length; i++) {
        var s = I18N.t(els[i].getAttribute('data-i18n'), null);
        if (s !== null) els[i].innerHTML = s;
      }
      var titleKey = document.body.getAttribute('data-i18n-title');
      if (titleKey) document.title = I18N.t(titleKey, document.title);
    }
    addSwitcher();
    root.classList.remove('i18n-loading');
  }

  function addSwitcher() {
    var nav = document.querySelector('.nav-container');
    if (!nav || nav.querySelector('.lang-select')) return;
    var select = document.createElement('select');
    select.className = 'lang-select';
    select.setAttribute('aria-label', 'Language');
    for (var code in LANGS) {
      var opt = document.createElement('option');
      opt.value = code;
      opt.textContent = LANGS[code];
      if (code === I18N.lang) opt.selected = true;
      select.appendChild(opt);
    }
    select.addEventListener('change', function () {
      try {
        localStorage.setItem(STORAGE_KEY, select.value);
        if (location.search) {
          location.href = location.pathname + location.hash; // drop a ?lang= so the choice applies
        } else {
          location.reload();
        }
      } catch (e) {
        location.href = location.pathname + '?lang=' + select.value + location.hash; // no storage: keep it in the URL
      }
    });
    nav.appendChild(select);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', apply);
  } else {
    apply();
  }
})();
