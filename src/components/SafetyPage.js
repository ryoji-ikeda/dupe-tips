import { iconArrow } from "../lib/icons.js";

export function renderSafetyView(docs) {
  return `
    <section class="safety-page page-narrow">
      <span class="eyebrow-pill">Responsible use</span>
      <h1>Scope: authorized servers only.</h1>
      <p>
        This documentation site is designed as an informational reading experience for bug research on servers,
        plugins, or lab environments where you have explicit permission to test.
      </p>
      <div class="scope-grid">
        <article>
          <h2>Use it for</h2>
          <ul>
            <li>Learning common plugin bug patterns.</li>
            <li>Reviewing defensive assumptions in authorized environments.</li>
            <li>Organizing notes for responsible research and reporting.</li>
          </ul>
        </article>
        <article>
          <h2>Avoid</h2>
          <ul>
            <li>Testing on public servers without permission.</li>
            <li>Disrupting economies, players, infrastructure, or services.</li>
            <li>Using notes outside a lawful, approved research scope.</li>
          </ul>
        </article>
      </div>
      <a class="button button-primary" href="${docs.firstIntroductionPage?.href || "#/docs"}" data-link>
        Open docs
        ${iconArrow()}
      </a>
    </section>
  `;
}
