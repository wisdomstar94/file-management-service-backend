require('dotenv').config();

module.exports = {
  apps: [{
    name: process.env.PROJECT_NAME,
    script: './app.js',
    env: {
      "NODE_ENV": "production",
    },
    // instances: 4,
    exec_mode: 'fork',
    // wait_ready: true,
    listen_timeout: 50000,
    kill_timeout: 5000
  }]
}