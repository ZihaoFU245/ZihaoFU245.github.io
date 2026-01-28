---
title: "Résumé"
permalink: /resume/
layout: single
classes: wide
author_profile: true
---

<button onclick="printResume()">Print Resume</button>

<iframe
    id="resume-iframe" 
    src="{{ '/assets/resume/Resume.html' | relative_url }}"
    width="100%"
    height="1000"
    style="border:0;"
    title="Resume">
</iframe>

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
