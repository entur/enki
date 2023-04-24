module.exports = {
  "transform": {
    '\\.(ts|tsx|js|jsx)$': ['babel-jest', { configFile: './babel-jest.config.js' }],
  },
  "moduleNameMapper": {
    "^.+\\.(css|less|scss)$": "identity-obj-proxy"
  }
};