# Deploying the site

Every push to `main` runs lint, tests and a production build in GitHub Actions
(`.github/workflows/ci.yml`) and publishes the static site to **GitHub Pages**.

## 1. Turn on GitHub Pages (one time)

1. Repository **Settings → Pages**.
2. Under **Build and deployment → Source**, choose **GitHub Actions**.
3. Re-run the latest "CI and deploy" workflow (Actions tab → workflow → Re-run), or push any commit.

The preview URL will be `https://adeptechsolutions.github.io/krmtax-website/`.
Because this is a project site under a sub-path, set the base href for the preview build:
the workflow already reads `BASE_HREF` (see below).

> GitHub Pages on a free account requires the repository to be **public**. If you want to keep it private,
> use a paid GitHub plan, or deploy the same `dist/krmtax-website/browser` folder to Netlify, Vercel,
> Cloudflare Pages or Firebase Hosting (all have free tiers and work with this build as-is).

## 2. Point krmtax.com at the new site (when ready to go live)

1. **Settings → Pages → Custom domain**: enter `krmtax.com` and save. Tick **Enforce HTTPS** once available.
2. At the domain registrar / DNS host for krmtax.com, replace the current website records with:

   | Type | Host | Value |
   | --- | --- | --- |
   | A | @ | 185.199.108.153 |
   | A | @ | 185.199.109.153 |
   | A | @ | 185.199.110.153 |
   | A | @ | 185.199.111.153 |
   | CNAME | www | adeptechsolutions.github.io |

3. **Do not change MX records**, so email (pparmar@krmtax.com) keeps working.
4. Repository variable `BASE_HREF` (Settings → Secrets and variables → Actions → Variables) should then be `/`
   (or deleted). DNS changes can take up to 24–48 hours.

## 3. Connect the integrations

All in `src/app/core/data/site.config.ts`:

- **Online booking → office calendar.** Easiest free option: in Google Calendar, create an
  *Appointment schedule* (Create → Appointment schedule), set office hours and buffer times, then
  *Share → Booking page link*, and paste it into `bookingUrl`. Bookings appear on the calendar
  automatically with the client's details and an email confirmation to both sides.
  Calendly, Cal.com and Microsoft Bookings (for Outlook) links work the same way.
- **Contact form.** Create a free form at formspree.io with the office email and paste its URL into
  `contactFormEndpoint`.
