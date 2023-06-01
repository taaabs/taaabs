/** @type {import('next').NextConfig} */
const withSvgr = require('next-plugin-svgr')

const nextConfig = {
  reactStrictMode: true,
  pageExtensions: ['page.tsx'],
  transpilePackages: ['@taaabs/web-ui'],
}

module.exports = withSvgr(nextConfig)
