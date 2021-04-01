'use strict';

module.exports = {
	collectCoverage:     true,
	collectCoverageFrom: ['<rootDir>/src/**/*.js'],
	testEnvironment:     'node',
	testMatch:           ['<rootDir>/test/**/*.test.js'],
	verbose:             true
};
