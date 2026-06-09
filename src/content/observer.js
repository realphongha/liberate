function createObserver(callback) {
  const observer = new MutationObserver((mutations) => {
    for (let m = 0; m < mutations.length; m++) {
      const mutation = mutations[m];
      const nodes = mutation.addedNodes;
      for (let n = 0; n < nodes.length; n++) {
        const node = nodes[n];
        if (node.nodeType === Node.ELEMENT_NODE) {
          callback(node);
        }
      }
    }
  });

  observer.observe(document.documentElement, {
    childList: true,
    subtree: true,
  });

  return observer;
}
