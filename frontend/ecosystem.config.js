module.exports = {
  apps: [
    {
      name: "hexacodex-frontend",
      script: "npm",
      args: "run serve:pm2",
      cwd: __dirname,
      interpreter: "cmd.exe"
    }
  ]
}
