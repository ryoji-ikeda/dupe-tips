import { marked } from "marked";
import DOMPurify from "dompurify";

const pages = import.meta.glob("./info/*.md", {
  query: "?raw",
  import: "default",
});

const infoList = document.querySelector("#info-list");
const content = document.querySelector("#md-content");

function getTitle(path) {
  return path
    .split("/")
    .pop()
    .replace(".md", "")
    .replace(/[-_]/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

async function loadPage(path, button) {
  const markdown = await pages[path]();

  content.innerHTML = DOMPurify.sanitize(marked.parse(markdown));

  document.querySelectorAll("[data-info-button]").forEach((btn) => {
    btn.classList.remove("bg-green-500", "text-black");
    btn.classList.add("text-green-500");
  });

  button.classList.add("bg-green-500", "text-black");
  button.classList.remove("text-green-500");
}

const entries = Object.entries(pages).sort(([a], [b]) => {
  return getTitle(a).localeCompare(getTitle(b));
});

for (const [path] of entries) {
  const button = document.createElement("button");

  button.type = "button";
  button.dataset.infoButton = "true";
  button.textContent = getTitle(path);

  button.className =
    "block w-full rounded-lg border border-green-500/40 px-3 py-2 text-left text-green-500 transition hover:bg-green-500 hover:text-black";

  button.addEventListener("click", () => loadPage(path, button));

  infoList.appendChild(button);
}

const defaultPagePath = "./info/00-home.md";

if (entries.length > 0) {
  const defaultEntryIndex = entries.findIndex(([path]) => path === defaultPagePath);
  const entryToLoad = defaultEntryIndex >= 0 ? entries[defaultEntryIndex] : entries[0];

  const buttons = Array.from(infoList.querySelectorAll("button"));
  const buttonToActivate =
    defaultEntryIndex >= 0 ? buttons[defaultEntryIndex] : buttons[0];

  loadPage(entryToLoad[0], buttonToActivate);
}