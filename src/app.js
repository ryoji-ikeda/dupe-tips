import { renderDocsView } from "./components/DocsPage.js";
import { renderHomeView } from "./components/HomePage.js";
import { renderNotFoundView } from "./components/NotFoundPage.js";
import { renderSafetyView } from "./components/SafetyPage.js";
import { renderShell } from "./components/Shell.js";
import { docs, pageBySlug } from "./lib/docs.js";
import { iconClose, iconMenu } from "./lib/icons.js";
import { disconnectTocObserver, renderMarkdown } from "./lib/markdown.js";
import { escapeHtml, normalizeSearch, slugify } from "./lib/utils.js";
import { applyTheme, getEffectiveTheme, watchSystemTheme } from "./lib/theme.js";

const state = {
  currentRoute: "home",
  currentPage: docs.firstIntroductionPage,
  searchIndex: -1,
  mobileNavOpen: false,
};

const HOPR_AUDIO_SRC = "/songs/hopr.mp3";
let hoprAudio;
let hoprUnlockHandler;

function getHoprAudio() {
  if (!hoprAudio) {
    hoprAudio = new Audio(HOPR_AUDIO_SRC);
    hoprAudio.loop = true;
    hoprAudio.preload = "auto";
  }
  return hoprAudio;
}

function removeHoprUnlockHandler() {
  if (!hoprUnlockHandler) return;
  document.removeEventListener("pointerdown", hoprUnlockHandler);
  document.removeEventListener("keydown", hoprUnlockHandler);
  hoprUnlockHandler = undefined;
}

function playHoprAudio() {
  const audio = getHoprAudio();
  removeHoprUnlockHandler();

  audio.currentTime = 0;
  const playPromise = audio.play();

  if (playPromise?.catch) {
    playPromise.catch(() => {
      // Some browsers block autoplay until the first user gesture.
      // If that happens, start the song on the first interaction while still on this page.
      hoprUnlockHandler = () => {
        if (state.currentPage?.slug !== "hopr") return removeHoprUnlockHandler();
        audio.play().catch(() => {});
        removeHoprUnlockHandler();
      };
      document.addEventListener("pointerdown", hoprUnlockHandler, { once: true });
      document.addEventListener("keydown", hoprUnlockHandler, { once: true });
    });
  }
}

function stopHoprAudio() {
  removeHoprUnlockHandler();
  if (!hoprAudio) return;
  hoprAudio.pause();
  hoprAudio.currentTime = 0;
}

export function startApp(selector = "#app") {
  const app = document.querySelector(selector);
  if (!app) return;

  app.innerHTML = renderShell(docs);
  applyTheme(getEffectiveTheme(), false);
  bindGlobalEvents();
  bindAllInternalLinks();
  watchSystemTheme();

  window.addEventListener("hashchange", renderRoute);
  renderRoute();
}

function bindGlobalEvents() {
  document.querySelector("#theme-toggle")?.addEventListener("click", () => {
    applyTheme(getEffectiveTheme() === "dark" ? "light" : "dark");
  });

  document.querySelector("#mobile-menu-toggle")?.addEventListener("click", () => {
    setMobilePanel(!state.mobileNavOpen);
  });

  document.querySelector("#mobile-panel")?.addEventListener("click", (event) => {
    if (event.target.closest("a")) setMobilePanel(false);
  });

  const searchInput = document.querySelector("#site-search");
  searchInput?.addEventListener("input", () => updateSearch(searchInput.value));
  searchInput?.addEventListener("focus", () => updateSearch(searchInput.value));
  searchInput?.addEventListener("keydown", handleSearchKeydown);

  document.addEventListener("keydown", (event) => {
    const target = event.target;
    const isTyping = target instanceof HTMLInputElement || target instanceof HTMLTextAreaElement;
    if (event.key === "/" && !isTyping) {
      event.preventDefault();
      searchInput?.focus();
    }
    if (event.key === "Escape") {
      hideSearchResults();
      setMobilePanel(false);
    }
  });

  document.addEventListener("click", (event) => {
    if (!event.target.closest("[data-search-shell]")) hideSearchResults();
  });
}

function setMobilePanel(open) {
  state.mobileNavOpen = open;
  const panel = document.querySelector("#mobile-panel");
  const toggle = document.querySelector("#mobile-menu-toggle");
  if (!panel || !toggle) return;

  panel.hidden = !open;
  toggle.setAttribute("aria-expanded", String(open));
  toggle.querySelector("[data-menu-icon]").innerHTML = open ? iconClose() : iconMenu();
}

