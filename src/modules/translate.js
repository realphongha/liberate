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

  function scanAndClean(node) {
    removeTranslateNo(node);
    const descendants = node.querySelectorAll('*');
    for (let i = 0; i < descendants.length; i++) {
      removeTranslateNo(descendants[i]);
    }
  }

  LiberateEngine.registerModule('translate', {
    _active: false,
    onActivate: function () {
      removeMetaTags();
      scanAndClean(document.documentElement);
      LiberateMutation.onNodeAdded(function (node) {
        if (!LiberateEngine.getModuleSettings('translate')) return;
        removeMetaTags();
        scanAndClean(node);
      });
      LiberateEngine.log('Translate unlock active');
    },
    onDeactivate: function () {
      LiberateEngine.log('Translate unlock inactive');
    },
  });
})();
