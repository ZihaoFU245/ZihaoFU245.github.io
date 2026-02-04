---
title: "Résumé"
permalink: /resume/
layout: single
classes: wide
author_profile: true
---

<div class="resume-actions">
  <a href="{{ '/assets/resume/Resume.html' | relative_url }}" target="_blank" rel="noopener">Open in new tab</a>
  <button type="button" onclick="printResume()">Print Resume</button>
</div>

<iframe
    id="resume-iframe" 
    src="{{ '/assets/resume/Resume.html' | relative_url }}"
    width="100%"
    height="1000"
    style="border:0;"
    title="Resume">
</iframe>

<style>
  .resume-actions {
    display: flex;
    flex-wrap: wrap;
    gap: 12px;
    margin: 0 0 12px;
  }
  .resume-actions a,
  .resume-actions button {
    padding: 8px 14px;
    border-radius: 6px;
    border: 1px solid #555;
    background: #fff;
    color: #222;
    text-decoration: none;
  }
  .resume-actions button {
    cursor: pointer;
  }
  #resume-iframe {
    min-height: 70vh;
  }
  @media (max-width: 600px) {
    #resume-iframe {
      height: 80vh;
    }
  }
</style>

<script>
function printResume() {
    const iframe = document.getElementById('resume-iframe');
    if (!iframe) 
        return;
    try {
        iframe.contentWindow.focus();
        iframe.contentWindow.print();
    } catch (e) {
        // fallback: open file in new window
        window.open(iframe.src, '_blank');
    }

}
</script>
