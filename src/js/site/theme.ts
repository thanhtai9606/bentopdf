export type ThemePreference = 'system' | 'light' | 'soft' | 'dark';
export type ResolvedTheme = 'light' | 'soft' | 'dark';

const STORAGE_KEY = 'bentopdf-theme';

const media = window.matchMedia('(prefers-color-scheme: dark)');

export function getThemePreference(): ThemePreference {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored === 'light' || stored === 'soft' || stored === 'dark' || stored === 'system') {
        return stored;
    }
    return 'system';
}

export function resolveTheme(preference: ThemePreference): ResolvedTheme {
    if (preference === 'system') {
        return media.matches ? 'dark' : 'light';
    }
    return preference;
}

export function applyTheme(preference: ThemePreference) {
    const resolved = resolveTheme(preference);
    const root = document.documentElement;
    root.classList.remove('light', 'soft', 'dark');
    root.classList.add(resolved);
    root.dataset.themePreference = preference;
    localStorage.setItem(STORAGE_KEY, preference);
}

export function initThemeListener(onChange?: () => void) {
    const handler = () => {
        if (getThemePreference() === 'system') {
            applyTheme('system');
            onChange?.();
        }
    };
    media.addEventListener('change', handler);
    return () => media.removeEventListener('change', handler);
}
