function removeTranslateNo(element) {
  if (element.nodeType !== Node.ELEMENT_NODE) return;
  element.removeAttribute('translate');
  element.classList.remove('notranslate');
  element.classList.remove('google-src-text');
}

function scanElement(element) {
  if (!element || element.nodeType !== Node.ELEMENT_NODE) return;
  removeTranslateNo(element);
  const descendants = element.querySelectorAll('*');
  for (let i = 0; i < descendants.length; i++) {
    removeTranslateNo(descendants[i]);
  }
}

function removeMetaTags() {
  document.querySelector(
    'meta[name="google"][content="notranslate"]'
  )?.remove();
}
