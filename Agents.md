## Proposal: Migrate Blog Pagination to jekyll-paginate-v2 (Keep /blog/ Path)

### 1. Current Situation
| Aspect | Current | Issue |
|--------|---------|-------|
| Plugin | `jekyll-paginate` (v1) | Only paginates the root index; cannot paginate `/blog/` subpath. |
| Blog Listing Page | `blog/index.html` with `layout: home` | Shows all posts but page navigation links reload same page. |
| Config | `_config.yml` has `paginate: 6` and `paginate_path: /blog/page:num/` | These settings are ignored because v1 applies only to root index. |

### 2. Why v2 (jekyll-paginate-v2)
`jekyll-paginate-v2` adds:
- Pagination on any page (not just root)
- Flexible permalink patterns (`/blog/page:num/` works)
- Extra features: page trails, filtering, sorting, categories/tags pagination
- Actively used with Minimal Mistakes (theme supports its `pagination` data object)

Trade-off: Not whitelisted on GitHub Pages’ default build. We must build the site ourselves (locally or via GitHub Actions) and publish the generated static files.

### 3. High-Level Plan
1. Add `jekyll-paginate-v2` gem; remove `jekyll-paginate` gem and plugin entry.
2. Update `_config.yml` with new `plugins:` list and a `pagination:` (site-wide defaults are optional; we’ll mostly drive from page front matter).
3. Update `blog/index.html` front matter to include a `pagination:` block defining collection, per_page, permalink, and trail.
4. Remove unused front matter keys (`page_num`, `per_page`).
5. Add a minimal GitHub Actions workflow to build the site and deploy to `gh-pages` branch (or keep building locally and push `_site/`).
6. Test locally: `bundle install`, `bundle exec jekyll serve` verifying `/blog/page2/` etc.
7. (Optional) Add redirect so old `/blog/` links remain (already same path so minimal).
8. Commit and push; confirm GitHub Pages serves from the deploy branch.

### 4. Detailed Changes (Draft – Not Applied Yet)

#### Gemfile
```ruby
# Remove or comment out
# gem "jekyll-paginate"

# Add
gem "jekyll-paginate-v2"
```

Run locally after edit:
```
bundle update jekyll-paginate-v2 || bundle install
```

#### _config.yml
```yaml
plugins:
	- jekyll-feed
	- jekyll-sitemap
	- jekyll-include-cache
	- jekyll-paginate-v2

# Remove old keys:
# paginate: 6
# paginate_path: /blog/page:num/

# (Optional) global defaults
pagination:
	enabled: true
	per_page: 6
	title: ':title — Page :num'
	permalink: '/blog/page:num/'
	sort_field: 'date'
	sort_reverse: true
	trail:
		before: 2
		after: 2
```
Note: Page-level settings override global defaults.

#### blog/index.html Front Matter (proposed)
```yaml
---
layout: home
title: "Blog"
permalink: /blog/
author_profile: true
entries_layout: grid
show_excerpts: true
classes: wide
pagination:
	enabled: true
	collection: posts
	per_page: 6          # override if different from global
	permalink: '/blog/page:num/'
	sort_field: 'date'
	sort_reverse: true
	trail:
		before: 2
		after: 2
---
```

Remove the obsolete custom keys `page_num`, `per_page`.

#### Theme Integration Notes
Minimal Mistakes automatically uses `pagination.posts` (v2 object) when present. No liquid edits needed unless we want custom ordering or filtering.

### 5. GitHub Actions Deployment (Recommended)
Because GitHub Pages cannot build `jekyll-paginate-v2`, we pre-build.

Add `.github/workflows/build.yml`:
```yaml
name: Build and Deploy
on:
	push:
		branches: [ main ]
	workflow_dispatch:
jobs:
	build-deploy:
		runs-on: ubuntu-latest
		steps:
			- uses: actions/checkout@v4
			- uses: ruby/setup-ruby@v1
				with:
					ruby-version: '3.3' # or version matching local Gemfile.lock
					bundler-cache: true
			- name: Build site
				run: bundle exec jekyll build --trace
			- name: Deploy to gh-pages
				uses: peaceiris/actions-gh-pages@v3
				with:
					github_token: ${{ secrets.GITHUB_TOKEN }}
					publish_dir: ./_site
					publish_branch: gh-pages
```

Then in repository Settings > Pages:
1. Source: Deploy from branch
2. Branch: `gh-pages` (root)

Alternative: Keep using `main` by committing the built `_site/` (not recommended; pollutes history).

### 6. Local Test Procedure
1. Make edits above.
2. `bundle install` (adds paginate-v2) – fix any Gem version conflicts.
3. `bundle exec jekyll serve`.
4. Visit: `/blog/` (page 1), click page 2 -> `/blog/page2/` should render next 6 posts.
5. Validate canonical links and sitemap entries (jekyll-sitemap should include new pages automatically).

### 7. SEO & URL Integrity
Old URL `/blog/` unchanged. New pages `/blog/page2/` etc. are additive; no redirects needed. Ensure no duplicate content (don’t leave root index also listing posts with full set; that would create duplicate first page). Root index currently is a splash; that’s fine.

### 8. Rollback Plan
If build pipeline fails, switch Pages back to `main` and re-enable old config (remove v2 plugin, restore `paginate` keys). Site will function (without proper /blog/ pagination) while investigating.

### 9. Edge Cases & Considerations
- If posts < per_page, no extra pages are generated (pagination bar will not appear).
- Future filters: You can add category pages with additional front matter blocks each having its own `pagination:` block.
- Avoid mixing both v1 and v2 keys; remove `paginate` and `paginate_path` to prevent confusion.
- Keep Gemfile.lock committed so Action uses identical versions.

### 10. Timeline (Estimated)
| Step | Effort |
|------|--------|
| Edits + Gem update | 5–10 min |
| Local build test | 5 min |
| Add Action + first deploy | 5–10 min |
| Verification | 2–3 min |

### 11. Approval Checklist (Before Implementing)
- [ ] Confirm we want GitHub Actions deployment (vs. local manual build)
- [ ] Confirm per_page = 6
- [ ] Confirm pagination trail size (2 / 2)
- [ ] Confirm Ruby version to pin (use from current environment if needed)

### 12. Next Step
Give approval or adjustments on any of the checklist items. After that I’ll implement the changes.

---
End of proposal (no code changes applied yet).
