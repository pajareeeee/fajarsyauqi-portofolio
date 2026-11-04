# Fajar Syauqi — Data Analytics Portfolio

Static portfolio site (HTML, CSS, vanilla JS). No build step, no dependencies.

## Run locally

Open `index.html` in a browser. To preview with a local server:

```bash
python -m http.server 8000
```

## Structure

```
index.html            page content (hero, about, skills, projects, certificates, contact)
css/style.css         all styles, light/dark theme variables at the top
js/main.js            theme toggle, mobile menu, scroll effects, project detail dialog (DATA object)
assets/
  profile.jpg         hero photo (portrait 4:5, face near the top)
  placeholder.svg     shown automatically when an image fails to load
  projects/           project screenshots (.webp)
  certificates/       certificate images (.webp)
```

## Editing

- **Project text in the cards:** `index.html`, section `#projects`.
- **Project details (View Details dialog):** `DATA` object in `js/main.js`
  (keys: `python`, `sql`, `sakumaya`, `sedukopi`).
- **Contact links:** `index.html`, section `#contact`.
- **New certificate:** add an image to `assets/certificates/` and copy one `<article class="cert reveal">` block.
- **Colors:** CSS variables in `:root` (dark) and `:root[data-theme="light"]` in `css/style.css`.

## Deploy (GitHub Pages)

Push this folder to a repo, then Settings → Pages → Deploy from branch → `main` / root.
