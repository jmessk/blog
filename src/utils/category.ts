export function normalizeCategory(category: string) {
  return category
    .toLowerCase()
    .replaceAll(" ", "")
    .replaceAll("_", "-")
}
