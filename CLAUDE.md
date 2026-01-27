# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is an automated deployment of 阮一峰's "科技爱好者周刊" (Tech Enthusiast Weekly), a popular Chinese tech blog. The project automatically syncs with the upstream repository (ruanyf/weekly), generates a static website using VitePress, creates RSS feeds, and deploys to multiple platforms.

## Core Architecture

### Content Flow
```
upstream/ruanyf/weekly (Markdown articles)
    ↓ [Weekly auto-sync]
your fork/weekly
    ↓ [Push to master]
GitHub Actions CI/CD
    ↓ [Build + Generate RSS]
Static Site (.vitepress/dist/)
    ↓ [Deploy]
GitHub Pages / Vercel / Cloudflare
```

### Key Components

1. **Content Management**
   - `docs/` - Contains all weekly issue markdown files (issue-1.md through issue-371.md)
   - `docs/free-*.md` - Resource pages (free software, photos, music)
   - Files follow naming pattern: `issue-{number}.md`

2. **Build System**
   - **VitePress** (`.vitepress/config.ts`) - Static site generator
   - **TypeScript** - All scripts use TS with tsx execution
   - Build command: `pnpm run build` (runs update-index → vitepress build)

3. **Automation Scripts** (`scripts/`)
   - `generate-rss.ts` - Creates RSS/Atom/JSON feeds from markdown files
   - `generate-sidebar.ts` - Auto-generates sidebar navigation grouped by year
   - `get-latest-issue.ts` - Utility to find highest numbered issue file
   - `update-index.ts` - Updates homepage links to latest issue

4. **GitHub Actions Workflows** (`.github/workflows/`)
   - `sync-upstream.yml` - Weekly auto-sync from upstream (Fridays 10:00 UTC)
   - `deploy.yml` - Builds and deploys to GitHub Pages

## Development Commands

### Essential Commands
```bash
# Install dependencies (uses pnpm)
pnpm install

# Local development server
pnpm run dev
# Site runs at http://localhost:5173

# Full production build (includes RSS generation)
pnpm run build
# Equivalent to: pnpm run update-index && vitepress build

# Preview production build
pnpm run preview

# Manually generate RSS feeds
pnpm run generate-rss
# Creates: .vitepress/dist/feed.xml, atom.xml, feed.json

# Update sidebar (usually automatic)
pnpm run generate-sidebar

# Update homepage with latest issue link
pnpm run update-index

# Get latest issue number
pnpm run get-latest
```

### Testing Changes
Always test locally before pushing:
```bash
pnpm run dev        # Test development build
pnpm run build      # Test production build
pnpm run preview    # Verify production output
```

## Important Implementation Details

### Sidebar Generation Logic
The sidebar auto-generates based on issue file parsing:
- Issues grouped by year (hardcoded thresholds in `generate-sidebar.ts`)
- Extracts titles from markdown H1 headers
- Sorts newest first within each year
- Collapsed by default for older years

**Year thresholds** (lines 47-54 in `generate-sidebar.ts`):
- Issue 368+ → 2025
- Issue 332+ → 2024
- Issue 284+ → 2023
- Issue 237+ → 2022
- Issue 191+ → 2021
- Issue 89+ → 2020
- Issue 38+ → 2019

When adding new issues, update these thresholds if needed.

### RSS Generation
- Parses all `issue-*.md` files using gray-matter
- Extracts title from first H1 heading
- Description from first paragraph
- Date from file mtime or calculated from issue number
- Includes only latest 20 issues
- **Important**: Set `SITE_URL` environment variable before building

### Homepage Latest Issue Link
The homepage (`index.md`) and nav bar link to the latest issue. This is updated by:
1. `get-latest-issue.ts` scans `docs/` directory for highest issue number
2. `update-index.ts` updates links in `index.md`
3. VitePress config imports `getLatestIssueNumber()` at build time

## File Structure Patterns

### Adding New Content
- **New weekly issue**: Add `docs/issue-{number}.md` (synced from upstream)
- **Resource pages**: Add to `docs/` and update sidebar in `generate-sidebar.ts` lines 86-94
- **Custom styling**: Edit `.vitepress/theme/custom.css`

### Configuration Files
- `.vitepress/config.ts` - Site metadata, nav, theme config
- `.vitepress/theme/sidebar.ts` - Sidebar generation logic
- `.vitepress/theme/index.ts` - Theme customization entry point

## Deployment

### Current Setup
- **Platform**: GitHub Pages (configured in `.github/workflows/deploy.yml`)
- **Trigger**: Push to `master` branch
- **Build**: Runs on ubuntu-latest with Node 20, pnpm 9
- **Output**: `.vitepress/dist/` directory

### Alternative Deployments
- **Vercel**: Uses `vercel.json` config (if present)
- **Cloudflare Pages**: Compatible (build command: `pnpm run build`)

### Environment Variables
Set `SITE_URL` in GitHub repository secrets or workflow file:
```
SITE_URL=https://your-domain.com
```

## Common Tasks

### After Syncing New Issues from Upstream
```bash
# 1. Pull latest changes
git pull origin master

# 2. Update homepage with latest issue
pnpm run update-index

# 3. Test locally
pnpm run build && pnpm run preview

# 4. Commit and push
git add .
git commit -m "Update to latest issue"
git push origin master
```

### Updating Sidebar Logic
1. Edit `.vitepress/theme/sidebar.ts`
2. Run `pnpm run generate-sidebar` to test
3. Changes apply on next build

### Modifying RSS Feed Settings
Edit `scripts/generate-rss.ts`:
- Line 19: Default site URL
- Line 50: Number of articles to include
- Lines 24-44: Feed metadata

## Troubleshooting

### Build Fails
- Check Node version >= 18: `node --version`
- Clear cache: `rm -rf node_modules .vitepress/dist && pnpm install`
- Verify all markdown files have valid frontmatter

### RSS Feed Empty
- Ensure `docs/` directory exists and contains issue files
- Check file permissions on `.vitepress/dist/`
- Verify `SITE_URL` environment variable is set

### Sidebar Not Updating
- Sidebar generates at build time from `generate-sidebar.ts`
- Clear `.vitepress/dist/` cache
- Rebuild: `pnpm run build`

### Latest Issue Link Wrong
- Run `pnpm run update-index` manually
- Check `get-latest-issue.ts` returns correct number
- Verify file naming matches pattern `issue-{number}.md`

## Automation

### Weekly Sync Schedule
- **Time**: Fridays 10:00 UTC (18:00 Beijing)
- **Workflow**: `.github/workflows/sync-upstream.yml`
- **Action**: Fetches upstream, merges to master, pushes changes
- **Manual trigger**: Available in GitHub Actions UI

### Deployment Pipeline
1. Push to `master` branch
2. GitHub Actions detects change
3. Runs `pnpm install`
4. Runs `pnpm run generate-rss`
5. Runs `pnpm run build`
6. Uploads `.vitepress/dist/` as artifact
7. Deploys to GitHub Pages

## Dependencies

Key packages (see `package.json`):
- **vitepress** ^1.5.0 - Static site generator
- **vue** ^3.5.0 - Component framework
- **feed** ^4.2.2 - RSS/Atom feed generation
- **gray-matter** ^4.0.3 - Frontmatter parser
- **tsx** ^4.19.0 - TypeScript executor
- **fast-glob** ^3.3.2 - File pattern matching

## Notes

- Project uses pnpm (not npm/yarn) - see `.npmrc`
- TypeScript strict mode enabled
- Search disabled in config due to performance with 370+ articles
- Dead link checking disabled (original articles contain old links)
- Clean URLs enabled (issue-123 instead of issue-123.html)
