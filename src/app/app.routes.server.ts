import { RenderMode, ServerRoute } from '@angular/ssr';
import { SERVICES } from './core/data/services.data';
import { CALCULATORS } from './core/data/calculators.data';

/** All pages are prerendered to static HTML at build time for speed and SEO. */
export const serverRoutes: ServerRoute[] = [
  {
    path: 'services/:slug',
    renderMode: RenderMode.Prerender,
    getPrerenderParams: async () => SERVICES.map((s) => ({ slug: s.slug })),
  },
  {
    path: 'calculators/:slug',
    renderMode: RenderMode.Prerender,
    getPrerenderParams: async () => CALCULATORS.map((c) => ({ slug: c.slug })),
  },
  { path: '**', renderMode: RenderMode.Prerender },
];
