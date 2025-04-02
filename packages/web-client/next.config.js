/** @type {import('next').NextConfig} */
const path = require('path')
const crypto = require('crypto')

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
            localName,
          ) => {
            const filename = context.resourcePath
            const isModule = /\.module\.(scss|css)$/i.test(filename)
            if (isModule) {
              const moduleName = path
                .basename(filename)
                .replace(/\.module\.(scss|css)$/i, '')
              const hash = crypto
                .createHash('md5')
                .update(`${filename}${localName}`)
                .digest('hex')
                .substring(0, 5)
              return `${moduleName}__${localName}__${hash}`
            }
            return localName
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
