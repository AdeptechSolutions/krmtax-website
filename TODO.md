# KRM Tax website – to-do list

Keep this list up to date. Tick items off (`[x]`) as they're done.

## Before launch

- [ ] **Choose the final theme** (recommended: Heritage Navy). Then set `DEFAULT_THEME` in
      `src/app/core/services/theme.service.ts`, `data-theme` in `src/index.html`, and remove
      `<app-theme-switcher />` from `src/app/app.ts`.
- [ ] **Check the 2026 tax figures** in `src/app/core/data/tax-year.ts` against the IRS
      (Rev. Proc. 2025-32) and the 2027 filing deadlines. They were entered from memory, not copied from the IRS.
- [ ] **Online booking:** create a Google Calendar *Appointment schedule* (or Microsoft Bookings /
      Calendly) and paste its booking link into `bookingUrl` in `src/app/core/data/site.config.ts`.
- [ ] **Confirm office hours** for appointment time slots (currently Mon–Fri, 9:00 AM–5:00 PM in
      `src/app/shared/contact-form/contact-form.ts`, `OPEN_HOUR` / `CLOSE_HOUR`).
- [ ] **Contact form:** sign up at formspree.io with the office email and paste the form URL into
      `contactFormEndpoint` in `site.config.ts`. Until then the form opens the visitor's email app.
- [ ] **Team and hours:** add team member names, photos, credentials and office hours to the About
      and Contact pages (not on the old site).
- [ ] **Client portal and newsletter links:** confirm `clientPortalUrl` and `newsletterSubscribeUrl` still work.
- [ ] **Go live:** point krmtax.com DNS at GitHub Pages (steps in `docs/DEPLOYMENT.md`). Keep the MX
      records unchanged so email keeps working. Then set the repo variable `BASE_HREF` to `/`.
- [ ] After launch: submit `https://krmtax.com/sitemap.xml` in Google Search Console and claim/update
      the Google Business Profile with the new site.

## Every year (around November 15)

A GitHub issue opens automatically on November 15 as a reminder (`.github/workflows/yearly-reminder.yml`).

- [ ] Update `src/app/core/data/tax-year.ts`: `TAX_YEAR`, `BRACKETS`, `STANDARD_DEDUCTION`,
      `FILING_DEADLINES`, `LAST_REVIEWED`.
- [ ] Review FAQ answers and newsletter topics for anything year-specific.
- [ ] Check every link on the Forms and Helpful Links pages still works.
- [ ] Renew the krmtax.com domain if it's due (check the registrar's renewal date).

## Reminder emails – to set up

> **Note:** set up email reminders for recurring tasks like these so nothing depends on someone
> remembering.

- [ ] **GitHub email for the yearly issue:** make sure the AdeptechSolutions account is *Watching* this
      repository and email notifications are on (github.com/settings/notifications). The November 15
      issue then arrives as an email. Test it with Actions → "Yearly reminders" → *Run workflow*.
- [ ] **Office reminder emails:** decide who at KRM should receive reminders (for example
      pparmar@krmtax.com) and add recurring Google Calendar / Outlook events with email alerts for:
      - Nov 15 – update website tax figures
      - Domain renewal date
      - Early January – refresh the home page and newsletter for tax season
- [ ] Optional: add those people as collaborators on this repo so they get the GitHub emails directly.

## Nice to have later

- [ ] Real photos of the office and team (replace icon-only sections).
- [ ] Client testimonials/reviews section (with permission).
- [ ] Spanish or other language version, if clients would benefit.
- [ ] Privacy-friendly analytics (for example Plausible or Cloudflare Web Analytics) to see which pages clients use.
