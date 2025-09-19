---
layout: none
title: "Lizan Game"
permalink: /hehehehaw/LizanGame/
sitemap: false
robots: noindex
pass_sha256: "aGk_dnhtSh-gNKcx1SFtwL35mjWn5NW5QPo48BjHTKk"
---

<!-- Fullscreen canvas + tiny progress bar styles -->
<link rel="stylesheet" href="/assets/css/unity-game.css">

<!-- Password Shield Overlay -->
<style>
	#pw-shield { position: fixed; inset: 0; background: rgba(255,255,255,0.95); display: none; align-items: center; justify-content: center; z-index: 100000; }
	#pw-box { width: min(92vw, 360px); background: #fff; color: #222; border: 1px solid #ddd; border-radius: 12px; padding: 18px 16px 14px; box-shadow: 0 10px 30px rgba(0,0,0,0.1); }
	#pw-box h2 { margin: 0 0 10px; font: 600 18px/1.2 system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif; }
	#pw-box p { margin: 0 0 12px; color: #666; font-size: 13px; }
	#pw-form { display: flex; gap: 8px; }
	#pw-input { flex: 1; padding: 10px 12px; border-radius: 8px; border: 1px solid #ccc; background: #fff; color: #111; font-size: 14px; outline: none; }
	#pw-input:focus { border-color: #007bff; }
	#pw-submit { padding: 10px 14px; border-radius: 8px; border: 1px solid #007bff; background: #007bff; color: #fff; font-weight: 600; cursor: pointer; }
	#pw-submit:hover { filter: brightness(1.1); }
	#pw-err { margin-top: 8px; min-height: 18px; color: #d93025; font-size: 13px; }
</style>
<div id="pw-shield" aria-hidden="true">
	<div id="pw-box" role="dialog" aria-modal="true" aria-labelledby="pw-title">
		<h2 id="pw-title">Enter password</h2>
		<p>This page is protected.</p>
		<form id="pw-form">
			<input id="pw-input" name="password" type="password" placeholder="Password" autocomplete="current-password" aria-label="Password" required>
			<button id="pw-submit" type="submit">Unlock</button>
		</form>
		<div id="pw-err" role="status" aria-live="polite"></div>
	</div>
	<noscript style="position:fixed;left:10px;bottom:10px;color:#fff">This page requires JavaScript for password protection.</noscript>
	<script>
		// Small helper to focus the input when shield shows
		document.addEventListener('DOMContentLoaded', function(){
			var input = document.getElementById('pw-input');
			if (input) setTimeout(function(){ try { input.focus(); } catch(_){} }, 60);
		});
	</script>
</div>

<canvas id="unity-canvas"></canvas>
<div id="bar"><div id="fill"></div></div>
<noscript style="color:#fff;position:fixed;left:10px;top:10px;z-index:9999">
	Please enable JavaScript to play the game.
</noscript>

{% raw %}
<!-- Shared Unity helpers -->
<script src="/assets/js/unity-utils.js"></script>
<!-- Unity loader for LizanGame from CDN -->
<script src="https://cdn.zihaofu245.me/LizanGame/Build/Shengwxnw.github.io.loader.js"></script>
<script>
	(function(){
		const canvas = document.getElementById('unity-canvas');
		const fill = document.getElementById('fill');
		const buildUrl = 'https://cdn.zihaofu245.me/LizanGame/Build';
		const config = {
			dataUrl: buildUrl + '/Shengwxnw.github.io.data',
			frameworkUrl: buildUrl + '/Shengwxnw.github.io.framework.js',
			codeUrl: buildUrl + '/Shengwxnw.github.io.wasm',
			companyName: 'You',
			productName: 'LizanGame',
			productVersion: '1.0'
		};
		function onProgress(p){
			if (fill) fill.style.width = (p * 100).toFixed(0) + '%';
		}
		// Expose a global boot function; we'll call it after password check.
		// It waits for the Unity loader to be ready to avoid race conditions.
		window.bootLizanGame = function(){
			const start = () => {
				UnityPage.startUnity({ canvas, config, onProgress }).then(instance => {
					if (instance && fill && fill.parentElement) fill.parentElement.style.display = 'none';
				});
			};
			let tries = 0;
			(function waitForLoader(){
				if (typeof window.createUnityInstance === 'function') return start();
				if (tries++ > 200) return start(); // ~10s max at 50ms steps
				setTimeout(waitForLoader, 50);
			})();
		};
	})();
