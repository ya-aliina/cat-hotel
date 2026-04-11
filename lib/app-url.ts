function normalizeUrl(url: string) {
  return url.endsWith('/') ? url.slice(0, -1) : url;
}

export function getAppBaseUrl() {
  const explicitUrl = process.env.NEXTAUTH_URL ?? process.env.APP_URL;

  if (explicitUrl) {
    return normalizeUrl(explicitUrl);
  }

  const productionVercelUrl = process.env.VERCEL_PROJECT_PRODUCTION_URL;

  if (process.env.NODE_ENV === 'production' && productionVercelUrl) {
    return normalizeUrl(`https://${productionVercelUrl}`);
  }

  if (process.env.VERCEL_URL) {
    return normalizeUrl(`https://${process.env.VERCEL_URL}`);
  }

  return 'http://localhost:3000';
}