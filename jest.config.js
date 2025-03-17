module.exports = {
  roots: ["src"],
  transform: {
    "^.+\\.ts$": "ts-jest",
  },
  testEnvironment: "jest-environment-jsdom",
  clearMocks: true,
  resetMocks: true,
  restoreMocks: true,
};
