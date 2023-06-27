/** @type {import('next').NextConfig} */

// swc can't be used because it doesn't support emotion's component selectors

const nextConfig = {
  output: 'export',
  transpilePackages: ['@taaabs/web-ui', '@taaabs/repositories'],
  typescript: {
    ignoreBuildErrors: true,
  },
  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/,
      use: ['@svgr/webpack'],
    })

    return config
  },
}

module.exports = nextConfig
