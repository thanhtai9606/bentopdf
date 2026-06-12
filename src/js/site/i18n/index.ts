import type { Locale, Messages } from './types.js';
import { en } from './en.js';
import { vi } from './vi.js';

const LOCALE_KEY = 'bentopdf-locale';

const dictionaries: Record<Locale, Messages> = { en, vi };

let currentLocale: Locale = 'vi';

export function getLocale(): Locale {
    return currentLocale;
}

export function setLocale(locale: Locale) {
    currentLocale = locale;
    localStorage.setItem(LOCALE_KEY, locale);
    document.documentElement.lang = locale;
}

export function initLocale() {
    const stored = localStorage.getItem(LOCALE_KEY);
    if (stored === 'en' || stored === 'vi') {
        currentLocale = stored;
    }
    document.documentElement.lang = currentLocale;
}

export function t(): Messages {
    return dictionaries[currentLocale];
}

export function toolName(id: string): string {
    return t().tools[id]?.name ?? id;
}

export function toolSubtitle(id: string): string {
    return t().tools[id]?.subtitle ?? '';
}

export function categoryName(key: string): string {
    return t().categories[key] ?? key;
}

export type { Locale, Messages } from './types.js';
