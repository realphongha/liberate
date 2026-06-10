(function () {
  chrome.runtime.onMessage.addListener(function (msg, sender, sendResponse) {
    if (msg.type === 'liberateToggle') {
      LiberateEngine.toggleModule(msg.module, msg.enabled);
      sendResponse({ success: true });
    }
  });

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
