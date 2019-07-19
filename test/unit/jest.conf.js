const path = require('path')

module.exports = {
  rootDir: path.resolve(__dirname, '../../'),
  moduleFileExtensions: ['js', 'json', 'vue'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/app/web/$1'
  },
  transform: {
    '^.+\\.js$': '<rootDir>/node_modules/babel-jest',
    '.*\\.(vue)$': '<rootDir>/node_modules/vue-jest'
  },
  snapshotSerializers: ['<rootDir>/node_modules/jest-serializer-vue'],
  setupFiles: ['<rootDir>/test/unit/setup'],
  coverageDirectory: '<rootDir>/coverage',
  collectCoverageFrom: [
    'app/web/**/*.{js,vue}',
    '!app/web/main.js',
    '!app/web/router/index.js',
    '!**/node_modules/**'
  ],
  testURL: 'http://localhost/',
  modulePathIgnorePatterns: ['<rootDir>/build/', '<rootDir>/config/'],
  testResultsProcessor: 'jest-jenkins-reporter'
}
