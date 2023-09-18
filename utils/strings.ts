export function formatCategoryName(category: string) {
  return category.replace(/-/g, ' ').replace(/\b\w/g, (match) => match.toUpperCase());
}
