module.exports = {
  apps: [
    {
      name: "api-laotoyota-2026",
      script: "./src/server.js", 
      instances: "max",
      exec_mode: "cluster",
      env: {
        NODE_ENV: "development",
      },
      env_production: {
        NODE_ENV: "production",
        PORT: 8000,
      },
      max_memory_restart: "512M", 
      autorestart: true,
      watch: false,               
      log_date_format: "YYYY-MM-DD HH:mm Z",
      error_file: "./logs/err.log",
      out_file: "./logs/out.log",
      merge_logs: true
    }
  ]
};