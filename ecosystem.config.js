export default {
  apps: [
    {
      name: "api-laotoyota-2026",
      script: "./src/server.js", // Path to your build output
      instances: "max",
      exec_mode: "cluster",
      env: {
        NODE_ENV: "development",
      },
      env_production: {
        NODE_ENV: "production",
        PORT: 8000,
      },
      // Production Best Practices
      max_memory_restart: "512M", // Restart if app leaks memory
      autorestart: true,
      watch: false,               // Disable for production
      log_date_format: "YYYY-MM-DD HH:mm Z",
      error_file: "./logs/err.log",
      out_file: "./logs/out.log",
      merge_logs: true
    }
  ]
};