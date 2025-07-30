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

## Error from GitHub
```
Run actions/jekyll-build-pages@v1
  with:
    source: .
    destination: ./_site
    future: false
    build_revision: aa540ca5ff2d8307a2331ef26a9ebd6819b99564
    verbose: true
    token: ***
/usr/bin/docker run --name ghcrioactionsjekyllbuildpagesv1013_69e105 --label 9ad8ae --workdir /github/workspace --rm -e "INPUT_SOURCE" -e "INPUT_DESTINATION" -e "INPUT_FUTURE" -e "INPUT_BUILD_REVISION" -e "INPUT_VERBOSE" -e "INPUT_TOKEN" -e "HOME" -e "GITHUB_JOB" -e "GITHUB_REF" -e "GITHUB_SHA" -e "GITHUB_REPOSITORY" -e "GITHUB_REPOSITORY_OWNER" -e "GITHUB_REPOSITORY_OWNER_ID" -e "GITHUB_RUN_ID" -e "GITHUB_RUN_NUMBER" -e "GITHUB_RETENTION_DAYS" -e "GITHUB_RUN_ATTEMPT" -e "GITHUB_ACTOR_ID" -e "GITHUB_ACTOR" -e "GITHUB_WORKFLOW" -e "GITHUB_HEAD_REF" -e "GITHUB_BASE_REF" -e "GITHUB_EVENT_NAME" -e "GITHUB_SERVER_URL" -e "GITHUB_API_URL" -e "GITHUB_GRAPHQL_URL" -e "GITHUB_REF_NAME" -e "GITHUB_REF_PROTECTED" -e "GITHUB_REF_TYPE" -e "GITHUB_WORKFLOW_REF" -e "GITHUB_WORKFLOW_SHA" -e "GITHUB_REPOSITORY_ID" -e "GITHUB_TRIGGERING_ACTOR" -e "GITHUB_WORKSPACE" -e "GITHUB_ACTION" -e "GITHUB_EVENT_PATH" -e "GITHUB_ACTION_REPOSITORY" -e "GITHUB_ACTION_REF" -e "GITHUB_PATH" -e "GITHUB_ENV" -e "GITHUB_STEP_SUMMARY" -e "GITHUB_STATE" -e "GITHUB_OUTPUT" -e "RUNNER_OS" -e "RUNNER_ARCH" -e "RUNNER_NAME" -e "RUNNER_ENVIRONMENT" -e "RUNNER_TOOL_CACHE" -e "RUNNER_TEMP" -e "RUNNER_WORKSPACE" -e "ACTIONS_RUNTIME_URL" -e "ACTIONS_RUNTIME_TOKEN" -e "ACTIONS_CACHE_URL" -e "ACTIONS_ID_TOKEN_REQUEST_URL" -e "ACTIONS_ID_TOKEN_REQUEST_TOKEN" -e "ACTIONS_RESULTS_URL" -e GITHUB_ACTIONS=true -e CI=true -v "/var/run/docker.sock":"/var/run/docker.sock" -v "/home/runner/work/_temp/_github_home":"/github/home" -v "/home/runner/work/_temp/_github_workflow":"/github/workflow" -v "/home/runner/work/_temp/_runner_file_commands":"/github/file_commands" -v "/home/runner/work/ZihaoFU245.github.io/ZihaoFU245.github.io":"/github/workspace" ghcr.io/actions/jekyll-build-pages:v1.0.13
To use retry middleware with Faraday v2.0+, install `faraday-retry` gem
/usr/local/bundle/gems/jekyll-remote-theme-0.4.3/lib/jekyll-remote-theme/downloader.rb:67:in `raise_unless_sucess': 404 - Not Found - Loading URL: https://codeload.github.com/mmistakes/minimal-mistakes/zip/latest (Jekyll::RemoteTheme::DownloadError)
	from /usr/local/bundle/gems/jekyll-remote-theme-0.4.3/lib/jekyll-remote-theme/downloader.rb:44:in `block (2 levels) in download'
	from /usr/local/lib/ruby/3.3.0/net/http.rb:2353:in `block in transport_request'
	from /usr/local/lib/ruby/3.3.0/net/http/response.rb:320:in `reading_body'
	from /usr/local/lib/ruby/3.3.0/net/http.rb:2352:in `transport_request'
	from /usr/local/lib/ruby/3.3.0/net/http.rb:2306:in `request'
	from /usr/local/bundle/gems/jekyll-remote-theme-0.4.3/lib/jekyll-remote-theme/downloader.rb:43:in `block in download'
	from /usr/local/lib/ruby/3.3.0/net/http.rb:1570:in `start'
	from /usr/local/lib/ruby/3.3.0/net/http.rb:1029:in `start'
	from /usr/local/bundle/gems/jekyll-remote-theme-0.4.3/lib/jekyll-remote-theme/downloader.rb:42:in `download'
	from /usr/local/bundle/gems/jekyll-remote-theme-0.4.3/lib/jekyll-remote-theme/downloader.rb:24:in `run'
	from /usr/local/bundle/gems/jekyll-remote-theme-0.4.3/lib/jekyll-remote-theme/munger.rb:24:in `munge!'
	from /usr/local/bundle/gems/jekyll-remote-theme-0.4.3/lib/jekyll-remote-theme.rb:27:in `init'
	from /usr/local/bundle/gems/jekyll-remote-theme-0.4.3/lib/jekyll-remote-theme.rb:33:in `block in <top (required)>'
	from /usr/local/bundle/gems/jekyll-3.10.0/lib/jekyll/hooks.rb:103:in `block in trigger'
	from /usr/local/bundle/gems/jekyll-3.10.0/lib/jekyll/hooks.rb:102:in `each'
	from /usr/local/bundle/gems/jekyll-3.10.0/lib/jekyll/hooks.rb:102:in `trigger'
	from /usr/local/bundle/gems/jekyll-3.10.0/lib/jekyll/site.rb:105:in `reset'
	from /usr/local/bundle/gems/jekyll-3.10.0/lib/jekyll/site.rb:68:in `process'
	from /usr/local/bundle/gems/jekyll-3.10.0/lib/jekyll/command.rb:28:in `process_site'
	from /usr/local/bundle/gems/jekyll-3.10.0/lib/jekyll/commands/build.rb:65:in `build'
	from /usr/local/bundle/gems/jekyll-3.10.0/lib/jekyll/commands/build.rb:36:in `process'
	from /usr/local/bundle/gems/github-pages-232/bin/github-pages:70:in `block (3 levels) in <top (required)>'
	from /usr/local/bundle/gems/mercenary-0.3.6/lib/mercenary/command.rb:220:in `block in execute'
	from /usr/local/bundle/gems/mercenary-0.3.6/lib/mercenary/command.rb:220:in `each'
	from /usr/local/bundle/gems/mercenary-0.3.6/lib/mercenary/command.rb:220:in `execute'
	from /usr/local/bundle/gems/mercenary-0.3.6/lib/mercenary/program.rb:42:in `go'
	from /usr/local/bundle/gems/mercenary-0.3.6/lib/mercenary.rb:19:in `program'
	from /usr/local/bundle/gems/github-pages-232/bin/github-pages:6:in `<top (required)>'
	from /usr/local/bundle/bin/github-pages:25:in `load'
	from /usr/local/bundle/bin/github-pages:25:in `<main>'
