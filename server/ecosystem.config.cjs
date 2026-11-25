module.exports = {
  apps: [
    {
      name: 'reliablekrishi-api',
      script: './dist/server.js',
      cwd: __dirname,
      instances: 1,
      exec_mode: 'fork',
      watch: false,
      max_memory_restart: '512M',
      env: {
        NODE_ENV: 'development',
        PORT: 5000,
        UV_THREADPOOL_SIZE: '2',
        DB_POOL_SIZE: '2',
        DB_POOL_TIMEOUT: '20',
      },
    },
  ],
};