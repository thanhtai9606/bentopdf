import { initSiteChrome } from './site-chrome.js';
import { createIcons, icons } from 'lucide';

document.addEventListener('DOMContentLoaded', () => {
    initSiteChrome();
    createIcons({ icons });
});
