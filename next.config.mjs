const isProd = process.env.NODE_ENV === 'production';

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  // Only apply basePath and assetPrefix in production
  basePath: isProd ? '/pulsegrid' : '',
  assetPrefix: isProd ? '/pulsegrid/' : '',
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
}

export default nextConfig
