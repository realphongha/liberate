const LiberateEvents = (function () {
  const interceptedTypes = new Set();
  const captureHandlers = new Map();
  let keyboardHandler = null;
  let initialized = false;

  const ORIGINAL = {
    addEventListener: EventTarget.prototype.addEventListener,
    removeEventListener: EventTarget.prototype.removeEventListener,
  };

  const PROTECTED_KEYS = new Set(['c', 'v', 'a', 'f', 's', 'p']);

  function init() {
    if (initialized) return;
    initialized = true;

    const { addEventListener: origAdd, removeEventListener: origRemove } = ORIGINAL;

    EventTarget.prototype.addEventListener = function (type, listener, options) {
      if (interceptedTypes.has(type)) {
        return;
      }
      return origAdd.call(this, type, listener, options);
    };

    EventTarget.prototype.removeEventListener = function (type, listener, options) {
      if (interceptedTypes.has(type)) {
        return;
      }
      return origRemove.call(this, type, listener, options);
    };

    keyboardHandler = function (e) {
      if (e.ctrlKey || e.metaKey) {
        if (PROTECTED_KEYS.has(e.key.toLowerCase())) {
          e.stopImmediatePropagation();
        }
      }
    };

    document.addEventListener('keydown', keyboardHandler, true);
  }

  function intercept(eventType) {
    interceptedTypes.add(eventType);
  }

  function release(eventType) {
    interceptedTypes.delete(eventType);
  }

  function interceptCapture(eventType) {
    if (captureHandlers.has(eventType)) return;
    const handler = function (e) {
      e.stopImmediatePropagation();
    };
    ORIGINAL.addEventListener.call(document, eventType, handler, true);
    captureHandlers.set(eventType, handler);
  }

  function releaseCapture(eventType) {
    const handler = captureHandlers.get(eventType);
    if (handler) {
      ORIGINAL.removeEventListener.call(document, eventType, handler, true);
      captureHandlers.delete(eventType);
    }
  }

  function reset() {
    interceptedTypes.clear();
    captureHandlers.forEach(function (handler, eventType) {
      ORIGINAL.removeEventListener.call(document, eventType, handler, true);
    });
    captureHandlers.clear();
  }

  return { init, intercept, release, interceptCapture, releaseCapture, reset };
})();