Error:  Logging at level: debug Configuration file: /github/workspace/./_config.yml GitHub Pages: github-pages v232 GitHub Pages: jekyll v3.10.0 Theme: jekyll-theme-primer Theme source: /usr/local/bundle/gems/jekyll-theme-primer-0.6.0 Requiring: jekyll-github-metadata Requiring: jekyll-seo-tag Requiring: jekyll-include-cache Requiring: jekyll-coffeescript Requiring: jekyll-commonmark-ghpages Requiring: jekyll-gist Requiring: jekyll-github-metadata Requiring: jekyll-paginate Requiring: jekyll-relative-links Requiring: jekyll-optional-front-matter Requiring: jekyll-readme-index Requiring: jekyll-default-layout Requiring: jekyll-titles-from-headings Requiring: jekyll-remote-theme GitHub Metadata: Initializing... Source: /github/workspace/. Destination: /github/workspace/./_site Incremental build: disabled. Enable with --incremental Generating... Theme: mmistakes/minimal-mistakes@latest Theme source: /tmp/jekyll-remote-theme-20250730-7-33dmjz Remote Theme: Using theme mmistakes/minimal-mistakes Remote Theme: Downloading https://codeload.github.com/mmistakes/minimal-mistakes/zip/latest to /tmp/jekyll-remote-theme-20250730-7-69u58z.zip github-pages 232 | Error: 404 - Not Found - Loading URL: https://codeload.github.com/mmistakes/minimal-mistakes/zip/latest 
```

**Agent should strictly follow these steps to resolve the 404 error and launch a functional, stylish portfolio using Minimal Mistakes.**
