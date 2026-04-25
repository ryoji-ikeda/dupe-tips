import { SYSTEM_THEME_QUERY } from "./constants.js";
import { iconMoon, iconSun } from "./icons.js";

export function getStoredTheme() {
  return localStorage.getItem("theme");
}

export function getEffectiveTheme() {
  const saved = getStoredTheme();
  if (saved === "light" || saved === "dark") return saved;
  return window.matchMedia(SYSTEM_THEME_QUERY).matches ? "dark" : "light";
}

export function applyTheme(theme, persist = true) {
  document.documentElement.dataset.theme = theme;
  document.documentElement.classList.toggle("dark", theme === "dark");
  if (persist) localStorage.setItem("theme", theme);

  const toggle = document.querySelector("#theme-toggle");
  if (!toggle) return;

  toggle.setAttribute("aria-label", `Switch to ${theme === "dark" ? "light" : "dark"} mode`);
  toggle.querySelector("[data-theme-label]").textContent = theme === "dark" ? "Light" : "Dark";
  toggle.querySelector("[data-theme-icon]").innerHTML = theme === "dark" ? iconSun() : iconMoon();
}

export function watchSystemTheme() {
  window.matchMedia(SYSTEM_THEME_QUERY).addEventListener("change", () => {
    if (!getStoredTheme()) applyTheme(getEffectiveTheme(), false);
  });
}
