# DeHaas Building and Remodeling Co. — website redesign

A modern, animated, mobile-optimized redesign of dehaasremodeling.com, built as a
static HTML/CSS/JS site (no build step, no framework, no dependencies).

## What's real here

- **Business name, tagline, license (#PA214704), service area (York & Adams
  Counties, PA), founder story, values (Quality/Honesty/Integrity), pricing
  policy (10% material markup refunded if unused), and every service
  description** are pulled directly from the live site's content.
- **Every photo is an original DeHaas job-site photo** pulled from the live
  site's own media (`assets/img/`) — the crew, the logo, and real project
  photos (siding, roofing, decks, interior finish work). Nothing here is
  stock photography or AI-generated imagery.
- **FAQ answers** on the estimate page are all sourced from confirmed facts
  above — nothing there is invented.

## What isn't wired up yet (do this before launch)

The live site never publishes a business phone number or email — it only
funnels visitors through a "Request Estimate" form. This redesign follows
the same pattern, but the form currently has **no backend**:

1. Open `assets/js/main.js` and find `ESTIMATE_RECIPIENT` near the bottom.
   Set it to the business's real inbox address, **or** replace the submit
   handler with a hosted form service (Formspree, Netlify Forms, Basin,
   etc.) so submissions land somewhere reliable instead of depending on the
   visitor's own email client.
2. If/when a real business phone number exists, add it to the footer and
   `estimate.html`'s info panel.
3. Swap the placeholder `<title>`/meta description domain references if the
   site will live somewhere other than the current domain.

## Structure

```
index.html        Home
about.html         Founder story, values
services.html      Interior + exterior services
portfolio.html     Photo gallery with lightbox
estimate.html      Request-estimate form + FAQ
assets/css/style.css   Design system (tokens, components, responsive rules)
assets/js/main.js      Nav, scroll-reveal, counters, lightbox, FAQ, form
assets/img/            Real DeHaas photos + logo
```

No build tooling is required — open `index.html` directly, or serve the
folder with any static file server:

```bash
npx serve .
# or
python3 -m http.server 8080
```

## Design notes

- Palette pulled from the existing DeHaas logo: navy/charcoal + a red
  accent, on a warm off-white background — same principal colors as the
  original site, restyled with more contrast and hierarchy.
- Headings use **Fraunces** (serif, Google Fonts) for a built/crafted feel;
  body text uses **Inter** for readability at small sizes.
- Motion: scroll-reveal via `IntersectionObserver`, animated stat counters,
  a sticky header that compacts on scroll, hover/tap micro-interactions on
  cards and buttons, and a lightbox gallery on the portfolio page. Everything
  respects `prefers-reduced-motion`.
- Fully responsive from ~360px phones up through desktop, with a dedicated
  full-screen mobile nav.

## Deploying

Any static host works (GitHub Pages, Netlify, Vercel, Cloudflare Pages).
For GitHub Pages: Settings → Pages → Deploy from branch → `main` / `/root`.
