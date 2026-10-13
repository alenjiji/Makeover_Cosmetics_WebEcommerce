// PM2 process file for a Hostinger VPS (see docs/DEPLOY.md).
// Usage: npm ci && npm run build && pm2 start ecosystem.config.cjs && pm2 save
//
// Keep a single instance: the contact form's rate limiter and the page cache live in this
// process's memory and disk. Scaling out needs NEXT_SERVER_ACTIONS_ENCRYPTION_KEY and a
// shared cache (Next.js self-hosting guide).
module.exports = {
  apps: [
    {
      name: "makeover-overseas",
      script: "node_modules/next/dist/bin/next",
      // Only nginx needs to reach it; next start reads PORT but not HOSTNAME from the env.
      args: "start -H 127.0.0.1",
      cwd: __dirname,
      instances: 1,
      exec_mode: "fork",
      max_memory_restart: "700M",
      env: {
        NODE_ENV: "production",
        PORT: 3000,
      },
    },
  ],
};
