module.exports = {
  moduleNameMapper: {
    '^@root/(.*)$': '<rootDir>/src/$1',
    '^@middleware/(.*)$': '<rootDir>/src/middleware/$1',
    '^@models/(.*)$': '<rootDir>/src/models/$1',
    '^@config/(.*)$': '<rootDir>/src/config/$1',
    '^@helpers/(.*)$': '<rootDir>/src/helpers/$1',
    '^@controllers/(.*)$': '<rootDir>/src/controllers/$1',
    '^@routes/(.*)$': '<rootDir>/src/routes/$1',
    '^@utils/(.*)$': '<rootDir>/src/utils/$1',
    '^@cron/(.*)$': '<rootDir>/src/cron/$1',
  },
};