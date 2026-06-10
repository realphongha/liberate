(function () {
  let styleEl = null;

  function injectCSS() {
    if (styleEl) return;
    styleEl = document.createElement('style');
    styleEl.textContent =
      '* { user-select: text !important; -webkit-user-select: text !important; }';
    document.documentElement.appendChild(styleEl);
  }

  function removeCSS() {
    if (styleEl) {
      styleEl.remove();
      styleEl = null;
    }
  }

  LiberateEngine.registerModule('selection', {
    _active: false,
    onActivate: function () {
      injectCSS();
      LiberateEvents.intercept('selectstart');
      LiberateEvents.interceptCapture('selectstart');
      LiberateMutation.onNodeAdded(function () {
        if (!LiberateEngine.getModuleSettings('selection')) return;
        injectCSS();
      });
      LiberateEngine.log('Selection unlock active');
    },
    onDeactivate: function () {
      removeCSS();
      LiberateEvents.release('selectstart');
      LiberateEvents.releaseCapture('selectstart');
      LiberateEngine.log('Selection unlock inactive');
    },
  });
})();
