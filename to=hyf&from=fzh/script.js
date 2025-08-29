// ------- CONFIG (edit this part) -------
const DEFAULTS = {
    to: "胡雨凡",      // receiver's display name
    from: "fzh",   // your name
    signoff: "Love Ya🙀,",
    // Write your story/letter below. Use \n\n for paragraph breaks.
    text: [
        "亲爱的，七夕快乐。",
        "遇见你之后，平凡的日子也有了星光。",
        "你的笑容，总能让我在最忙乱的时候安静下来。",
        "无论未来多么未知，我都想牵着你的手，一起走下去。"
    ].join("\n\n"),
    music: "TOL.mp3" // replace with your own bg music, or set to "" to disable
};
// ------- END CONFIG -------

// URL params personalization
const params = new URLSearchParams(location.search);
const toName = params.get('to') || DEFAULTS.to;
const fromName = params.get('from') || DEFAULTS.from;

// Fill header/byline
document.getElementById('toName').textContent = toName;
document.getElementById('fromName').textContent = fromName;
document.getElementById('sig').textContent = `\n${DEFAULTS.signoff}\n${fromName}`;
document.getElementById('date').textContent = new Date().toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });

// Title element (for social share)
document.title = `for ${toName} — a letter`;

// Typewriter logic
const el = document.getElementById('letter');
let idx = 0, playing = false, timer = null, speed = 24; // chars/sec

function renderChunk() {
    const content = DEFAULTS.text;
    if (idx >= content.length) { stopTyping(); burstHearts(14); return; }
    el.textContent = content.slice(0, idx);
    // soft scroll
    el.scrollTop = el.scrollHeight;
    idx++;
}
function playTyping() { if (playing) return; playing = true; caretOn(); timer = setInterval(renderChunk, 1000 / speed); }
function pauseTyping() { playing = false; caretOff(); clearInterval(timer); }
function stopTyping() { pauseTyping(); caretOff(); }
function replayTyping() { idx = 0; el.textContent = ''; playTyping(); }

// Caret visual
const caret = document.createElement('span'); caret.className = 'caret';
function caretOn() { if (!el.contains(caret)) el.appendChild(caret); }
function caretOff() { if (el.contains(caret)) el.removeChild(caret); }

// Buttons
document.getElementById('play').onclick = playTyping;
document.getElementById('pause').onclick = pauseTyping;
document.getElementById('replay').onclick = replayTyping;
document.getElementById('printBtn').onclick = () => window.print();
document.getElementById('fullscreen').onclick = (e) => { e.preventDefault(); if (document.fullscreenElement) { document.exitFullscreen() } else { document.documentElement.requestFullscreen() } };

// Share link with current names
document.getElementById('share').onclick = async () => {
    const url = new URL(location.href);
    url.searchParams.set('to', toName); url.searchParams.set('from', fromName);
    try { await navigator.clipboard.writeText(url.toString()); alert('Link copied!'); }
    catch { prompt('Copy this link:', url.toString()); }
};

// Background music (optional)
const bg = new Audio();
if (DEFAULTS.music) { bg.src = DEFAULTS.music; bg.loop = true; bg.volume = 0.35; }
const toggleBtn = document.getElementById('toggleMusic');
// Attempt to autoplay background music on load (may be blocked by browser policies)
if (DEFAULTS.music) {
    // start volume at 0 for a subtle fade-in
    bg.volume = 0;
    const targetVolume = 0.35;
    function fadeIn(){
        const step = 0.05; // volume increment
        const iv = setInterval(()=>{
            if(bg.volume + step >= targetVolume){ bg.volume = targetVolume; clearInterval(iv); }
            else bg.volume += step;
        }, 160);
    }
    function successAutoplay(){
        toggleBtn.textContent = '❚❚ Music';
        heart();
        fadeIn();
        removeUserGestureListeners();
    }
    function tryPlay(){
        bg.play().then(successAutoplay).catch(()=>{
            // Will wait for first user gesture
        });
    }
    // Fallback: wait for first user interaction if autoplay blocked
    const gestureEvents = ['click','touchstart','keydown'];
    function onFirstGesture(){
        tryPlay();
    }
    function removeUserGestureListeners(){
        gestureEvents.forEach(ev=>window.removeEventListener(ev,onFirstGesture));
    }
    gestureEvents.forEach(ev=>window.addEventListener(ev,onFirstGesture,{once:true}));
    // initial attempt immediately
    tryPlay();
}
toggleBtn.onclick = async () => {
    if (!DEFAULTS.music) return alert('No music configured. Set DEFAULTS.music to your file.');
    if (bg.paused) { await bg.play(); toggleBtn.textContent = '❚❚ Music'; heart(); } else { bg.pause(); toggleBtn.textContent = '♪ Music'; }
};

// Hearts burst on completion and gentle single heart on music toggle
function heart() {
    const h = document.createElement('div');
    h.className = 'heart'; h.textContent = ['💌', '🌹', '🕊️', '🎶', '⭐', '⚡', '🐢', '💘'][Math.floor(Math.random() * 8)];
    h.style.left = Math.random() * 100 + 'vw'; h.style.filter = `hue-rotate(${Math.random() * 40 - 20}deg)`; h.style.animationDuration = (4 + Math.random() * 3) + 's';
    document.body.appendChild(h); setTimeout(() => h.remove(), 7000);
}
function burstHearts(n) { for (let i = 0; i < n; i++) setTimeout(heart, i * 120); }

// Auto-start typewriter after a beat
setTimeout(playTyping, 800);

// Optional narration control sync: play/pause with typewriter
const narration = document.getElementById('audio');
narration?.addEventListener('play', () => { if (bg.src && bg.paused) bg.play(); });
narration?.addEventListener('pause', () => { /* keep bg music if desired; do nothing */ });
// When replaying typing, optionally restart narration
const origReplay = replayTyping;
replayTyping = function(){
    if(narration && !narration.paused){ narration.currentTime = 0; }
    origReplay();
};
