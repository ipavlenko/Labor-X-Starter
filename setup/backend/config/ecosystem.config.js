module.exports = {
  apps: [
    {
      name: 'laborx.exchange.backend',
      script: 'bin/www',
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
