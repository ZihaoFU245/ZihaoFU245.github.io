# My Portfolio
Built with Jekyll and the remote Minimal Mistakes theme.

## Structure
- `_config.yml`: theme and plugins
- `_pages/`: content pages
- `index.md`: homepage
- `_data/`: navigation and config
- `assets/`: images, scripts, and styles

## Local Development
1. Install Ruby (>= 3.3) and Bundler.
2. Configure Bundler to install gems locally:
   ```bash
   bundle config set --local path "vendor/bundle"
   bundle config set --local cache_path "vendor/cache"
   ```
3. Install gems:
   ```bash
   bundle install
   ```
4. Start the local server:
   ```bash
   bundle exec jekyll serve --livereload
   ```
5. Open http://localhost:4000.

## Deployment Workflow
This repo uses a GitHub Actions workflow (`.github/workflows/build.yml`) to build and deploy.

Branches:
- `main`: Source content + configuration. Pushing here triggers a build and deploy.
- `migrated` (or other feature branches): Build is run for verification, but deploy step is skipped (guarded by branch check).
- `gh-pages`: Built static site (artifact) published automatically; you do not edit this branch manually.

Action steps:
1. Checkout source.
2. Setup Ruby 3.3 with bundler cache.
3. Run `bundle exec jekyll build` producing `_site/`.
4. Publish `_site/` to `gh-pages` (only when ref == main) using `peaceiris/actions-gh-pages`.

## Adding Content
Posts: add Markdown files under `_posts/` named `YYYY-MM-DD-title.md`.
Pages: place Markdown under `_pages/` (ensure front matter `permalink:` if you want a custom URL).
Images: put under `assets/` (e.g. `assets/images/`) and reference with absolute path `/assets/...`.

## Pagination
Implemented with `jekyll-paginate-v2` on `blog/index.md`.
Adjust page size: change `per_page` in that file (test with a low number, then raise for production).

## Updating Dependencies
Update gems:
```bash
bundle update
```
Commit updated `Gemfile.lock` (except when deploying only via GitHub Pages with locked versions; here we do commit it for reproducibility).

## Common Tasks
Rebuild clean:
```bash
bundle exec jekyll clean && bundle exec jekyll build
```
Validate build locally before pushing:
```bash
bundle exec jekyll build --trace
```

## Troubleshooting
- Pagination shows 1 page in logs but extra pages exist: log counts only generated pages beyond the source page; check `/blog/page/2/`.
- Plugin not loading: ensure it’s in both `Gemfile` (inside `group :jekyll_plugins`) and `_config.yml` `plugins:` list.
- Build fails on GitHub: inspect Actions logs; often a missing gem or YAML syntax (avoid tabs).

## Future Enhancements (Optional)
- Enable tag/category AutoPages via additional paginate-v2 config if needed.
- Add caching include (`jekyll-include-cache`) usage by wrapping heavy includes with `{% include_cached %}` for speed.
- Implement CSS compile migration away from deprecated Sass `@import` to `@use` when the theme updates.

## License
Content is mine; theme (Minimal Mistakes) is MIT.
