(function () {
  LiberateEngine.registerModule('keyboard', {
    _active: false,
    onActivate: function () {
      LiberateEvents.intercept('keydown');
      LiberateEngine.log('Keyboard shortcut protection active');
    },
    onDeactivate: function () {
      LiberateEvents.release('keydown');
      LiberateEngine.log('Keyboard shortcut protection removed');
    },
  });
})();
