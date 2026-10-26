// Proxy configuration helper for development and production API calls
export const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000';

export function getApiEndpoint(path: string): string {
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  if (typeof window === 'undefined') {
    // Server-side
    return `${BACKEND_URL}${cleanPath}`;
  }
  // Client-side can route through Next.js rewrite or direct backend
  return cleanPath;
}
