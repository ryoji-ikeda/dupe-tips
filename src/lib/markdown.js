import { Marked } from "marked";
import { markedHighlight } from "marked-highlight";
import Prism from "prismjs";
import "prismjs/components/prism-clike";
import "prismjs/components/prism-java";
import "prismjs/components/prism-python";
import "prismjs/components/prism-javascript";
import "prismjs/components/prism-bash";
import "prismjs/components/prism-sql";
import "prismjs/themes/prism-tomorrow.css";
import DOMPurify from "dompurify";
import { languageAliases } from "./constants.js";
import { escapeHtml, slugify } from "./utils.js";

let tocObserver = null;

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

marked.setOptions({
  gfm: true,
  breaks: false,
});

export function disconnectTocObserver() {
  if (tocObserver) {
    tocObserver.disconnect();
    tocObserver = null;
  }
}

export function renderMarkdown(page) {
  const content = document.querySelector("#md-content");
  if (!content) return;

  const rawHtml = marked.parse(page.markdown);
  content.innerHTML = DOMPurify.sanitize(rawHtml, {
    ADD_ATTR: ["target", "rel"],
  });

  addHeadingIdsAndToc(content);
  enhanceMarkdownLinks(content);
  addCopyButtons(content);
}

function addHeadingIdsAndToc(content) {
  const headings = [...content.querySelectorAll("h1, h2, h3, h4")].map((heading) => {
    const base = slugify(heading.textContent || "section") || "section";
    let id = base;
    let counter = 2;
    while (content.querySelector(`#${CSS.escape(id)}`)) {
      id = `${base}-${counter}`;
      counter += 1;
    }
    heading.id = id;
    heading.tabIndex = -1;
    return {
      id,
      text: heading.textContent || "Section",
      depth: Number(heading.tagName.replace("H", "")),
      element: heading,
    };
  });

  const toc = document.querySelector("#toc-nav");
  if (!toc) return;

  if (!headings.length) {
    toc.innerHTML = `<p class="toc-empty">No headings found.</p>`;
    return;
  }

  toc.innerHTML = headings
    .map(
      (heading) => `
      <button class="toc-link depth-${heading.depth}" type="button" data-heading-id="${heading.id}">
        ${escapeHtml(heading.text)}
      </button>
    `
    )
    .join("");

  toc.querySelectorAll("[data-heading-id]").forEach((button) => {
    button.addEventListener("click", () => {
      document.getElementById(button.dataset.headingId)?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  });

  observeHeadings(headings);
}

function observeHeadings(headings) {
  disconnectTocObserver();

  let frame = null;

  const setActiveHeading = () => {
    frame = null;

    const topbarHeight = document.querySelector("[data-topbar]")?.getBoundingClientRect().height || 0;
    const activationLine = topbarHeight + 32;
    let activeHeading = headings[0];

    for (const heading of headings) {
      if (heading.element.getBoundingClientRect().top <= activationLine) {
        activeHeading = heading;
      } else {
        break;
      }
    }

    document.querySelectorAll(".toc-link").forEach((link) => {
      link.classList.toggle("is-active", link.dataset.headingId === activeHeading.id);
    });
  };

  const queueActiveHeadingUpdate = () => {
    if (frame !== null) return;
    frame = requestAnimationFrame(setActiveHeading);
  };

  window.addEventListener("scroll", queueActiveHeadingUpdate, { passive: true });
  window.addEventListener("resize", queueActiveHeadingUpdate);
  queueActiveHeadingUpdate();

  tocObserver = {
    disconnect() {
      window.removeEventListener("scroll", queueActiveHeadingUpdate);
      window.removeEventListener("resize", queueActiveHeadingUpdate);
      if (frame !== null) cancelAnimationFrame(frame);
      frame = null;
    },
  };
}

function enhanceMarkdownLinks(content) {
  content.querySelectorAll("a[href]").forEach((link) => {
    const href = link.getAttribute("href") || "";
    if (/^https?:\/\//.test(href)) {
      link.target = "_blank";
      link.rel = "noreferrer noopener";
    }
  });
}

function addCopyButtons(content) {
  content.querySelectorAll("pre").forEach((pre) => {
    const code = pre.querySelector("code");
    if (!code) return;

    const wrapper = document.createElement("div");
    wrapper.className = "code-block";
    const button = document.createElement("button");
    button.className = "copy-button";
    button.type = "button";
    button.textContent = "Copy";
    button.addEventListener("click", async () => {
      try {
        await navigator.clipboard.writeText(code.textContent || "");
        button.textContent = "Copied";
        setTimeout(() => (button.textContent = "Copy"), 1400);
      } catch {
        button.textContent = "Select";
        setTimeout(() => (button.textContent = "Copy"), 1400);
      }
    });

    pre.parentNode.insertBefore(wrapper, pre);
    wrapper.appendChild(button);
    wrapper.appendChild(pre);
  });
}
