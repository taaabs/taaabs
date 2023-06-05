/** @type {import('next').NextConfig} */

// swc can't be used because it doesn't support emotion's component selectors

const nextConfig = {
  transpilePackages: ['@taaabs/web-ui'],
  typescript: {
    ignoreBuildErrors: true,
  },
  output: 'export',
  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/,
      use: ['@svgr/webpack'],
    })

    return config
  },
}

module.exports = nextConfig
