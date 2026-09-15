# Amber Einstein Tutoring — Microsite

A responsive, single-page microsite recreated from the original marketing artwork.
No server/backend required — it runs as static files and can be hosted anywhere
(GitHub Pages, Netlify, Azure Static Web Apps, or opened directly in a browser).

## Files
| File | Purpose |
|------|---------|
| `index.html` | Page structure & all copy/pricing (faithful to the artwork) |
| `styles.css` | Palette, typography, layout, responsive rules |
| `script.js` | Form validation, package pre-fill, no-backend email forwarding |
| `config.json` | Editable business/lead/pricing settings (documentation + reference) |
| `assets/` | Hydrangea artwork used in the hero |

## Lead capture (no backend)
The inquiry form forwards submissions to **AmberEinsteinTutoring@gmail.com** using
[FormSubmit](https://formsubmit.co) via an AJAX POST — no server code needed.

### One-time activation (required)
1. Deploy the site (or open it locally).
2. Submit the form **once**. FormSubmit emails a confirmation link to
   `AmberEinsteinTutoring@gmail.com`.
3. Click that link to activate. All future submissions arrive in the inbox automatically.

If the network call ever fails, the form automatically falls back to opening the
visitor's email app with a pre-filled draft (`mailto:`), so no lead is lost.

### Switching providers
To use a different email or provider (e.g., Formspree, Getform), edit the
`endpoint`/`email` values near the top of `script.js` (and `config.json`).

## Customizing content
- Prices, package names, and rates live in `index.html` (and mirrored in `config.json`).
- Colors are CSS variables at the top of `styles.css` (`:root { … }`).

## Hosting quick options
- **Drag & drop:** upload the folder to Netlify Drop.
- **GitHub Pages:** push the folder, enable Pages on the branch root.
- **Local test:** just open `index.html` in a browser.
