/** @type {import('next').NextConfig} */

const nextConfig = {
  transpilePackages: [
    '@taaabs/web-ui',
    '@taaabs/repositories',
    '@taaabs/shared',
  ],
  typescript: {
    ignoreBuildErrors: true,
  },
  poweredByHeader: false,
  reactStrictMode: false,
  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/,
      use: ['@svgr/webpack'],
    })
    config.module.rules.push({
      test: /\.wasm$/,
      use: [
        {
          loader: 'wasm-loader',
        },
      ],
    })

    return config
  },
  experimental: {
    typedRoutes: true,
    windowHistorySupport: true,
  },
}

module.exports = nextConfig
