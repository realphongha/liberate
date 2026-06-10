(function () {
  LiberateEngine.registerModule('rightClick', {
    _active: false,
    onActivate: function () {
      LiberateEvents.intercept('contextmenu');
      LiberateEvents.interceptCapture('contextmenu');
      LiberateEngine.log('Context menu blockers neutralized');
    },
    onDeactivate: function () {
      LiberateEvents.release('contextmenu');
      LiberateEvents.releaseCapture('contextmenu');
      LiberateEngine.log('Context menu interception removed');
    },
  });
})();
