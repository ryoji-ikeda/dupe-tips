import { Marked } from "marked";
import { markedHighlight } from "marked-highlight";
import Prism from "prismjs";
import "prismjs/components/prism-clike";
import "prismjs/components/prism-java";
import "prismjs/components/prism-python";
import "prismjs/components/prism-javascript";
import "prismjs/components/prism-bash";
import "prismjs/themes/prism-tomorrow.css";
import DOMPurify from "dompurify";

const languageAliases = {
  py: "python",
  js: "javascript",
  sh: "bash",
};
const isMobileViewport = window.matchMedia("(max-width: 900px)").matches;

function escapeHtml(value) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

const marked = new Marked(
  markedHighlight({
    emptyLangClass: "language-plaintext",
    langPrefix: "language-",
    highlight(code, lang) {
      const language = languageAliases[lang] || lang || "plaintext";

      if (Prism.languages[language]) {
        return Prism.highlight(code, Prism.languages[language], language);
      }

      return escapeHtml(code);
    },
  })
);

const pages = import.meta.glob("./info/*.md", {
  query: "?raw",
  import: "default",
});

const infoList = document.querySelector("#info-list");
const content = document.querySelector("#md-content");

function getFileName(path) {
  return path.split("/").pop().replace(".md", "");
}

function slugify(value) {
  return value.trim().replace(/\s+/g, "-");
}

function isHomePath(path) {
  return slugify(getFileName(path)).toLowerCase() === "00-home";
}

function getUrlPath(path) {
  if (isHomePath(path)) {
    return "/";
  }

  return `/${encodeURIComponent(slugify(getFileName(path)))}`;
}

function getTitle(path) {
  return getFileName(path)
    .replace(/[-_]/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

function getPageFromCurrentUrl(entries) {
  const currentSlug = decodeURIComponent(window.location.pathname)
    .replace(/^\/+/, "")
    .replace(/\/+$/, "");

  if (!currentSlug) {
    return entries.find(([path]) => isHomePath(path)) || entries[0];
  }

  return (
    entries.find(([path]) => slugify(getFileName(path)) === currentSlug) ||
    entries.find(([path]) => isHomePath(path)) ||
    entries[0]
  );
}

async function loadPage(path, button, pushState = true) {
  const markdown = await pages[path]();

  content.innerHTML = DOMPurify.sanitize(marked.parse(markdown));

  document.querySelectorAll("[data-info-button]").forEach((btn) => {
    btn.classList.remove("bg-green-500", "text-black");
    btn.classList.add("text-green-500");
  });

  button.classList.add("bg-green-500", "text-black");
  button.classList.remove("text-green-500");

  if (pushState) {
    window.history.pushState({}, "", getUrlPath(path));
  }
}

if (!isMobileViewport) {
  const entries = Object.entries(pages).sort(([a], [b]) => {
    return getTitle(a).localeCompare(getTitle(b));
  });

  const buttonByPath = new Map();

  for (const [path] of entries) {
    const button = document.createElement("button");

    button.type = "button";
    button.dataset.infoButton = "true";
    button.textContent = getTitle(path);

    button.className =
      "block w-full rounded-lg border border-green-500/40 px-3 py-2 text-left text-green-500 transition hover:bg-green-500 hover:text-black";

    button.addEventListener("click", () => loadPage(path, button));

    infoList.appendChild(button);
    buttonByPath.set(path, button);
  }

  if (entries.length > 0) {
    const entryToLoad = getPageFromCurrentUrl(entries);
    const buttonToActivate = buttonByPath.get(entryToLoad[0]);

    loadPage(entryToLoad[0], buttonToActivate, false);
  }

  window.addEventListener("popstate", () => {
    const entryToLoad = getPageFromCurrentUrl(entries);
    const buttonToActivate = buttonByPath.get(entryToLoad[0]);

    loadPage(entryToLoad[0], buttonToActivate, false);
  });
}
