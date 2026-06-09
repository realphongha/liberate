document.addEventListener('DOMContentLoaded', () => {
  const toggle = document.getElementById('toggle');
  const statusText = document.getElementById('statusText');
  const domainEl = document.getElementById('domain');
  const siteActionBtn = document.getElementById('siteAction');

  let currentDomain = '';

  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    if (!tabs || !tabs.length) return;
    const url = new URL(tabs[0].url);
    currentDomain = url.hostname.replace(/^www\./, '');
    domainEl.textContent = currentDomain;

    chrome.storage.sync.get({ enabled: true, blacklist: [], whitelist: [] }, (result) => {
      toggle.checked = result.enabled;
      updateUI(result.enabled);

      const isBlacklisted = result.blacklist.includes(currentDomain);
      siteActionBtn.textContent = isBlacklisted ? 'Enable for this site' : 'Disable for this site';
    });
  });

  toggle.addEventListener('change', () => {
    const enabled = toggle.checked;
    chrome.storage.sync.set({ enabled });
    updateUI(enabled);
  });

  siteActionBtn.addEventListener('click', () => {
    if (!currentDomain) return;

    chrome.storage.sync.get({ blacklist: [] }, (result) => {
      const blacklist = [...result.blacklist];
      const idx = blacklist.indexOf(currentDomain);

      if (idx >= 0) {
        blacklist.splice(idx, 1);
        siteActionBtn.textContent = 'Disable for this site';
      } else {
        blacklist.push(currentDomain);
        siteActionBtn.textContent = 'Enable for this site';
      }

      chrome.storage.sync.set({ blacklist });
    });
  });

  function updateUI(enabled) {
    statusText.textContent = enabled ? 'Enabled' : 'Disabled';
    statusText.style.color = enabled ? '#1a73e8' : '#5f6368';
  }
});
