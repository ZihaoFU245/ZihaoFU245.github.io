---
title: "Projects"
permalink: /projects/
layout: single
classes: wide
author_profile: true
---
## Active Projects

Work I am currently building and improving.

{% assign active_projects = site.projects | where: 'status', 'active' | sort: 'date' | reverse %}
{% if active_projects.size > 0 %}
{% for project in active_projects %}
### [{{ project.title }}]({{ project.url | relative_url }})

{% if project.cover %}
![{{ project.title }} cover]({{ project.cover }})
{% endif %}

{{ project.excerpt | default: project.content | strip_html | truncate: 160 }}

[Read more]({{ project.url | relative_url }})

---

{% endfor %}
{% else %}
No active projects listed yet. Check back soon.
{% endif %}

## Archived Projects

Past work that I am no longer maintaining.

{% assign archived_projects = site.projects | where: 'status', 'archived' | sort: 'date' | reverse %}
{% for project in archived_projects %}
### [{{ project.title }}]({{ project.url | relative_url }})

{% if project.cover %}
![{{ project.title }} cover]({{ project.cover }})
{% endif %}

{{ project.excerpt | default: project.content | strip_html | truncate: 160 }}

[Read more]({{ project.url | relative_url }})

---

{% endfor %}

