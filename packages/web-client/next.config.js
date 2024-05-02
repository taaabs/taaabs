/** @type {import('next').NextConfig} */
const crypto = require('crypto')
const path = require('path')
const TerserPlugin = require('terser-webpack-plugin')

// https://stackoverflow.com/a/69166434/3998651
// Nextjs 14 needs this change to the above answer: https://stackoverflow.com/a/76852889/3998651
// Modified with the help of llama 3 to use sha256 instead of deprecated in node's crypto md5: https://hf.co/chat/r/PiwZzFC
const hashOnlyIdent = (context, _, exportName) => {
  const hash = crypto.createHash('sha256')
  hash.update(
    Buffer.from(
      `filePath:${path
        .relative(context.rootContext, context.resourcePath)
        .replace(/\\+/g, '/')}#className:${exportName}`,
    ),
  )
  return hash
    .digest('base64')
    .replace(/[^a-zA-Z0-9-_]/g, '_')
    .replace(/^(-?\d|--)/, '_$1')
    .slice(0, 7)
}

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
  webpack(config, { dev }) {
    // Find and update the rule for CSS Modules

    if (!dev) {
      const rules = config.module.rules
        .find((rule) => typeof rule.oneOf === 'object')
        .oneOf.filter((rule) => Array.isArray(rule.use))

      rules.forEach((rule) => {
        rule.use.forEach((moduleLoader) => {
          if (
            moduleLoader.loader?.includes('css-loader') &&
            !moduleLoader.loader?.includes('postcss-loader') &&
            moduleLoader.options !== undefined &&
            moduleLoader.options.modules !== undefined
          )
            moduleLoader.options.modules.getLocalIdent = hashOnlyIdent
        })
      })
    }

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
    config.optimization.minimizer = []
    config.optimization.minimizer.push(
      new TerserPlugin({
        terserOptions: {
          mangle: {
            properties: {
              // Mangle properties suffixed with _ (and not __).
              regex: /[^_]_$|^_$/,
            },
          },
        },
      }),
    )

    return config
  },
  experimental: {
    typedRoutes: true,
    windowHistorySupport: true,
  },
}

module.exports = nextConfig
