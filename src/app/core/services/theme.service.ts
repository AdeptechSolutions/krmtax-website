import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import { Injectable, PLATFORM_ID, inject, signal } from '@angular/core';

export interface ThemeOption {
  id: ThemeId;
  name: string;
  description: string;
  swatches: string[];
}

export type ThemeId = 'heritage' | 'horizon' | 'evergreen' | 'midnight';

export const THEMES: ThemeOption[] = [
  {
    id: 'heritage',
    name: 'Heritage Navy',
    description:
      'Classic and trustworthy. Deep navy with warm gold accents and elegant serif headings.',
    swatches: ['#0f2a4a', '#c9a227', '#f7f4ec'],
  },
  {
    id: 'horizon',
    name: 'Modern Horizon',
    description: 'Clean and contemporary. Bright blue and teal on crisp white with rounded shapes.',
    swatches: ['#2563eb', '#14b8a6', '#f8fafc'],
  },
  {
    id: 'evergreen',
    name: 'Evergreen',
    description:
      'Calm and established. Forest green with cream tones, suggesting growth and stability.',
    swatches: ['#1f4d3a', '#d97706', '#faf7f0'],
  },
  {
    id: 'midnight',
    name: 'Midnight Pro',
    description:
      'Bold and premium. Dark slate background with amber highlights for a high-end feel.',
    swatches: ['#0b1220', '#f59e0b', '#e2e8f0'],
  },
];

const STORAGE_KEY = 'krm-theme';
/** The theme shown to visitors who have not picked one. Change after the client chooses. */
export const DEFAULT_THEME: ThemeId = 'heritage';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  private readonly document = inject(DOCUMENT);
  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));
  readonly current = signal<ThemeId>(DEFAULT_THEME);

  init(): void {
    if (!this.isBrowser) return;
    const fromUrl = new URLSearchParams(this.document.location.search).get('theme');
    const saved = localStorage.getItem(STORAGE_KEY);
    const pick = [fromUrl, saved].find((t): t is ThemeId => THEMES.some((x) => x.id === t));
    if (pick) this.set(pick);
  }

  set(id: ThemeId): void {
    this.current.set(id);
    this.document.documentElement.setAttribute('data-theme', id);
    if (this.isBrowser) localStorage.setItem(STORAGE_KEY, id);
  }
}
