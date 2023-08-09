module.exports = {
  transform: {
    '^.+\\.(js|jsx|ts|tsx)$': 'babel-jest',
  },
  moduleNameMapper: {
    // '\\.(css|less|sass|scss)$': '<rootDir>/__mocks__/styleMock.js',
    '\\.(jpg|jpeg|png|gif|webp|svg)$': '<rootDir>/__mocks__/fileMock.js',
  },
  transformIgnorePatterns: [
    "node_modules/(?!(react-merge-refs|react-modal-sheet)/)",
  ],
  testEnvironment: 'jsdom',
  setupFiles: ['<rootDir>/__mocks__/localStorageMock.js'],
  setupFilesAfterEnv: ['@testing-library/jest-dom/extend-expect'],
};
