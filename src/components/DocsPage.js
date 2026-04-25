import { escapeHtml } from "../lib/utils.js";

export function renderDocsView(docs, selectedPage) {
  return `
    <div class="docs-layout">
      <aside class="docs-sidebar" aria-label="Documentation navigation">
        <div class="sidebar-header">
          <span>Documentation</span>
          <a href="${docs.firstIntroductionPage?.href || "#/docs"}" data-link>Start</a>
        </div>
        <nav class="docs-nav">
          ${docs.categories.map((category) => renderCategoryNav(category, selectedPage)).join("")}
        </nav>
      </aside>

      <article class="doc-card">
        <div class="doc-header">
          <div>
            <span class="eyebrow-pill">${escapeHtml(selectedPage.category)}</span>
            <h1>${escapeHtml(selectedPage.title)}</h1>
          </div>
          <a class="doc-top-link" href="#/" data-link>Home</a>
        </div>
        <div id="md-content" class="markdown"></div>
        <div class="doc-footer-nav">
          ${renderPrevNext(docs, selectedPage)}
        </div>
      </article>

      <aside class="toc-sidebar" aria-label="On this page">
        <div class="toc-card">
          <span>On this page</span>
          <nav id="toc-nav"></nav>
        </div>
      </aside>
    </div>
  `;
}

function renderCategoryNav(category, selectedPage) {
  return `
    <section class="docs-nav-group">
      <h2>${escapeHtml(category.name)}</h2>
      <div>
        ${category.pages.length
          ? category.pages
              .map(
                (page) => `
              <a class="docs-nav-link ${page.slug === selectedPage.slug ? "is-active" : ""}" href="${page.href}" data-link>
                <span>${escapeHtml(page.title)}</span>
              </a>
            `
              )
              .join("")
          : `<p class="docs-nav-empty">No pages yet</p>`}
      </div>
    </section>
  `;
}

function renderPrevNext(docs, selectedPage) {
  const index = docs.pages.findIndex((page) => page.slug === selectedPage.slug);
  const prev = docs.pages[index - 1];
  const next = docs.pages[index + 1];

  return `
    ${prev ? `<a href="${prev.href}" data-link><span>Previous</span><strong>${escapeHtml(prev.title)}</strong></a>` : `<span></span>`}
    ${next ? `<a href="${next.href}" data-link><span>Next</span><strong>${escapeHtml(next.title)}</strong></a>` : `<span></span>`}
  `;
}
