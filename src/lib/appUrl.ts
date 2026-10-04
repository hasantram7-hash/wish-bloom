/**
 * App URL & Canonical Origin Utility
 * Dynamically resolves window.location.origin on client to ensure preview
 * deployments, Vercel production URLs, and custom domains work automatically.
 */

export function getAppOrigin(): string {
  if (typeof window !== 'undefined' && window.location?.origin) {
    return window.location.origin;
  }
  const envUrl = (import.meta.env.VITE_APP_URL as string | undefined)?.trim();
  if (envUrl) {
    return envUrl.replace(/\/+$/, '');
  }
  return 'http://localhost:3000';
}

export function getSurpriseShareUrl(slug: string): string {
  return `${getAppOrigin()}/surprise/${slug}`;
}

export function getSurpriseManageUrl(slug: string): string {
  return `${getAppOrigin()}/surprise/${slug}/manage`;
}
