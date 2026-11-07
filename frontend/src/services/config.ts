const configuredApiBaseUrl = import.meta.env.VITE_API_BASE_URL?.trim() ?? "";

/** API origin configured through frontend/.env, independent of Vite server routing. */
export const apiBaseUrl = configuredApiBaseUrl.replace(/\/+$/, "");

export function apiUrl(path: string) {
  return `${apiBaseUrl}${path.startsWith("/") ? path : `/${path}`}`;
}
