import { CATEGORY_ORDER } from "./constants.js";
import { getDirectoryParts, getFileBase, slugify, stripOrderPrefix } from "./utils.js";

const markdownModules = import.meta.glob("/src/info/**/*.md", {
  query: "?raw",
  import: "default",
  eager: true,
});

function firstHeading(markdown) {
  const match = markdown.match(/^#\s+(.+)$/m);
  return match?.[1]?.trim().replace(/[#*_`]/g, "") || "";
}

function pageTitle(path, markdown) {
  return firstHeading(markdown) || stripOrderPrefix(getFileBase(path));
}

function inferCategory(path, markdown, title) {
  const folders = getDirectoryParts(path).map((part) => part.toLowerCase());
  const folderCategory = CATEGORY_ORDER.find((category) =>
    folders.some((part) => slugify(part) === slugify(category))
  );

  if (folderCategory) return folderCategory;

  const haystack = `${title}\n${stripOrderPrefix(getFileBase(path))}\n${markdown}`.toLowerCase();

  if (/install|setup|configure|dependency|requirements?/.test(haystack)) return "Installation";
  if (/\bmod\b|\bmods\b|meteor|ui utils|client/.test(haystack)) return "Mods";
  if (/dupe|injection|race condition|validation|sql|exploit|vulnerab|recon|pipeline|container|minimessage|nivv/.test(haystack)) {
    if (/what is dupetips|how to use this|tos/.test(haystack)) return "Introduction";
    return "Hunting";
  }
  if (/home|intro|basics|overview|getting started|what is/.test(haystack)) return "Introduction";

  return "Other";
}

function sortByOrderAndTitle(a, b) {
  const aBase = getFileBase(a.path);
  const bBase = getFileBase(b.path);
  const aNumber = Number(aBase.match(/^\d+/)?.[0] ?? Number.POSITIVE_INFINITY);
  const bNumber = Number(bBase.match(/^\d+/)?.[0] ?? Number.POSITIVE_INFINITY);

  if (aNumber !== bNumber) return aNumber - bNumber;
  return a.title.localeCompare(b.title);
}

export function docsRoute(page) {
  return `#/docs/${page.slug}`;
}

export function buildDocs() {
  const pages = Object.entries(markdownModules)
    .map(([path, markdown]) => {
      const title = pageTitle(path, markdown);
      const slug = slugify(stripOrderPrefix(getFileBase(path)) || title);
      return {
        path,
        markdown,
        title,
        fileTitle: stripOrderPrefix(getFileBase(path)),
        slug,
        category: inferCategory(path, markdown, title),
        href: `#/docs/${slug}`,
      };
    })
    .sort(sortByOrderAndTitle);

  const usedSlugs = new Map();
  for (const page of pages) {
    const count = usedSlugs.get(page.slug) || 0;
    usedSlugs.set(page.slug, count + 1);
    if (count > 0) page.slug = `${page.slug}-${count + 1}`;
    page.href = docsRoute(page);
  }

  const categories = CATEGORY_ORDER.map((name) => ({
    name,
    pages: pages.filter((page) => page.category === name).sort(sortByOrderAndTitle),
  }));

  return {
    pages,
    categories,
    firstIntroductionPage:
      categories.find((category) => category.name === "Introduction")?.pages[0] || pages[0],
  };
}

export const docs = buildDocs();
export const pageBySlug = new Map(docs.pages.map((page) => [page.slug, page]));
