---
layout: single
title: "Git LFS with GitHub Pages: A Practical Guide"
author_profile: true
date: 2025-09-12
categories: 
    - general
excerpt: "Keep your GitHub Pages repository fast and lean by off‑loading big media to Git LFS. Learn the workflow, caveats, and best practices."
classes: wide
header:
    teaser: "/assets/2025-09-12-resources/new-teaser.svg"
---

<figure>
	<img src="/assets/2025-09-12-resources/new-teaser.svg" alt="Flow: repo → Git LFS (media pointers) → gh-pages deployment with large assets tracked separately" style="width:100%;max-width:880px;display:block;margin:0 auto;" />
	<figcaption style="text-align:center;font-size:0.85rem;color:#64748b;margin-top:.4rem;">Light theme overview: keep source light, store heavy binaries via Git LFS, deploy cleanly to GitHub Pages.</figcaption>
</figure>

GitHub Pages is perfect for hosting personal sites, docs, and project hubs—but large binary assets (videos, raw datasets, layered design files, high‑resolution textures, game builds, etc.) can quickly bloat your repository, slow clones, and hit soft limits. **Git Large File Storage (LFS)** solves this by replacing those big blobs in your Git history with lightweight pointer files, while storing the actual content on a dedicated LFS object store maintained by GitHub.

In this guide you'll set up a workflow where your Pages site (often served from `main` or a dedicated `gh-pages` branch) stays lean while still referencing rich media.

We will cover:

1. Why (and when not) to use Git LFS for a Pages site
2. Installing and initializing Git LFS locally
3. Tracking the right patterns (`*.png`, `*.mp4`, etc.) without over-matching
4. Understanding the `.gitattributes` pointer mechanism
5. Adding, committing, and pushing large assets safely
6. Verifying objects are actually in LFS (and not accidentally in normal Git history)
7. Deployment considerations (build pipelines, Jekyll vs. static artifacts)
8. Common pitfalls (bandwidth quotas, repo forks, CI pulls) and how to mitigate them
9. Best practices & maintenance tips (audit, prune, dedupe)

---

## 1. Should you use Git LFS for Pages?

Use LFS when:
- Individual files > 5–10 MB and may change occasionally
- Media needs to be versioned (vs. hosting on a CDN or object store)
- You want a fully self-contained repo experience for collaborators

Consider alternatives when:
- You expect millions of requests (use a CDN/object storage)
- Assets are generated builds that could be re-created
- You have many tiny binary files (overhead outweighs benefit)

> Tip: Pair LFS with caching headers on Pages for static media performance.

## 2. Install & initialize

```bash
git lfs install
```

This sets up required hooks locally. (Run once per machine.)

## 3. Track the right file patterns

Add patterns progressively:

```bash
git lfs track "*.png"
git lfs track "*.mp4"
git lfs track "assets/binaries/*.zip"
```

Check the generated `.gitattributes`:

```bash
cat .gitattributes
```

Avoid wildcarding entire folders too early—keep it intentional.

## 4. Add & commit

```bash
git add .gitattributes assets/hero.mp4 assets/logo@2x.png
git commit -m "Add media assets via LFS"
git push origin main
```

## 5. Verify objects stored in LFS

```bash
git lfs ls-files
```

Each entry should have a SHA pointer. If a large file is missing here, you committed it normally—rewrite before others pull.

## 6. Deployment & Pages builds

GitHub's Pages build (Jekyll or static) will fetch LFS pointers automatically on the server side for public repos. For private → Pages builds (via actions), ensure you have `actions/checkout` with `lfs: true`:

```yaml
- uses: actions/checkout@v4
	with:
		lfs: true
```

## 7. Quotas & limits

- Storage & bandwidth quotas exist (see GitHub docs). Monitor usage in repo settings → LFS.
- Hotlinking large video to external audiences? Consider transcoding + external CDN.

## 8. Maintenance

```bash
git lfs fetch --all
git lfs prune
```

Periodically prune old unreferenced objects locally to save disk space.

## 9. Checklist before inviting collaborators

- [ ] `.gitattributes` reviewed & minimal
- [ ] No large binaries in normal `git rev-list --objects`
- [ ] Actions workflows using `lfs: true`
- [ ] README documents LFS usage & quotas

---

### Quick FAQ

**Can I serve LFS assets directly via CDN?**  You can, but LFS isn't a CDN; for high-traffic media use object storage + CDN.

**Does LFS slow down builds?**  Usually negligible for moderate asset counts; large video sets might benefit from caching in CI.

**Can I migrate existing large files into LFS?**  Yes—use `git lfs migrate import --include="*.mp4"` (will rewrite history; coordinate with collaborators).

---

If you found this helpful, feel free to explore how I'm structuring other media-heavy projects on this site. Next up: comparing LFS vs. alternative asset pipelines.

Happy shipping! 🚀
