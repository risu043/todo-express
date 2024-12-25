const port = process.env.PORT ?? 4444;
module.exports = {
  server: {
    command: `PORT=${port} npm run start:test`,
    port: port,
    launchTimeout: 30000,
  },
  launch: {
    headless: true,
  },
  browserContext: "incognito",
};
