document.addEventListener("DOMContentLoaded", () => {
  const titleEl = document.getElementById("page-title");
  if (!titleEl) return;

  // Build tight wrapper around title text if missing
  let wrap = titleEl.querySelector(".title-wrap");
  if (!wrap) {
    wrap = document.createElement("span");
    wrap.className = "title-wrap";
    while (titleEl.firstChild) wrap.appendChild(titleEl.firstChild);
    titleEl.appendChild(wrap);
  }

  // Load configuration
  fetch("/assets/bubble-config.json", { cache: "no-store" })
    .then(r => r.ok ? r.json() : Promise.reject(r.status))
    .then(cfg => {
      if (!cfg || cfg.status !== "on") return; // feature toggled off

      let bubble = titleEl.querySelector(".bubble");
      if (!bubble) {
        bubble = document.createElement("span");
        bubble.className = "bubble";
      }

      const emoji = cfg.emoji || "💬";
      const rawText = (cfg.text || "").trim();

      // 1. Extract URL from custom <a>URL</a> marker (stable & explicit)
      const markerRegex = /<a>(.*?)<\/a>/i;
      let url = null;
      const markerMatch = rawText.match(markerRegex);
      if (markerMatch) {
        url = markerMatch[1].trim();
      }

      // 2. Strip marker completely from visible text
      let textWithoutUrl = rawText.replace(markerRegex, '').replace(/\s{2,}/g, ' ').trim();

      // 3. Detect phrase variants we want to turn into link
      const phraseRegex = /(check\s+(?:this\s+)?out!?)/i; // captures original casing & optional '!'
      const phraseMatch = textWithoutUrl.match(phraseRegex);
      let phraseStart = -1;
      let phraseLen = 0;
      let originalPhrase = '';
      if (phraseMatch) {
        phraseStart = phraseMatch.index;
        originalPhrase = phraseMatch[0];
        phraseLen = originalPhrase.length;
      }

      // Build DOM nodes to avoid risky innerHTML concatenation
      bubble.textContent = ''; // clear
      const emojiSpan = document.createElement('span');
      emojiSpan.className = 'bubble-emoji';
      emojiSpan.setAttribute('aria-hidden', 'true');
      emojiSpan.textContent = emoji;
      bubble.appendChild(emojiSpan);

      const textSpan = document.createElement('span');
      textSpan.className = 'bubble-text';

      if (phraseStart !== -1 && url) {
        const before = textWithoutUrl.slice(0, phraseStart);
        if (before) textSpan.appendChild(document.createTextNode(before));
        const a = document.createElement('a');
        a.className = 'bubble-link';
        a.href = url;
        a.target = '_blank';
        a.rel = 'noopener noreferrer';
        a.textContent = originalPhrase.trim();
        textSpan.appendChild(a);
        const after = textWithoutUrl.slice(phraseStart + phraseLen);
        if (after) textSpan.appendChild(document.createTextNode(after));
      } else if (url) {
        // Fallback: append a short linked call-to-action at end if phrase missing
        textSpan.appendChild(document.createTextNode(textWithoutUrl + ' '));
        const a = document.createElement('a');
        a.className = 'bubble-link';
        a.href = url;
        a.target = '_blank';
        a.rel = 'noopener noreferrer';
        a.textContent = 'Link';
        textSpan.appendChild(a);
      } else {
        textSpan.appendChild(document.createTextNode(textWithoutUrl));
      }
      bubble.appendChild(textSpan);

      bubble.setAttribute("role", "note");
      bubble.setAttribute("aria-label", `${emoji} ${textWithoutUrl}`.trim());

      // Apply custom colors if provided
      if (cfg.bg) bubble.style.background = cfg.bg;
      if (cfg.color) bubble.style.color = cfg.color;

      // Offsets from config -> CSS variables
      if (typeof cfg.offsetX === "number") bubble.style.setProperty("--offset-x", cfg.offsetX + "px");
      if (typeof cfg.offsetY === "number") bubble.style.setProperty("--offset-y", cfg.offsetY + "px");

      // Tail background sync
      const bg = getComputedStyle(bubble).backgroundColor;
      bubble.style.setProperty("--bubble-bg", bg);

      wrap.appendChild(bubble);
    })
    .catch(() => {
      // Silent fail: minimal bubble fallback
      let bubble = titleEl.querySelector(".bubble");
      if (!bubble) {
        bubble = document.createElement("span");
        bubble.className = "bubble";
        bubble.textContent = "💬";
        wrap.appendChild(bubble);
      }
      const bg = getComputedStyle(bubble).backgroundColor;
      bubble.style.setProperty("--bubble-bg", bg);
    });
});
