(function () {
  function removeTranslateNo(element) {
    if (element.nodeType !== Node.ELEMENT_NODE) return;
    element.removeAttribute('translate');
    element.classList.remove('notranslate');
    element.classList.remove('google-src-text');
  }

  function removeMetaTags() {
    const meta = document.querySelector('meta[name="google"][content="notranslate"]');
    if (meta) meta.remove();
  }

  function scanAll() {
    removeMetaTags();
    removeTranslateNo(document.documentElement);
    const all = document.documentElement.querySelectorAll('*');
    for (let i = 0; i < all.length; i++) {
      removeTranslateNo(all[i]);
    }
  }

  scanAll();

  document.addEventListener('DOMContentLoaded', scanAll);

  function onSettingsChanged() {
    LiberateSettings.getAll(function (settings) {
      LiberateEngine.updateState(settings);
    });
  }

  LiberateSettings.getAll(function (settings) {
    LiberateEngine.init(settings);
  });

  LiberateSettings.onChanged(onSettingsChanged);
})();
