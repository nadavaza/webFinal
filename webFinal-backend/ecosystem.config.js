module.exports = {
  apps: [
    {
      name: "app_d",
      script: "./dist/app.js",
      env_production: {
        NODE_ENV: "production",
      },
    },
  ],
};
