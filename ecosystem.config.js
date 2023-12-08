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
      name: 'lcm-ms-file',
      script: 'dist/main.js',
      args: ' ',
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '4G',
      env: {
        NODE_ENV: 'production',
        APP_TYPE: 'microservice',
        RABBITMQ_QUEUE: 'lsm-file',
      },
    },
    {
      name: 'lcm-ms-sync',
      script: 'dist/main.js',
      args: ' ',
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '4G',
      env: {
        NODE_ENV: 'production',
        APP_TYPE: 'microservice',
        RABBITMQ_QUEUE: 'lsm-sync',
      },
    },
    {
      name: 'lcm-wrk',
      script: 'dist/main.js',
      args: ' ',
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '4G',
      env: {
        NODE_ENV: 'production',
        APP_TYPE: 'worker',
      },
    },
  ],
};
