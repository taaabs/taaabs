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
  webpack(config) {
    // For development mode, ensure we set up the module naming consistently
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
        ) {
          moduleLoader.options.modules.getLocalIdent = (
            context,
            _,
            exportName,
          ) => {
            const filename = context.resourcePath
            const isModule = /\.module\.(scss|css)$/i.test(filename)
            if (isModule) {
              const moduleName = path
                .basename(filename)
                .replace(/\.module\.(scss|css)$/i, '')
              return `${moduleName}__${exportName}`
            }
            return exportName
          }
        }

        // Add SCSS preprocessor options for dev mode too
        if (moduleLoader.loader?.includes('sass-loader')) {
          moduleLoader.options = moduleLoader.options || {}
          moduleLoader.options.additionalData = `@use "${path.resolve(
            __dirname,
            '../web-ui/src/styles/foundation',
          )}" as *;`
        }
      })
    })

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
  },
}

module.exports = next_config
