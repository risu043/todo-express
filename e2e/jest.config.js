module.exports = {
  preset: "jest-puppeteer",
  transform: {
    "^.+\\.tsx?$": ["ts-jest", {tsconfig: `./e2e/tsconfig.json`}],
  },
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/../src/$1",
    "^@prisma/(.*)$": "<rootDir>/../prisma/$1",
  },
  testTimeout: 80000,
  setupFiles: ["<rootDir>/jest-global-setup.js"],
  watchman: false,
};

process.env.JEST_PUPPETEER_CONFIG = require.resolve(
  "./jest-puppeteer.config.js",
);
