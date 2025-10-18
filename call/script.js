// Reaction counter script (externalized)
// Features:
// - Parses existing button labels like "🔥99+" or "💘 4" or just "✨"
// - Maintains internal numeric count (capped visually at 99 -> shows 99+)
// - Toggle to add/remove a single reaction per user (non-persistent)
// - Accessible via aria-pressed
// - Idempotent (safe to run multiple times)
(function () {
    const CAP = 99;
    const BUTTON_SELECTOR = '.mini-reactions button';

    function parseInitial(btn) {
        const span = btn.querySelector('span') || document.createElement('span');
        if (!span.parentNode) btn.appendChild(span);
        // Clone without the live span to inspect text
        const clone = btn.cloneNode(true);
        const cSpan = clone.querySelector('span');
        if (cSpan) cSpan.remove();
        const raw = clone.textContent.trim();
        let label = raw; let count = 0;
        // Match something like: label (possibly emoji + text) optional number with optional +
        const m = raw.match(/^(.*?)(?:\s*(\d+)(\+)?)?$/);
        if (m) {
            label = (m[1] || '').trim();
            if (m[2]) count = parseInt(m[2], 10);
        }
        if (!label) label = raw; // fallback
        return { label, count, span };
    }

    function render(btn) {
        const count = parseInt(btn.dataset.count || '0', 10);
        const label = btn.dataset.label;
        const span = btn.querySelector('span');
        // Clear and rebuild
        btn.innerHTML = '';
        btn.appendChild(document.createTextNode(label + ' '));
        const display = count === 0 ? '' : (count > CAP ? CAP + '+' : (count >= CAP ? CAP + '+' : count));
        // The (count >= CAP ? CAP + '+' : count) ensures exact 99 shows 99+, >99 also 99+
        span.textContent = display;
        btn.appendChild(span);
    }

    function update(btn, delta) {
        let count = parseInt(btn.dataset.count || '0', 10);
        count += delta;
        if (count < 0) count = 0;
        // We still store the true count for potential analytics, but cap display.
        btn.dataset.count = count;
        render(btn);
    }

    function init(btn) {
        if (btn.dataset.reactionsInitialized) return; // idempotent
        const { label, count, span } = parseInitial(btn);
        btn.dataset.label = label;
        btn.dataset.count = count;
        btn.dataset.reactionsInitialized = 'true';
        btn.setAttribute('aria-pressed', 'false');
        btn.setAttribute('title', 'React with ' + label);
        // Ensure span attached once
        if (!span.parentNode) btn.appendChild(span);
        render(btn);
        btn.addEventListener('click', function (e) {
            e.preventDefault();
            const active = btn.classList.toggle('chosen');
            btn.setAttribute('aria-pressed', active ? 'true' : 'false');
            update(btn, active ? 1 : -1);
        });
    }

    function run() {
        document.querySelectorAll(BUTTON_SELECTOR).forEach(init);
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', run);
    } else {
        run();
    }
})();
