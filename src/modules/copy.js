(function () {
  LiberateEngine.registerModule('copy', {
    _active: false,
    onActivate: function () {
      LiberateEvents.intercept('copy');
      LiberateEvents.interceptCapture('copy');
      LiberateEngine.log('Copy blockers neutralized');
    },
    onDeactivate: function () {
      LiberateEvents.release('copy');
      LiberateEvents.releaseCapture('copy');
      LiberateEngine.log('Copy interception removed');
    },
  });
})();
