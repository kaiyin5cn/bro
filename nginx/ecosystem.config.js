module.exports = {
  apps: [
    {
      name: 'url-shortener-8828',
      script: '../backend/server.js',
      cwd: '../backend',
      instances: 1,
      exec_mode: 'fork',
      env: {
        PORT: 8828,
        NODE_ENV: 'production'
      },
      error_file: './logs/err-8828.log',
      out_file: './logs/out-8828.log',
      log_file: './logs/combined-8828.log',
      time: true
    },
    {
      name: 'url-shortener-8829',
      script: '../backend/server.js',
      cwd: '../backend',
      instances: 1,
      exec_mode: 'fork',
      env: {
        PORT: 8829,
        NODE_ENV: 'production'
      },
      error_file: './logs/err-8829.log',
      out_file: './logs/out-8829.log',
      log_file: './logs/combined-8829.log',
      time: true
    },
    {
      name: 'url-shortener-8830',
      script: '../backend/server.js',
      cwd: '../backend',
      instances: 1,
      exec_mode: 'fork',
      env: {
        PORT: 8830,
        NODE_ENV: 'production'
      },
      error_file: './logs/err-8830.log',
      out_file: './logs/out-8830.log',
      log_file: './logs/combined-8830.log',
      time: true
    },
    {
      name: 'url-shortener-8831',
      script: '../backend/server.js',
      cwd: '../backend',
      instances: 1,
      exec_mode: 'fork',
      env: {
        PORT: 8831,
        NODE_ENV: 'production'
      },
      error_file: './logs/err-8831.log',
      out_file: './logs/out-8831.log',
      log_file: './logs/combined-8831.log',
      time: true
    }
  ]
};