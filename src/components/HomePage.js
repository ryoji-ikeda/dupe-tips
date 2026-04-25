import { iconArrow, iconShield } from "../lib/icons.js";
import { escapeHtml } from "../lib/utils.js";

function homepageCards() {
  return [
    {
      eyebrow: "Foundations",
      title: "Understand common bug classes",
      text: "Read concise notes about recurring plugin mistakes, validation gaps, and race-prone flows without losing context.",
    },
    {
      eyebrow: "Methodology",
      title: "Keep research structured",
      text: "Use categorized documentation, auto-built navigation, and heading anchors to move through topics quickly.",
    },
    {
      eyebrow: "Scope",
      title: "Authorized testing only",
      text: "The site frames these notes for responsible research on systems where you have explicit permission to test.",
    },
  ];
}

function statCards(docs) {
  const populated = docs.categories.filter((category) => category.pages.length > 0).length;
  return [
    { value: docs.pages.length, label: "Markdown pages indexed" },
    { value: populated, label: "Active categories" },
  ];
}

export function renderHomeView(docs) {
  const startHref = docs.firstIntroductionPage?.href || "#/docs";
  return `
    <div class="home-page">
      <section class="hero-section">
        <div class="hero-grid">
          <div class="hero-copy">
            <div class="eyebrow-pill">Authorized server research only</div>
            <h1>Bug research notes, rebuilt as a modern documentation hub.</h1>
            <p>
              DupeTips is now organized like a polished docs site: searchable markdown titles,
              category navigation, clean reading views, and a fast table of contents for every page.
            </p>
            <div class="hero-actions">
              <a class="button button-primary" href="${startHref}" data-link>
                Start Reading
                ${iconArrow()}
              </a>
              <a class="button button-secondary" href="#/safety" data-link>
                Read the scope
              </a>
            </div>
          </div>

          <div class="hero-panel" aria-label="Documentation preview">
            <div class="terminal-bar">
              <span></span><span></span><span></span>
              <strong>docs/index</strong>
            </div>
            <div class="panel-lines">
              ${docs.categories
                .map(
                  (category) => `
                  <div class="panel-line ${category.pages.length ? "" : "is-muted"}">
                    <span>${escapeHtml(category.name)}</span>
                    <strong>${category.pages.length}</strong>
                  </div>
                `
                )
                .join("")}
            </div>
            <div class="panel-callout">
              ${iconShield()}
              <span>Research notes stay readable, responsive, and permission-focused.</span>
            </div>
          </div>
        </div>
      </section>

      <section class="stats-row" aria-label="Site stats">
        ${statCards(docs)
          .map(
            (stat) => `
            <div class="stat-card">
              <strong>${escapeHtml(stat.value)}</strong>
              <span>${escapeHtml(stat.label)}</span>
            </div>
          `
          )
          .join("")}
      </section>

      <section class="section-block" id="coverage">
        <div class="section-heading">
          <span class="eyebrow-pill">What this site covers</span>
          <h2>Designed for focused, responsible reading.</h2>
          <p>Existing markdown is kept intact while the surrounding experience now feels like a professional docs product.</p>
        </div>
        <div class="feature-grid">
          ${homepageCards()
            .map(
              (card) => `
              <article class="feature-card">
                <span>${escapeHtml(card.eyebrow)}</span>
                <h3>${escapeHtml(card.title)}</h3>
                <p>${escapeHtml(card.text)}</p>
              </article>
            `
            )
            .join("")}
        </div>
      </section>

      <section class="section-block docs-preview">
        <div class="section-heading compact">
          <span class="eyebrow-pill">Documentation</span>
          <h2>Browse by generated categories.</h2>
        </div>
        <div class="category-preview-grid">
          ${docs.categories
            .map(
              (category) => `
              <article class="category-card">
                <div>
                  <h3>${escapeHtml(category.name)}</h3>
                  <p>${category.pages.length || "No"} page${category.pages.length === 1 ? "" : "s"}</p>
                </div>
                <div class="category-links">
                  ${category.pages
                    .slice(0, 4)
                    .map((page) => `<a href="${page.href}" data-link>${escapeHtml(page.title)}</a>`)
                    .join("") || `<span>Ready for future markdown files.</span>`}
                </div>
              </article>
            `
            )
            .join("")}
        </div>
      </section>
    </div>
  `;
}
