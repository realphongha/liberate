document.addEventListener('DOMContentLoaded', function () {
  const toggle = document.getElementById('toggle');
  const statusText = document.getElementById('statusText');
  const domainEl = document.getElementById('domain');
  const siteActionBtn = document.getElementById('siteAction');
  const moduleItems = document.querySelectorAll('.module-item');

  let currentDomain = '';

  const MODULE_LABELS = {
    translate: 'Translate Unlock',
    rightClick: 'Right Click Unlock',
    selection: 'Selection Unlock',
    copy: 'Copy Unlock',
    drag: 'Drag Unlock',
    keyboard: 'Keyboard Unlock',
  };

  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    if (!tabs || !tabs.length) return;
    const url = new URL(tabs[0].url);
    currentDomain = url.hostname.replace(/^www\./, '');

    if (url.protocol === 'chrome:' || url.protocol === 'about:' || url.protocol === 'edge:') {
      domainEl.textContent = 'N/A';
      siteActionBtn.disabled = true;
      siteActionBtn.textContent = 'Not available';
      return;
    }

    domainEl.textContent = currentDomain;
    loadSettings();
  });

  function loadSettings() {
    chrome.storage.sync.get(
      { enabled: true, modules: {}, siteRules: {}, blacklist: [] },
      function (result) {
        const mods = result.modules || {};
        toggle.checked = result.enabled !== false;
        updateUI(result.enabled !== false);

        moduleItems.forEach(function (item) {
          const moduleName = item.dataset.module;
          const cb = item.querySelector('input[type="checkbox"]');
          const isSiteDisabled =
            result.siteRules &&
            result.siteRules[currentDomain] &&
            result.siteRules[currentDomain].enabled === false;
          const isSiteModuleDisabled =
            result.siteRules &&
            result.siteRules[currentDomain] &&
            result.siteRules[currentDomain].modules &&
            result.siteRules[currentDomain].modules[moduleName] === false;

          if (!result.enabled || isSiteDisabled) {
            cb.checked = false;
            cb.disabled = true;
          } else if (isSiteModuleDisabled) {
            cb.checked = false;
            cb.disabled = false;
          } else {
            cb.checked = mods[moduleName] !== false;
            cb.disabled = false;
          }
        });

        const isBlacklisted = result.blacklist && result.blacklist.includes(currentDomain);
        if (isBlacklisted) {
          siteActionBtn.textContent = 'Enable for this site';
        } else {
          siteActionBtn.textContent = 'Disable for this site';
        }
      }
    );
  }

  toggle.addEventListener('change', function () {
    const enabled = toggle.checked;
    chrome.storage.sync.set({ enabled: enabled });
    updateUI(enabled);
    moduleItems.forEach(function (item) {
      const cb = item.querySelector('input[type="checkbox"]');
      if (!enabled) {
        cb.checked = false;
        cb.disabled = true;
      } else {
        cb.disabled = false;
        cb.checked = true;
      }
    });
  });

  moduleItems.forEach(function (item) {
    const cb = item.querySelector('input[type="checkbox"]');
    cb.addEventListener('change', function () {
      const moduleName = item.dataset.module;
      chrome.storage.sync.get({ modules: {}, siteRules: {} }, function (result) {
        const mods = Object.assign({}, result.modules);
        mods[moduleName] = cb.checked;
        chrome.storage.sync.set({ modules: mods });
      });
    });
  });

  siteActionBtn.addEventListener('click', function () {
    if (!currentDomain) return;

    chrome.storage.sync.get({ blacklist: [], siteRules: {} }, function (result) {
      const blacklist = result.blacklist ? result.blacklist.slice() : [];
      const siteRules = Object.assign({}, result.siteRules);
      const idx = blacklist.indexOf(currentDomain);

      if (idx >= 0) {
        blacklist.splice(idx, 1);
        delete siteRules[currentDomain];
        siteActionBtn.textContent = 'Disable for this site';
      } else {
        blacklist.push(currentDomain);
        siteRules[currentDomain] = { enabled: false, modules: {} };
        siteActionBtn.textContent = 'Enable for this site';
      }

      chrome.storage.sync.set({ blacklist: blacklist, siteRules: siteRules }, function () {
        moduleItems.forEach(function (item) {
          const cb = item.querySelector('input[type="checkbox"]');
          if (idx >= 0) {
            cb.disabled = false;
            cb.checked = true;
          } else {
            cb.checked = false;
            cb.disabled = true;
          }
        });
      });
    });
  });

  function updateUI(enabled) {
    statusText.textContent = enabled ? 'Enabled' : 'Disabled';
    statusText.style.color = enabled ? '#1a73e8' : '#5f6368';
  }
});
