// Utilities for loading Unity WebGL builds from a CDN with a fixed fullscreen canvas
// and optional COOP/COEP service worker unregistration if it interferes with cross-origin loads.
(function(){
  function showError(msg) {
    try {
      const el = document.createElement('div');
      el.style.cssText = 'position:fixed;left:10px;top:10px;z-index:10000;color:#fff;background:rgba(0,0,0,.7);padding:6px 8px;border:1px solid #333;font:12px system-ui,Segoe UI,Arial;max-width:90vw;';
      el.textContent = msg;
      document.body.appendChild(el);
    } catch (_) {
      console.error(msg);
    }
  }

  async function tryUnregisterCOISW() {
    if (!('serviceWorker' in navigator)) return false;
    try {
      const regs = await navigator.serviceWorker.getRegistrations();
      let didUnregister = false;
      for (const r of regs) {
        if (r.active && r.active.scriptURL && r.active.scriptURL.includes('coi-serviceworker.js')) {
          await r.unregister();
          didUnregister = true;
        }
      }
      if (didUnregister) {
        location.reload();
        return true;
      }
    } catch (_) {}
    return false;
  }

  // Bootstraps Unity. Expects the Unity loader script to have defined window.createUnityInstance.
  async function startUnity({ canvas, config, onProgress }) {
    if (!canvas) canvas = document.getElementById('unity-canvas');
    if (typeof createUnityInstance !== 'function') {
      const reloading = await tryUnregisterCOISW();
      if (!reloading) {
        showError('Failed to load Unity loader. Check CORS/CORP and Network tab.');
      }
      return null;
    }
    try {
      const instance = await createUnityInstance(canvas, config, onProgress || null);
      return instance;
    } catch (err) {
      console.error(err);
      showError('Unity load error: ' + err);
      return null;
    }
  }

  window.UnityPage = { startUnity, tryUnregisterCOISW, showError };
})();
