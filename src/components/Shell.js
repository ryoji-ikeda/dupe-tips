import { iconMenu, iconMoon, iconSearch, iconSun } from "../lib/icons.js";
import { getEffectiveTheme } from "../lib/theme.js";

export function renderShell(docs) {
  return `
    <div class="site-shell">
      <header class="topbar" data-topbar>
        <a href="#/" class="brand" data-link>
          <span class="brand-mark" aria-hidden="true"><img src="/favicon.svg" alt="" /></span>
          <span>
            <span class="brand-title">DupeTips</span>
            <span class="brand-subtitle">Research Docs</span>
          </span>
        </a>

        <nav class="top-links" aria-label="Primary navigation">
          <a href="#/" data-link>Home</a>
          <a href="${docs.firstIntroductionPage?.href || "#/docs"}" data-link>Docs</a>
          <a href="#/safety" data-link>Scope</a>
        </nav>

        <div class="nav-actions">
          <div class="search-shell" data-search-shell>
            <span class="search-icon">${iconSearch()}</span>
            <input
              id="site-search"
              type="search"
              autocomplete="off"
              spellcheck="false"
              placeholder="Search titles..."
              aria-label="Search markdown titles"
              aria-controls="search-results"
              aria-expanded="false"
            />
            <kbd>/</kbd>
            <div id="search-results" class="search-results" role="listbox" hidden></div>
          </div>

          <button id="theme-toggle" class="icon-button theme-toggle" type="button">
            <span data-theme-icon>${getEffectiveTheme() === "dark" ? iconSun() : iconMoon()}</span>
            <span data-theme-label>${getEffectiveTheme() === "dark" ? "Light" : "Dark"}</span>
          </button>

          <button id="mobile-menu-toggle" class="icon-button menu-toggle" type="button" aria-controls="mobile-panel" aria-expanded="false">
            <span data-menu-icon>${iconMenu()}</span>
            <span class="sr-only">Open navigation</span>
          </button>
        </div>
      </header>

      <div id="mobile-panel" class="mobile-panel" hidden>
        <a href="#/" data-link>Home</a>
        <a href="${docs.firstIntroductionPage?.href || "#/docs"}" data-link>Docs</a>
        <a href="#/safety" data-link>Scope</a>
      </div>

      <main id="route-outlet" class="route-outlet" tabindex="-1"></main>
    </div>
  `;
}
