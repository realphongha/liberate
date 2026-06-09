(function () {
  let isActive = false;
  let observer = null;

  function getDomain() {
    return window.location.hostname.replace(/^www\./, '');
  }

  function shouldBeActive(settings) {
    if (!settings.enabled) return false;
    const domain = getDomain();
    if (settings.blacklist && settings.blacklist.includes(domain)) return false;
    if (settings.whitelist && settings.whitelist.length > 0 && !settings.whitelist.includes(domain)) return false;
    return true;
  }

  function activate() {
    if (isActive) return;
    isActive = true;

    removeMetaTags();
    scanElement(document.documentElement);

    if (!observer) {
      observer = createObserver((node) => {
        if (!isActive) return;
        removeMetaTags();
        scanElement(node);
      });
    }
  }

  function deactivate() {
    isActive = false;
    if (observer) {
      observer.disconnect();
      observer = null;
    }
  }

  function updateState(settings) {
    if (shouldBeActive(settings)) {
      activate();
    } else {
      deactivate();
    }
  }

  chrome.storage.sync.get({ enabled: true, blacklist: [], whitelist: [] }, (result) => {
    updateState(result);
  });

  chrome.storage.onChanged.addListener((changes) => {
    const updates = {};
    if (changes.enabled !== undefined) updates.enabled = changes.enabled.newValue;
    if (changes.blacklist !== undefined) updates.blacklist = changes.blacklist.newValue;
    if (changes.whitelist !== undefined) updates.whitelist = changes.whitelist.newValue;
    if (Object.keys(updates).length > 0) {
      chrome.storage.sync.get({ enabled: true, blacklist: [], whitelist: [] }, (result) => {
        updateState(result);
      });
    }
  });

  removeMetaTags();
  scanElement(document.documentElement);

  document.addEventListener('DOMContentLoaded', () => {
    removeMetaTags();
    scanElement(document.documentElement);
  });
})();
