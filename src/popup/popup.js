document.addEventListener('DOMContentLoaded', function () {
  const toggle = document.getElementById('toggle');
  const statusText = document.getElementById('statusText');
  const domainLabel = document.getElementById('domainLabel');
  const disableAllBtn = document.getElementById('disableAllBtn');
  const resetSiteBtn = document.getElementById('resetSiteBtn');
  const moduleItems = document.querySelectorAll('.module-item');

  let currentDomain = '';
  let tabId = null;

  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    if (!tabs || !tabs.length) return;
    tabId = tabs[0].id;
    const url = new URL(tabs[0].url);
    currentDomain = url.hostname.replace(/^www\./, '');

    if (url.protocol === 'chrome:' || url.protocol === 'about:' || url.protocol === 'edge:') {
      domainLabel.textContent = 'N/A';
      disableAllBtn.disabled = true;
      resetSiteBtn.disabled = true;
      return;
    }

    domainLabel.textContent = currentDomain;
    loadSettings();
  });

  function loadSettings() {
    chrome.storage.sync.get(
      { enabled: true, modules: {}, siteRules: {} },
      function (result) {
        toggle.checked = result.enabled !== false;
        updateUI(result.enabled !== false);

        const siteRule = result.siteRules && result.siteRules[currentDomain];
        const disabledModules = (siteRule && siteRule.modules) || {};

        moduleItems.forEach(function (item) {
          const moduleName = item.dataset.module;
          const cb = item.querySelector('input[type="checkbox"]');
          cb.checked = disabledModules[moduleName] !== false;
          cb.disabled = !result.enabled;
        });
      }
    );
  }

  function sendToggle(moduleName, enabled) {
    if (tabId) {
      chrome.tabs.sendMessage(tabId, {
        type: 'liberateToggle',
        module: moduleName,
        enabled: enabled,
      }, function () {});
    }
  }

  function saveDisabledModules(disabled) {
    chrome.storage.sync.get({ siteRules: {} }, function (result) {
      const siteRules = Object.assign({}, result.siteRules);
      if (disabled) {
        siteRules[currentDomain] = { modules: disabled };
      } else {
        delete siteRules[currentDomain];
      }
      chrome.storage.sync.set({ siteRules: siteRules });
    });
  }

  toggle.addEventListener('change', function () {
    const enabled = toggle.checked;
    chrome.storage.sync.set({ enabled: enabled });
    updateUI(enabled);
    moduleItems.forEach(function (item) {
      const cb = item.querySelector('input[type="checkbox"]');
      const moduleName = item.dataset.module;
      if (!enabled) {
        cb.checked = false;
        cb.disabled = true;
        sendToggle(moduleName, false);
      } else {
        cb.disabled = false;
        cb.checked = true;
        sendToggle(moduleName, true);
      }
    });
  });

  moduleItems.forEach(function (item) {
    const cb = item.querySelector('input[type="checkbox"]');
    cb.addEventListener('change', function () {
      const moduleName = item.dataset.module;
      sendToggle(moduleName, cb.checked);

      const disabled = {};
      moduleItems.forEach(function (i) {
        const c = i.querySelector('input[type="checkbox"]');
        if (!c.checked) {
          disabled[i.dataset.module] = false;
        }
      });
      const hasDisabled = Object.keys(disabled).length > 0;
      saveDisabledModules(hasDisabled ? disabled : null);
    });
  });

  disableAllBtn.addEventListener('click', function () {
    if (!currentDomain) return;
    const disabled = {};
    moduleItems.forEach(function (item) {
      const moduleName = item.dataset.module;
      const cb = item.querySelector('input[type="checkbox"]');
      cb.checked = false;
      disabled[moduleName] = false;
      sendToggle(moduleName, false);
    });
    saveDisabledModules(disabled);
  });

  resetSiteBtn.addEventListener('click', function () {
    if (!currentDomain) return;
    saveDisabledModules(null);
    moduleItems.forEach(function (item) {
      const cb = item.querySelector('input[type="checkbox"]');
      cb.checked = true;
      sendToggle(item.dataset.module, true);
    });
  });

  function updateUI(enabled) {
    statusText.textContent = enabled ? 'Enabled' : 'Disabled';
    statusText.style.color = enabled ? '#1a73e8' : '#5f6368';
  }
});
