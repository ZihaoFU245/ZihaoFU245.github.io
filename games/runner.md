---
layout: single
title: "runner"
author_profile: false
permalink: /hehehehaw/runner/
sitemap: false
robots: noindex
excerpt: "Hidden subpage under /hehehehaw/"
---

<!-- Fullscreen canvas + tiny progress bar -->
<style>
  html, body { height: 100%; margin: 0; background: #000; }
  /* Make canvas ignore theme wrappers by fixing it to the viewport */
  #unity-canvas {
    position: fixed; inset: 0; width: 100vw; height: 100vh;
    display: block; background: #000;
  }
  #bar { position: fixed; left: 10px; bottom: 10px; width: 50vw; max-width: 640px; height: 8px; background:#333; z-index: 9999; }
  #fill { height: 100%; width: 0%; background:#999; transition: width .1s linear; }
</style>

<canvas id="unity-canvas"></canvas>
<div id="bar"><div id="fill"></div></div>
<noscript style="color:#fff;position:fixed;left:10px;top:10px;z-index:9999">
  Please enable JavaScript to play the game.
</noscript>

{% raw %}
<!-- Unity loader from CDN -->
<script src="https://cdn.zihaofu245.me/build/Build/build.loader.js?v=5"></script>

<script>
  (function () {
    const canvas = document.getElementById("unity-canvas");
    const buildUrl = "https://cdn.zihaofu245.me/build/Build";

    const config = {
      dataUrl:      buildUrl + "/build.data.unityweb?v=5",
      frameworkUrl: buildUrl + "/build.framework.js.unityweb?v=5",
      codeUrl:      buildUrl + "/build.wasm.unityweb?v=5",
      // streamingAssetsUrl: "https://cdn.zihaofu245.me/build/StreamingAssets", // if used
      companyName: "You",
      productName: "Learning2D",
      productVersion: "1.0",
    };

    const fill = document.getElementById("fill");
    function showError(msg) {
      const el = document.createElement('div');
      el.style.cssText = 'position:fixed;left:10px;top:10px;z-index:10000;color:#fff;background:rgba(0,0,0,.7);padding:6px 8px;border:1px solid #333;font:12px system-ui,Segoe UI,Arial;';
      el.textContent = msg;
      document.body.appendChild(el);
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
          // Reload so the page is no longer controlled by the COI SW
          location.reload();
          return true;
        }
      } catch (_) {}
      return false;
    }

    function startUnity() {
      if (typeof createUnityInstance !== 'function') {
        // If the loader script failed (common with COEP + cross-origin CDN without CORS/CORP),
        // attempt to remove the previously-registered COI SW and reload once.
        tryUnregisterCOISW().then((reloading) => {
          if (!reloading) {
            showError('Failed to load Unity loader (build.loader.js). Check Network tab for errors.');
          }
        });
        return;
      }
      createUnityInstance(canvas, config, p => {
        fill.style.width = (p * 100).toFixed(0) + "%";
      }).then(() => {
        fill.parentElement.style.display = "none";
      }).catch(err => {
        console.error(err);
        showError('Unity load error: ' + err);
      });
    }

    // Give the loader tag a moment; then start
    if (document.readyState === 'complete' || document.readyState === 'interactive') {
      setTimeout(startUnity, 0);
    } else {
      document.addEventListener('DOMContentLoaded', startUnity);
    }
  })();
</script>
{% endraw %}