</script>
{% endraw %}

<!-- Password Shield Logic (uses Liquid to read configured secret) -->
<script>
(function(){
	// Read secret from page/site front matter (either hex-64 or base64url(no padding))
	var PASS_SECRET = ('{{ page.pass_sha256 | default: site.pass_sha256 | default: "" }}' || '').trim();
	var KEY = 'pw-ok:' + (location.pathname || '/');
	var unlocked = false;

	// Helpers: SHA-256 digest and encoders
	async function sha256Bytes(text){
		const enc = new TextEncoder();
		const buf = enc.encode(text);
		const hash = await crypto.subtle.digest('SHA-256', buf);
		return new Uint8Array(hash);
	}
	function toHex(bytes){
		return Array.from(bytes).map(b => b.toString(16).padStart(2,'0')).join('');
	}
	function toB64UrlNoPad(bytes){
		let bin = '';
		for (let i = 0; i < bytes.length; i++) bin += String.fromCharCode(bytes[i]);
		const b64 = btoa(bin);
		return b64.replace(/\+/g,'-').replace(/\//g,'_').replace(/=+$/,'');
	}

	function showShield(show){
		var shield = document.getElementById('pw-shield');
		if (!shield) return;
		shield.style.display = show ? 'flex' : 'none';
		shield.setAttribute('aria-hidden', show ? 'false' : 'true');
	}

	async function tryAutoStart(){
		if (typeof window.bootLizanGame === 'function') {
			window.bootLizanGame();
		} else {
			// Wait briefly if boot function isn't ready yet
			setTimeout(tryAutoStart, 50);
		}
	}

		// Normalize provided secret and check prior unlock
		var isHex64 = /^[0-9a-fA-F]{64}$/.test(PASS_SECRET);
		var normProvided = (isHex64 ? PASS_SECRET.toLowerCase() : PASS_SECRET.replace(/\+/g,'-').replace(/\//g,'_').replace(/=+$/,''));
		try { unlocked = (sessionStorage.getItem(KEY) === normProvided && PASS_SECRET.length > 0); } catch(_) {}
		// If no secret configured OR previously unlocked this path, skip shield and start game
		if (!PASS_SECRET || !PASS_SECRET.length || unlocked) {
		showShield(false);
		if (document.readyState === 'complete' || document.readyState === 'interactive') {
			setTimeout(tryAutoStart, 0);
		} else {
			document.addEventListener('DOMContentLoaded', tryAutoStart);
		}
		return;
	}

	// Otherwise, enable shield
	function wireShield(){
		showShield(true);
		var form = document.getElementById('pw-form');
		var input = document.getElementById('pw-input');
		var err = document.getElementById('pw-err');
		if (!form || !input) return;
		form.addEventListener('submit', async function(e){
			e.preventDefault();
			err && (err.textContent = '');
			var val = (input.value || '').trim();
			if (!val) { err && (err.textContent = 'Please enter a password.'); return; }
			try {
				const bytes = await sha256Bytes(val);
				const digestHex = toHex(bytes);
				const digestB64Url = toB64UrlNoPad(bytes);
				const ok = isHex64 ? (digestHex === normProvided) : (digestB64Url === normProvided);
				if (ok) {
					showShield(false);
					try { sessionStorage.setItem(KEY, normProvided); } catch(_) {}
					tryAutoStart();
				} else {
					err && (err.textContent = 'Incorrect password.');
					input.select();
				}
			} catch (ex) {
				err && (err.textContent = 'Error validating password.');
				console.error(ex);
			}
		});
	}

	if (document.readyState === 'complete' || document.readyState === 'interactive') {
		setTimeout(wireShield, 0);
	} else {
		document.addEventListener('DOMContentLoaded', wireShield);
	}
})();
</script>