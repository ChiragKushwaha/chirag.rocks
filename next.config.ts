import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  i18n: {
    locales: ['en-US', 'fr', 'IN', 'nl-NL'],
    defaultLocale: 'en-US'
  },
  reactStrictMode: true
};

export default nextConfig;
