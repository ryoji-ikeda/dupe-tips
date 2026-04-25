export function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

export function slugify(value) {
  return String(value)
    .toLowerCase()
    .trim()
    .replace(/['’]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function stripOrderPrefix(value) {
  return value.replace(/^\d+[\s._-]*/, "").trim();
}

export function getFileBase(path) {
  return path.split("/").pop().replace(/\.md$/i, "");
}

export function normalizeInfoPath(path) {
  return path.replace(/^.*?\/info\//, "info/");
}

export function getDirectoryParts(path) {
  return normalizeInfoPath(path)
    .replace(/^info\//, "")
    .split("/")
    .slice(0, -1)
    .map(stripOrderPrefix)
    .filter(Boolean);
}

export function normalizeSearch(value) {
  return String(value).toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
}
