const LiberateSettings = (function () {
  const DEFAULTS = {
    enabled: true,
    modules: {
      translate: true,
      rightClick: true,
      selection: true,
      copy: true,
    },
    siteRules: {},
    blacklist: [],
    whitelist: [],
  };

  function get(keys, callback) {
    chrome.storage.sync.get(keys, function (result) {
      if (result.modules === undefined && result.enabled !== undefined) {
        result.modules = Object.assign({}, DEFAULTS.modules);
      }
      callback(result);
    });
  }

  function set(items, callback) {
    chrome.storage.sync.set(items, callback);
  }

  function getAll(callback) {
    chrome.storage.sync.get(DEFAULTS, function (result) {
      if (result.modules === undefined) {
        result.modules = Object.assign({}, DEFAULTS.modules);
      }
      callback(result);
    });
  }

  function onChanged(listener) {
    chrome.storage.onChanged.addListener(listener);
  }

  function getDefaults() {
    return JSON.parse(JSON.stringify(DEFAULTS));
  }

  return { get, set, getAll, onChanged, getDefaults };
})();
