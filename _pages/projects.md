---
title: "Projects"
permalink: /projects/
layout: single
classes: wide
author_profile: true
---
## My Project Collections

{% assign sorted_projects = site.projects | sort: 'date' | reverse %}
{% for project in sorted_projects %}
### [{{ project.title }}]({{ project.url | relative_url }})

{% if project.cover %}
![cover]({{ project.cover }})
{% endif %}

{{ project.excerpt | default: project.content | strip_html | truncate: 160 }}

[Read more]({{ project.url | relative_url }})

---

{% endfor %}


