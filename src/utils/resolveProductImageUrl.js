/**
 * Public product image path from API: use CRA public folder URLs.
 * Absolute http(s) URLs are left unchanged.
 */
export function resolveProductImageUrl(imagePath) {
  if (imagePath == null || typeof imagePath !== 'string') return '';
  const trimmed = imagePath.trim();
  if (!trimmed) return '';
  if (trimmed.startsWith('http')) return trimmed;
  const prefix = process.env.PUBLIC_URL != null ? process.env.PUBLIC_URL : '';
  return `${prefix}${trimmed}`;
}
