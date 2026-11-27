// Runs after `ng build`:
//  1. Generates sitemap.xml from the prerendered routes.
//  2. Writes 404.html (client-side app shell) so static hosts like GitHub Pages
//     serve the Angular app for unknown URLs, which handles old-site redirects
//     and the "page not found" view.
import { readFileSync, writeFileSync, copyFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';

const SITE_URL = process.env.SITE_URL ?? 'https://krmtax.com';
const dist = 'dist/krmtax-website';
const browser = join(dist, 'browser');

const { routes } = JSON.parse(readFileSync(join(dist, 'prerendered-routes.json'), 'utf8'));
const exclude = new Set(['/themes', '/legal']);
const today = new Date().toISOString().slice(0, 10);
const urls = Object.keys(routes)
  .filter((r) => !exclude.has(r))
  .map((r) => `  <url><loc>${SITE_URL}${r === '/' ? '/' : r}</loc><lastmod>${today}</lastmod></url>`)
  .join('\n');
writeFileSync(
  join(browser, 'sitemap.xml'),
  `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`,
);

const shell = existsSync(join(browser, 'index.csr.html')) ? 'index.csr.html' : 'index.html';
copyFileSync(join(browser, shell), join(browser, '404.html'));
writeFileSync(join(browser, '.nojekyll'), '');
console.log(`postbuild: sitemap.xml (${Object.keys(routes).length - exclude.size} urls), 404.html written`);
