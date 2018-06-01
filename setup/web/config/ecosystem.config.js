module.exports = {
  apps: [
    {
      name: 'laborx.exchange.web',
      script: 'server.js',
      watch: false,
      env: {
        PORT: 3000,
        NODE_ENV: 'development'
      },
      env_production: {
        PORT: 3000,
        NODE_ENV: 'production'
      }
    }
  ]
}
