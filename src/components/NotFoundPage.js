import { iconArrow } from "../lib/icons.js";

export function renderNotFoundView(docs) {
  return `
    <section class="page-narrow empty-page">
      <span class="eyebrow-pill">404</span>
      <h1>That page was not found.</h1>
      <p>The documentation index is generated from the markdown files that exist in <code>src/info</code>.</p>
      <a class="button button-primary" href="${docs.firstIntroductionPage?.href || "#/docs"}" data-link>
        Go to docs
        ${iconArrow()}
      </a>
    </section>
  `;
}
