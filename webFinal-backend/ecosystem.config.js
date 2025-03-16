module.exports = {
  apps: [
    {
      name: "webFinal",
      script: "./dist/app.js",
      env_production: {
        NODE_ENV: "production",
      },
    },
  ],
};
