// Record every color-chip click; highlight each; redirect when the LAST N clicks equal SEQ.
(function () {
    const TARGET = "/70xJS11XCBeO13rb-18QamyFA3z1clbODGzOcMSHDfs/";
    const SEQ = ["orange", "orange", "blue", "gold", "red"]; // target sequence
    const inputs = []; // full history this page load

    // Create a lightweight log display (visually subtle)
    const log = document.createElement("div");
    // log.id = "color-seq-log";
    // log.style.cssText = "position:fixed;bottom:6px;right:8px;font:12px/1.2 system-ui,Arial,sans-serif;background:rgba(0,0,0,.45);color:#fff;padding:4px 6px;border-radius:4px;z-index:9999;max-width:40vw;pointer-events:none;opacity:.55";
    // log.setAttribute("aria-live", "polite");
    // log.textContent = "Input: (none)";
    document.addEventListener("DOMContentLoaded", () => document.body.appendChild(log));

    function updateLog() {
        if (!log.parentNode) return; // in case not yet attached
        const txt = inputs.length ? inputs.join(", ") : "(none)";
        log.textContent = "Input: " + txt;
    }

    function tailMatches() {
        if (inputs.length < SEQ.length) return false;
        for (let i = 0; i < SEQ.length; i++) {
            if (inputs[inputs.length - SEQ.length + i] !== SEQ[i]) return false;
        }
        return true;
    }

    document.addEventListener("click", (ev) => {
        const el = ev.target.closest(".color-chip");
        if (!el) return;
        const key = (el.getAttribute("data-key") || "").toLowerCase();
        if (!key) return;
        inputs.push(key);
        // Always add success highlight (only once)
        el.classList.add("success");
        updateLog();
        if (tailMatches()) {
            // Visual effect then redirect
            document.documentElement.style.transition = "filter .24s, opacity .24s";
            document.documentElement.style.filter = "blur(2px)";
            document.documentElement.style.opacity = "0.92";
            setTimeout(() => (window.location.href = TARGET), 220);
        }
    }, { passive: true });
})();
