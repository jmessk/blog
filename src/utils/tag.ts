export function normalizeTags(tags: string[]): string[] {
  const newTags = tags
    .map(tag => tag
      .toLowerCase()
      .replaceAll(" ", "")
      .replaceAll("-", "")
      .replaceAll("_", "")
    );

  return newTags;
}
