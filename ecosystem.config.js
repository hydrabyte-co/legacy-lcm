module.exports = {
  apps: [
    {
      name: 'lcm-api',
      script: 'dist/main.js',
      args: ' ',
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '1G',
      env: {
        NODE_ENV: 'production',
        API_PORT: 3005,
      },
    },
    {
      name: 'lcm-ms',
      script: 'dist/main.js',
      args: ' ',
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '4G',
      env: {
        NODE_ENV: 'production',
        APP_TYPE: 'microservice',
      },
    },
  ],
};
