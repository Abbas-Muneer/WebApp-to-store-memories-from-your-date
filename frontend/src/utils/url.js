export function withApiUrl(path) {
  if (!path) return '';
  if (path.startsWith('http')) return path;
  const base = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';
  const trimmed = path.startsWith('/') ? path.slice(1) : path;
  return `${base}/${trimmed}`;
}
