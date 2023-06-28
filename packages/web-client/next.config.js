/** @type {import('next').NextConfig} */

const nextConfig = {
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
