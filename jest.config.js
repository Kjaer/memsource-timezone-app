module.exports = {
  testEnvironment: "jsdom",
  moduleNameMapper: {
    "^/(.*)$": "<rootDir>/src/$1",
  },
  verbose: true,
  transform: {
    "^.+\\.(js|jsx)$": "babel-jest",
    ".+\\.(css|styl|less|sass|scss)$": "jest-css-modules-transform",
  },
  globals: {
    NODE_ENV: "test",
  },
  moduleFileExtensions: ["js", "jsx", "json"],
  moduleDirectories: ["node_modules"],
  setupFilesAfterEnv: ["<rootDir>/jest.setup.js"],
};
