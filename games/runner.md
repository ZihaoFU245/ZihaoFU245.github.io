---
layout: none
title: "runner"
author_profile: false
permalink: /hehehehaw/runner/
sitemap: false
robots: noindex
excerpt: "Hidden subpage under /hehehehaw/"
---

<html>
<head>
  <meta charset="utf-8">
  <title>Learning2D</title>
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <style>html,body,#unity-container{height:100%;margin:0;background:#000}</style>
  <script src="https://cdn.zihaofu245.me/build/Build/build.loader.js"></script>
</head>
<body>
  <div id="unity-container"></div>
  <script>
    const buildUrl = "https://cdn.zihaofu245.me/build/Build";
    createUnityInstance(document.getElementById("unity-container"), {
      dataUrl:      buildUrl + "/build.data.unityweb",
      frameworkUrl: buildUrl + "/build.framework.js.unityweb",
      codeUrl:      buildUrl + "/build.wasm.unityweb",
      // streamingAssetsUrl: "https://cdn.zihaofu245.me/build/StreamingAssets",
      companyName: "You", productName: "Learning2D", productVersion: "1.0",
    }).catch(err => { console.error(err); alert(err); });
  </script>
</body>
</html>
