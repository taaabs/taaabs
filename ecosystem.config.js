module.exports = {
  deploy: {
    production: {
      user: 'ubuntu',
      host: ['57.128.195.88'],
      path: '~/apps/taaabs',
      ref: 'origin/master',
      repo: 'git@github.com:interbe/taaabs.git',
      'post-deploy':
        'pnpm i &&  pnpm --filter "@taaabs/web-client" build && pm2 reload taaabs-client && pnpm --filter "@taaabs/api-load-balancer" build && pm2 reload taaabs-api-load-balancer && redis-cli flushall',
      env: {
        NODE_ENV: 'production',
      },
    },
  },
}
