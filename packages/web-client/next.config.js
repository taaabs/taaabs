/** @type {import('next').NextConfig} */
const crypto = require('crypto')
const path = require('path')

// https://stackoverflow.com/a/69166434/3998651
// Nextjs 14 needs this change to the above answer: https://stackoverflow.com/a/76852889/3998651
const hash_only_ident = (context, _, export_name) => {
  const hash = crypto.createHash('sha256')
  hash.update(
    Buffer.from(
      `filePath:${path
        .relative(context.rootContext, context.resourcePath)
        .replace(/\\+/g, '/')}#className:${export_name}`,
    ),
  )
  return hash
    .digest('base64')
    .replace(/[^a-zA-Z0-9-_]/g, '_')
    .replace(/^(-?\d|--)/, '_$1')
    .slice(0, 5)
}

const next_config = {
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
            moduleLoader.options.modules.getLocalIdent = hash_only_ident
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

    return config
  },
  experimental: {
    typedRoutes: true,
    windowHistorySupport: true,
  },
}

module.exports = next_config
