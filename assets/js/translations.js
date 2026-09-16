// Brux Barbershop — Real-time Language Toggle
// Default language is Polish (pl). Click the toggle button to switch to English (en).

(function () {
  'use strict';

  var currentLang = 'pl';
  var originalTexts = {};

  function getTranslatableElements() {
    return document.querySelectorAll('[data-en]');
  }

  function saveOriginals() {
    var els = getTranslatableElements();
    els.forEach(function (el) {
      // Store the current (Polish) text
      var key = el.getAttribute('data-en');
      if (key && !originalTexts[key]) {
        originalTexts[key] = el.innerHTML;
      }
    });
  }

  function applyLanguage(lang) {
    var els = getTranslatableElements();
    els.forEach(function (el) {
      var enText = el.getAttribute('data-en');
      if (enText) {
        if (lang === 'en') {
          // Switch to English - replace with data-en value
          var svg = el.querySelector('svg');
          if (svg) {
            el.innerHTML = enText + ' ' + svg.outerHTML;
          } else {
            el.textContent = enText;
          }
        } else {
          // Switch back to Polish - restore original
          var key = enText;
          if (originalTexts[key]) {
            el.innerHTML = originalTexts[key];
          }
        }
      }
    });

    // Update button text
    var toggle = document.getElementById('langToggle');
    if (toggle) {
      var langText = toggle.querySelector('.lang-text');
      if (langText) {
        langText.textContent = lang === 'pl' ? 'Przełącz na angielski' : 'Switch to English';
      } else {
        toggle.textContent = lang === 'pl' ? 'Przełącz na angielski' : 'Switch to English';
      }
    }

    // Update html lang attribute
    document.documentElement.lang = lang;
    currentLang = lang;
  }

  function init() {
    saveOriginals();
    var toggle = document.getElementById('langToggle');
    if (toggle) {
      toggle.addEventListener('click', function () {
        var newLang = currentLang === 'pl' ? 'en' : 'pl';
        applyLanguage(newLang);
      });
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  window.BruxLang = {
    getCurrentLang: function () { return currentLang; },
    setLanguage: applyLanguage
  };
})();
