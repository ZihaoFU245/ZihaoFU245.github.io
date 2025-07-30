# AGENT.md

## 🚨 Current Issue

The website at [https://zihaofu245.github.io/](https://zihaofu245.github.io/) is currently showing a **404 error** because there is no `index.html` or homepage present in the repository.

---

## 🛠️ Tasks for Agent

### 1. **Set Up Minimal Mistakes as a Remote Theme**

* In the root of the repo, create a `_config.yml` file with the following content (update placeholders as needed):

  ```yaml
  title: "Zihao's Portfolio"
  description: "Engineer & Computer Science student. Personal website, CV, and projects."
  remote_theme: "mmistakes/minimal-mistakes@latest"
  plugins:
    - jekyll-include-cache

  minimal_mistakes_skin: "default" # Options: default, dark, air, mint, etc.
  repository: "ZihaoFU245/ZihaoFU245.github.io"

  author:
    name: "Zihao []"
    avatar: "/assets/images/profile.jpg"
    bio: "Engineer, Computer Science student at HKUST. Interested in AI, systems, and more."
    location: "[]"
    email: "[]"
    github: "ZihaoFU245"
    linkedin: "[]"
    # Add more fields as needed

  # Navigation (example)
  defaults:
    - scope:
        path: ""
        type: pages
      values:
        layout: single
  ```

---

### 2. **Create Home Page (`index.md`)**

* In the root, create `index.md`:

  ```markdown
  ---
  layout: home
  title: "Home"
  author_profile: true
  ---
  Welcome to my website! I am [Zihao], an engineer and computer science student.
  ```

---

### 3. **Create Pages Folder and Content**

* Create a folder `_pages/`.

* Add `about.md`:

  ```markdown
  ---
  title: "About"
  permalink: /about/
  layout: single
  ---
  Hi, I'm [Zihao].  
  - Role: Engineer, Computer Science student at HKUST
  - GPA: 3.53
  - Studied abroad in Madrid during high school
  - UC Berkeley Summer School (Math & CS), 2025
  - [Add more about your background/interests]
  ```

* Add `projects.md`:

  ```markdown
  ---
  title: "Projects"
  permalink: /projects/
  layout: single
  ---
  ## Notable Projects

  - **Friday AI Assistant:** Modular skill-based assistant with MCP server (Python, FastAPI, React, Electron) — [Repo link]()
  - **Music Player App:** PySide6, python-vlc — [Repo link]()
  - **Bone Fracture Detection CNN:** TensorFlow, ResNet-50/FPN — [Repo link]()
  - **Wine Quality Predictor:** scikit-learn — [Repo link]()
  - **Connect Four Evaluator:** NumPy-optimized — [Repo link]()
  - [Add more projects as needed]
  ```

* Add `resume.md`:

  ```markdown
  ---
  title: "Resume"
  permalink: /resume/
  layout: single
  ---
  [Paste your CV content here or provide a link to your downloadable PDF.]
  ```

---

### 4. **Optional: `_data/navigation.yml`** (for site nav)

* Create `_data/navigation.yml` with:

  ```yaml
  main:
    - title: "Home"
      url: /
    - title: "About"
      url: /about/
    - title: "Projects"
      url: /projects/
    - title: "Resume"
      url: /resume/
  ```

---

### 5. **Add Assets Folder (Optional)**

* Create `assets/images/` and place `profile.jpg` if available.

---

### 6. **Commit & Push**

```bash
git add _config.yml index.md _pages/ _data/ assets/
git commit -m "Initialize Minimal Mistakes remote theme site for Zihao"
git push
```

---

## ✅ Success Criteria

* Site homepage renders at `https://zihaofu245.github.io/`
* About, Projects, and Resume pages accessible via navigation.
* Site uses the Minimal Mistakes theme with a clean, professional look.
* All placeholders `[]` should be filled in with up-to-date info as you refine the site.

---

**Agent should strictly follow these steps to resolve the 404 error and launch a functional, stylish portfolio using Minimal Mistakes.**
