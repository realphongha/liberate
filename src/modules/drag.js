(function () {
  LiberateEngine.registerModule('drag', {
    _active: false,
    onActivate: function () {
      LiberateEvents.intercept('dragstart');
      LiberateEvents.interceptCapture('dragstart');
      LiberateEngine.log('Drag blockers neutralized');
    },
    onDeactivate: function () {
      LiberateEvents.release('dragstart');
      LiberateEvents.releaseCapture('dragstart');
      LiberateEngine.log('Drag interception removed');
    },
  });
})();
