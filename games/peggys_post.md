---
layout: none
title: "Peggy's Post"
permalink: /hehehehaw/peggys_post/
sitemap: false
robots: noindex
---

<link rel="stylesheet" href="/assets/css/unity-game.css">

<canvas id="unity-canvas"></canvas>
<div id="bar"><div id="fill"></div></div>
<noscript style="color:#fff;position:fixed;left:10px;top:10px;z-index:9999">
  Please enable JavaScript to play the game.
</noscript>

{% raw %}
<script src="/assets/js/unity-utils.js"></script>
<!-- Unity loader from CDN (original build) -->
<script src="https://cdn.zihaofu245.me/peggy_post/Build/peggys_post.loader.js"></script>
<script>
  (function(){
    const canvas = document.getElementById('unity-canvas');
    const fill = document.getElementById('fill');
    const buildUrl = 'https://cdn.zihaofu245.me/peggy_post/Build';
    const config = {
      dataUrl:      `${buildUrl}/peggys_post.unityweb`,
      frameworkUrl: `${buildUrl}/peggys_post.framework.js.unityweb`,
      codeUrl:      `${buildUrl}/peggys_post.wasm.unityweb`,
      // streamingAssetsUrl: 'https://cdn.zihaofu245.me/build/StreamingAssets', // if used
      companyName: 'digitarium',
      productName: "Peggy's Post",
      productVersion: '1.0'
    };
    function onProgress(p){
      if (fill) fill.style.width = (p * 100).toFixed(0) + '%';
    }
    function boot(){
      UnityPage.startUnity({ canvas, config, onProgress }).then(instance => {
        if (instance && fill && fill.parentElement) fill.parentElement.style.display = 'none';
      });
    }
    if (document.readyState === 'complete' || document.readyState === 'interactive') {
      setTimeout(boot, 0);
    } else {
      document.addEventListener('DOMContentLoaded', boot);
    }
  })();
</script>
{% endraw %}