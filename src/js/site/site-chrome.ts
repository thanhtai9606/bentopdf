import { applyTheme, getThemePreference, initThemeListener, type ThemePreference } from './theme.js';
import { getLocale, initLocale, setLocale, t, type Locale } from './i18n/index.js';

type RefreshHandler = () => void;

let onLocaleChange: RefreshHandler | null = null;

export function setLocaleChangeHandler(handler: RefreshHandler) {
    onLocaleChange = handler;
}

function getNested(obj: Record<string, unknown>, path: string): string | undefined {
    const value = path.split('.').reduce<unknown>((acc, key) => {
        if (acc && typeof acc === 'object') {
            return (acc as Record<string, unknown>)[key];
        }
        return undefined;
    }, obj);
    return typeof value === 'string' ? value : undefined;
}

export function applyI18n(root: ParentNode = document) {
    const messages = t() as unknown as Record<string, unknown>;

    root.querySelectorAll<HTMLElement>('[data-i18n]').forEach((el) => {
        const key = el.dataset.i18n;
        if (!key) return;
        const value = getNested(messages, key);
        if (value) el.textContent = value;
    });

    root.querySelectorAll<HTMLInputElement | HTMLTextAreaElement>('[data-i18n-placeholder]').forEach((el) => {
        const key = el.dataset.i18nPlaceholder;
        if (!key) return;
        const value = getNested(messages, key);
        if (value) el.placeholder = value;
    });

    root.querySelectorAll<HTMLElement>('[data-i18n-title]').forEach((el) => {
        const key = el.dataset.i18nTitle;
        if (!key) return;
        const value = getNested(messages, key);
        if (value) el.title = value;
    });

    root.querySelectorAll<HTMLElement>('[data-i18n-aria]').forEach((el) => {
        const key = el.dataset.i18nAria;
        if (!key) return;
        const value = getNested(messages, key);
        if (value) el.setAttribute('aria-label', value);
    });
}

function iconMonitor(): string {
    return '<svg class="w-[1.15rem] h-[1.15rem]" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" d="M9 17.25H4.5a2.25 2.25 0 0 1-2.25-2.25V6A2.25 2.25 0 0 1 4.5 3.75h15A2.25 2.25 0 0 1 21.75 6v9a2.25 2.25 0 0 1-2.25 2.25H15m-6 0v1.5a2.25 2.25 0 0 0 2.25 2.25h1.5A2.25 2.25 0 0 0 15 19.5V17.25m-6 0h6"/></svg>';
}

function iconSun(opacity = ''): string {
    return `<svg class="w-[1.15rem] h-[1.15rem] ${opacity}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" d="M12 3v2.25m6.364.386-1.591 1.591M21 12h-2.25m-.386 6.364-1.591-1.591M12 18.75V21m-4.773-4.227-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z"/></svg>`;
}

function iconMoon(): string {
    return '<svg class="w-[1.15rem] h-[1.15rem]" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" d="M21.752 15.002A9.72 9.72 0 0 1 18 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 0 0 3 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 0 0 9.002-5.998Z"/></svg>';
}

function themeGlyph(preference: ThemePreference): string {
    if (preference === 'system') return iconMonitor();
    if (preference === 'soft') return iconSun('opacity-55');
    if (preference === 'dark') return iconMoon();
    return iconSun();
}

function mountLocaleSwitcher(container: HTMLElement) {
    const messages = t();
    container.innerHTML = `
        <div class="locale-switcher" role="group" aria-label="${messages.language.label}">
            <button type="button" class="locale-btn" data-locale="vi">VI</button>
            <span class="locale-divider" aria-hidden="true">|</span>
            <button type="button" class="locale-btn" data-locale="en">EN</button>
        </div>
    `;

    const updateActive = () => {
        const locale = getLocale();
        container.querySelectorAll<HTMLButtonElement>('.locale-btn').forEach((btn) => {
            btn.classList.toggle('is-active', btn.dataset.locale === locale);
        });
    };

    container.addEventListener('click', (e) => {
        const btn = (e.target as HTMLElement).closest<HTMLButtonElement>('.locale-btn');
        if (!btn?.dataset.locale) return;
        const locale = btn.dataset.locale as Locale;
        if (locale === getLocale()) return;
        setLocale(locale);
        applyI18n();
        updateActive();
        refreshThemeSwitcher(container.parentElement?.querySelector('#theme-switcher') as HTMLElement | null);
        onLocaleChange?.();
    });

    updateActive();
}