function updateSearch(query) {
  const input = document.querySelector("#site-search");
  const resultsEl = document.querySelector("#search-results");
  if (!input || !resultsEl) return;

  const normalized = normalizeSearch(query);
  state.searchIndex = -1;

  if (!normalized) {
    hideSearchResults();
    return;
  }

  const results = docs.pages
    .map((page) => ({
      page,
      titleScore: normalizeSearch(page.title).includes(normalized) ? 2 : 0,
      fileScore: normalizeSearch(page.fileTitle).includes(normalized) ? 1 : 0,
    }))
    .filter((result) => result.titleScore || result.fileScore)
    .sort((a, b) => b.titleScore + b.fileScore - (a.titleScore + a.fileScore) || a.page.title.localeCompare(b.page.title))
    .slice(0, 8);

  if (!results.length) {
    resultsEl.innerHTML = `<div class="search-empty">No title matches found.</div>`;
    resultsEl.hidden = false;
    input.setAttribute("aria-expanded", "true");
    return;
  }

  resultsEl.innerHTML = results
    .map(
      ({ page }, index) => `
      <button class="search-result" type="button" role="option" data-search-result="${index}" data-slug="${page.slug}">
        <span>${escapeHtml(page.title)}</span>
        <small>${escapeHtml(page.category)}</small>
      </button>
    `
    )
    .join("");

  resultsEl.querySelectorAll("[data-search-result]").forEach((button) => {
    button.addEventListener("click", () => {
      const page = pageBySlug.get(button.dataset.slug);
      if (page) navigate(page.href);
      hideSearchResults(true);
    });
  });

  resultsEl.hidden = false;
  input.setAttribute("aria-expanded", "true");
}

function handleSearchKeydown(event) {
  const resultsEl = document.querySelector("#search-results");
  const results = [...(resultsEl?.querySelectorAll("[data-search-result]") || [])];
  if (!results.length || resultsEl.hidden) return;

  if (event.key === "ArrowDown") {
    event.preventDefault();
    state.searchIndex = (state.searchIndex + 1) % results.length;
    setActiveSearchResult(results);
  }

  if (event.key === "ArrowUp") {
    event.preventDefault();
    state.searchIndex = (state.searchIndex - 1 + results.length) % results.length;
    setActiveSearchResult(results);
  }

  if (event.key === "Enter" && state.searchIndex >= 0) {
    event.preventDefault();
    results[state.searchIndex].click();
  }
}

function setActiveSearchResult(results) {
  results.forEach((button, index) => {
    const active = index === state.searchIndex;
    button.classList.toggle("is-active", active);
    button.setAttribute("aria-selected", String(active));
    if (active) button.scrollIntoView({ block: "nearest" });
  });
}

function hideSearchResults(clearInput = false) {
  const input = document.querySelector("#site-search");
  const resultsEl = document.querySelector("#search-results");
  if (resultsEl) resultsEl.hidden = true;
  if (input) {
    input.setAttribute("aria-expanded", "false");
    if (clearInput) input.value = "";
  }
  state.searchIndex = -1;
}

function navigate(hash) {
  if (window.location.hash === hash) {
    renderRoute();
  } else {
    window.location.hash = hash;
  }
}

function readRoute() {
  const rawHash = window.location.hash.replace(/^#/, "");
  const hash = rawHash || "/";
  const [pathname] = hash.split("?");
  const parts = pathname.replace(/^\/+|\/+$/g, "").split("/").filter(Boolean);

  if (!parts.length) return { type: "home" };
  if (parts[0] === "safety") return { type: "safety" };
  if (parts[0] === "docs") return { type: "docs", slug: parts[1] };

  const legacySlug = slugify(parts[0]);
  if (pageBySlug.has(legacySlug)) return { type: "docs", slug: legacySlug };

  return { type: "not-found" };
}

function renderRoute() {
  const route = readRoute();
  const outlet = document.querySelector("#route-outlet");
  if (!outlet) return;

  state.currentRoute = route.type;
  updateActiveTopLinks();
  setMobilePanel(false);
  hideSearchResults(true);
  disconnectTocObserver();
  stopHoprAudio();

  if (route.type === "home") outlet.innerHTML = renderHomeView(docs);
  if (route.type === "safety") outlet.innerHTML = renderSafetyView(docs);
  if (route.type === "docs") renderDocsRoute(route.slug, outlet);
  if (route.type === "not-found") outlet.innerHTML = renderNotFoundView(docs);

  outlet.focus({ preventScroll: true });
  window.scrollTo({ top: 0, behavior: "auto" });
}

function renderDocsRoute(slug, outlet) {
  const selectedPage = pageBySlug.get(slug) || docs.firstIntroductionPage;
  if (!selectedPage) {
    outlet.innerHTML = renderNotFoundView(docs);
    return;
  }

  state.currentPage = selectedPage;
  outlet.innerHTML = renderDocsView(docs, selectedPage);
  renderMarkdown(selectedPage);

  if (selectedPage.slug === "hopr") playHoprAudio();
}

function updateActiveTopLinks() {
  const route = readRoute();
  document.querySelectorAll(".top-links a, .mobile-panel a").forEach((link) => {
    const href = link.getAttribute("href") || "";
    const active =
      (route.type === "home" && href === "#/") ||
      (route.type === "docs" && href.includes("#/docs")) ||
      (route.type === "safety" && href === "#/safety");
    link.classList.toggle("is-active", active);
  });
}

function handleInternalLink(event) {
  const link = event.currentTarget;
  const href = link.getAttribute("href");
  if (!href?.startsWith("#")) return;
  event.preventDefault();
  navigate(href);
}

function bindAllInternalLinks() {
  document.addEventListener("click", (event) => {
    const link = event.target.closest("a[data-link]");
    if (!link) return;
    handleInternalLink({ currentTarget: link, preventDefault: () => event.preventDefault() });
  });
}
