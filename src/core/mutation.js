const LiberateMutation = (function () {
  const callbacks = [];
  let observer = null;
  let initialized = false;

  function init() {
    if (initialized) return;
    initialized = true;

    observer = new MutationObserver(function (mutations) {
      for (let m = 0; m < mutations.length; m++) {
        const nodes = mutations[m].addedNodes;
        for (let n = 0; n < nodes.length; n++) {
          const node = nodes[n];
          if (node.nodeType === Node.ELEMENT_NODE) {
            for (let c = 0; c < callbacks.length; c++) {
              callbacks[c](node);
            }
          }
        }
      }
    });

    observer.observe(document.documentElement, {
      childList: true,
      subtree: true,
    });
  }

  function onNodeAdded(callback) {
    callbacks.push(callback);
  }

  function disconnect() {
    if (observer) {
      observer.disconnect();
      observer = null;
    }
    initialized = false;
  }

  return { init, onNodeAdded, disconnect };
})();