function refreshThemeSwitcher(container: HTMLElement | null) {
    if (!container) return;
    const preference = getThemePreference();
    const trigger = container.querySelector<HTMLButtonElement>('.site-theme-trigger');
    if (trigger) {
        trigger.innerHTML = `${themeGlyph(preference)}<span class="sr-only">${t().theme.choose}</span>`;
        trigger.title = t().theme.label;
    }
    container.querySelectorAll<HTMLButtonElement>('.site-theme-option').forEach((btn) => {
        const value = btn.dataset.theme as ThemePreference;
        btn.setAttribute('aria-selected', String(value === preference));
        const label = t().theme[value];
        const labelEl = btn.querySelector('.site-theme-option-label');
        if (labelEl) labelEl.textContent = label;
    });
    const popover = container.querySelector('.site-theme-popover');
    if (popover) popover.setAttribute('aria-label', t().theme.label);
}

function mountThemeSwitcher(container: HTMLElement) {
    const messages = t();
    const preference = getThemePreference();

    container.innerHTML = `
        <div class="site-theme-root relative shrink-0">
            <button type="button" class="site-theme-trigger flex h-9 w-9 items-center justify-center rounded-lg border transition focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2" aria-haspopup="listbox" aria-expanded="false" title="${messages.theme.label}">
                ${themeGlyph(preference)}
                <span class="sr-only">${messages.theme.choose}</span>
            </button>
            <ul class="site-theme-popover hidden absolute right-0 top-[calc(100%+6px)] z-[100] min-w-[11.5rem] rounded-lg border py-1 shadow-lg" role="listbox" aria-label="${messages.theme.label}">
                ${(['system', 'light', 'soft', 'dark'] as ThemePreference[]).map((value) => `
                    <li role="presentation">
                        <button type="button" role="option" class="site-theme-option flex w-full items-center gap-2 px-3 py-2 text-left text-sm transition" data-theme="${value}" aria-selected="${preference === value}">
                            <span class="w-5 shrink-0 text-center opacity-80">${value === 'system' ? iconMonitor() : value === 'light' ? iconSun() : value === 'soft' ? iconSun('opacity-55') : iconMoon()}</span>
                            <span class="site-theme-option-label">${messages.theme[value]}</span>
                        </button>
                    </li>
                `).join('')}
            </ul>
        </div>
    `;

    const root = container.querySelector('.site-theme-root')!;
    const trigger = container.querySelector<HTMLButtonElement>('.site-theme-trigger')!;
    const popover = container.querySelector<HTMLUListElement>('.site-theme-popover')!;

    const close = () => {
        popover.classList.add('hidden');
        trigger.setAttribute('aria-expanded', 'false');
    };

    const open = () => {
        popover.classList.remove('hidden');
        trigger.setAttribute('aria-expanded', 'true');
    };

    trigger.addEventListener('click', () => {
        if (popover.classList.contains('hidden')) open();
        else close();
    });

    popover.addEventListener('click', (e) => {
        const btn = (e.target as HTMLElement).closest<HTMLButtonElement>('.site-theme-option');
        if (!btn?.dataset.theme) return;
        applyTheme(btn.dataset.theme as ThemePreference);
        refreshThemeSwitcher(container);
        close();
    });

    document.addEventListener('mousedown', (e) => {
        if (!root.contains(e.target as Node)) close();
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') close();
    });
}

export function initSiteChrome() {
    initLocale();
    applyTheme(getThemePreference());
    initThemeListener(() => refreshThemeSwitcher(document.getElementById('theme-switcher')));

    const localeRoot = document.getElementById('locale-switcher');
    const themeRoot = document.getElementById('theme-switcher');
    if (localeRoot) mountLocaleSwitcher(localeRoot);
    if (themeRoot) mountThemeSwitcher(themeRoot);

    applyI18n();
}
