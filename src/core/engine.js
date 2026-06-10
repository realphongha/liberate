const LiberateEngine = (function () {
  const modules = {};
  let currentSettings = null;

  function getDomain() {
    return window.location.hostname.replace(/^www\./, '');
  }

  function log(...args) {
    console.log('[Liberate]', ...args);
  }

  function getModuleSettings(moduleName) {
    if (!currentSettings) return true;
    if (!currentSettings.enabled) return false;

    const domain = getDomain();
    const siteRule = currentSettings.siteRules && currentSettings.siteRules[domain];

    if (siteRule && siteRule.enabled === false) return false;
    if (siteRule && siteRule.modules && siteRule.modules[moduleName] === false) return false;

    if (currentSettings.modules && currentSettings.modules[moduleName] === false) return false;

    return true;
  }

  function registerModule(name, module) {
    modules[name] = module;
  }

  function activateModule(name) {
    const mod = modules[name];
    if (!mod || mod._active) return;
    mod._active = true;
    if (mod.onActivate) {
      mod.onActivate();
      log(name + ' activated');
    }
  }

  function deactivateModule(name) {
    const mod = modules[name];
    if (!mod || !mod._active) return;
    mod._active = false;
    if (mod.onDeactivate) {
      mod.onDeactivate();
      log(name + ' deactivated');
    }
  }

  function updateState(settings) {
    currentSettings = settings;

    if (!settings.enabled) {
      for (const name in modules) {
        deactivateModule(name);
      }
      LiberateMutation.disconnect();
      return;
    }

    LiberateMutation.init();

    for (const name in modules) {
      if (getModuleSettings(name)) {
        activateModule(name);
      } else {
        deactivateModule(name);
      }
    }

    const domain = getDomain();
    const activeList = Object.keys(modules).filter((n) => modules[n]._active);
    log('Domain:', domain, '| Active modules:', activeList.join(', '));
  }

  function init(settings) {
    LiberateEvents.init();
    updateState(settings);
  }

  return { registerModule, init, updateState, getDomain, log };
})();
