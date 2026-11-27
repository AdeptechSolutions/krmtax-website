# KRM Financial Services website

The new public website for **KRM Financial Services, Ltd.** (krmtax.com), built with Angular 22.

## Tech overview

- **Angular 22** with standalone components, signals and `OnPush` change detection
- **Prerendered (static) HTML** for every page via Angular SSR, so pages load fast and are fully indexable by search engines
- **Lazy-loaded routes**: each page ships only the code it needs
- **Theme system** built on CSS custom properties: 4 themes, switchable at runtime
- **Config-driven content**: firm details, services, calculators, forms and links live in `src/app/core/data/`
- ESLint (angular-eslint), Prettier, Vitest unit tests, GitHub Actions CI + deploy to GitHub Pages

## Project structure

```
src/
  app/
    core/
      data/        # site.config.ts (firm info + integrations), services, calculators, forms/links
      services/    # SEO (title, meta, canonical, JSON-LD), theme service
    layout/        # header, footer, theme switcher
    shared/        # reusable UI: icon, page hero, CTA band, contact form, link groups
    features/      # one folder per page, each lazy-loaded
  styles/          # _themes (design tokens), _base, _layout, _components
scripts/postbuild.mjs   # sitemap.xml + 404.html for static hosting
```

## Pages

Home · Services (+7 detail pages) · About · Book an appointment · Financial calculators (17, all built in) ·
Tax organizer (interactive, printable checklist) · Tax deadlines (with add-to-calendar) · Newsletter · Forms ·
Helpful links · Make a payment · FAQ · Contact (form + map) · Terms & disclaimer · Theme preview

Old krmtax.com URLs (`/about-us`, `/contact-us`, `/our-services`, `/payroll`, ...) redirect to their new pages.

## Commands

```bash
npm install
npm start            # dev server at http://localhost:4200
npm run build        # production build + sitemap -> dist/krmtax-website/browser
npm run lint
npm run test:ci
```

## Configuration (src/app/core/data/site.config.ts)

| Setting | What it does |
| --- | --- |
| `bookingUrl` | Online booking page (Google Calendar appointment schedule, Calendly, Cal.com or Microsoft Bookings). Appointments go straight to the office calendar. Empty = appointment request form. |
| `contactFormEndpoint` | Form backend URL (e.g. Formspree). Empty = form opens the visitor's email app. |
| `paymentUrl` | Hosted payment link (PayPal, Stripe Payment Link, CPACharge...). Empty = "call to pay" text. |
| `clientPortalUrl` | Secure document portal link. |
| `newsletterSubscribeUrl` | Newsletter signup link. |

To pick the final theme, set `DEFAULT_THEME` in `src/app/core/services/theme.service.ts` and the `data-theme`
attribute in `src/index.html`, then remove `<app-theme-switcher />` from `src/app/app.ts`.

## Deployment

See [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md).
