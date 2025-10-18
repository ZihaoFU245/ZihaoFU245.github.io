/*!
 * Live Photo (web) — reusable component
 * Behavior:
 *  - Uses the <img> size as layout.
 *  - On first reveal, the video overlays the image, plays ONCE, then fades out.
 *  - Optional replay on click or hover.
 *
 * Markup options:
 *  1) Minimal (JS will create <video> for you):
 *     <div class="live-photo" data-lp-src="clip.mp4" data-lp-webm="clip.webm" data-lp-replay="click">
 *       <img class="lp-img" src="photo.jpg" alt="..." width="800" height="600" />
 *     </div>
 *
 *  2) Manual (you provide <video> and <source>):
 *     <div class="live-photo" data-lp-replay="hover">
 *       <img class="lp-img" src="photo.jpg" alt="..." />
 *       <video class="lp-video" muted playsinline preload="metadata" poster="photo.jpg">
 *         <source src="clip.mp4" type="video/mp4" />
 *         <source src="clip.webm" type="video/webm" />
 *       </video>
 *     </div>
 *
 * Container data attributes:
 *   data-lp-replay="click" | "hover" | "none"   (default: "click")
 *   data-lp-autoplay="true" | "false"          (default: "true" once on first reveal)
 *   data-lp-src="clip.mp4"                      (if you don't include your own <video>)
 *   data-lp-webm="clip.webm"                    (optional)
 *   data-lp-poster="photo.jpg"                  (optional; falls back to <img src>)
 */

(function () {
  const REDUCE_MOTION = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function createVideoIfNeeded(container) {
    let video = container.querySelector('.lp-video');
  // Don't block creation on reduced motion: we may still create on user interaction.
  if (video) return video;

    const img = container.querySelector('.lp-img, img');
    if (!img) return null;

    const mp4 = container.dataset.lpSrc;
    const webm = container.dataset.lpWebm;
    if (!mp4 && !webm) return null;

    video = document.createElement('video');
    video.className = 'lp-video';
    video.muted = true;
    video.playsInline = true;
    video.setAttribute('preload', 'metadata');

    const poster = container.dataset.lpPoster || img.getAttribute('src');
    if (poster) video.setAttribute('poster', poster);

    if (mp4) {
      const s = document.createElement('source');
      s.src = mp4;
      s.type = 'video/mp4';
      video.appendChild(s);
    }
    if (webm) {
      const s = document.createElement('source');
      s.src = webm;
      s.type = 'video/webm';
      video.appendChild(s);
    }

    container.appendChild(video);
    return video;
  }

  function setupContainer(container) {
    const img = container.querySelector('.lp-img, img');
    if (!img) return;

    // Ensure container is focusable for a11y when replay=click
    container.setAttribute('tabindex', '-1');
    container.setAttribute('role', 'img');
    const alt = img.getAttribute('alt') || '';
    container.setAttribute('aria-label', alt);

    const replayMode = (container.dataset.lpReplay || 'click').toLowerCase();
    const autoplay = (container.dataset.lpAutoplay || 'true') === 'true';

  let video = createVideoIfNeeded(container); // may be null if data attrs missing

    let hasPlayedOnce = false;

    const playOnce = () => {
      if (!video) return;
      if (REDUCE_MOTION || hasPlayedOnce) return; // Respect reduced motion for autoplay only
      const p = video.play();
      if (p && typeof p.then === 'function') {
        p.then(() => { video.style.opacity = '1'; }).catch(()=>{});
      } else {
        video.style.opacity = '1';
      }
    };

    // When video ends, fade out, reset to start frame
    if (video) {
      video.addEventListener('ended', () => {
        hasPlayedOnce = true;
        video.style.opacity = '0';
        try { video.currentTime = 0; video.pause(); } catch(_) {}
      });
    }

    // Reveal/fade-in only when actually playing
    const onCanPlayOnce = () => { if (autoplay && !hasPlayedOnce) playOnce(); };
    if (video) {
      video.addEventListener('loadedmetadata', onCanPlayOnce, { once: true });
      video.addEventListener('canplay', onCanPlayOnce, { once: true });
    }

    // Optional: lazy-init via IntersectionObserver (saves bandwidth offscreen)
    if (video) {
      const io = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            if (autoplay && !REDUCE_MOTION && !hasPlayedOnce) {
              playOnce();
            }
            io.unobserve(container);
          }
        });
      }, { root: null, threshold: 0.15 });
      io.observe(container);
    }

    // Replay behavior
    const triggerReplay = () => {
      // On explicit user action we permit motion even if reduced-motion preference set.
      if (!video) {
        video = createVideoIfNeeded(container);
        if (!video) return; // still nothing to play
        // Attach ended listener now that video exists
        video.addEventListener('ended', () => {
          video.style.opacity = '0';
          try { video.currentTime = 0; video.pause(); } catch(_) {}
        });
      }
      try { video.pause(); video.currentTime = 0; } catch(_) {}
      video.style.opacity = '1';
      video.play().catch(()=>{});
    };

    if (replayMode === 'click') {
      container.addEventListener('click', triggerReplay);
      container.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          triggerReplay();
        }
      });
    } else if (replayMode === 'hover') {
      let hovering = false;
      container.addEventListener('mouseenter', () => { hovering = true; triggerReplay(); });
      video.addEventListener('ended', () => {
        if (hovering) {
          // stay faded out after end; next hover will replay
        }
      });
      container.addEventListener('mouseleave', () => { hovering = false; });
    }
  }

  function initLivePhotos(root = document) {
    const containers = root.querySelectorAll('.live-photo');
    containers.forEach(setupContainer);
  }

  // Auto-init on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => initLivePhotos());
  } else {
    initLivePhotos();
  }

  // Expose a tiny API for dynamic content
  window.LivePhoto = { init: initLivePhotos };
})();
