// SPDX-License-Identifier: Apache-2.0
/*
 * Jest configuration. For a detailed explanation of each option, visit:
 * https://jestjs.io/docs/configuration
 */

import type { Config } from '@jest/types';

const config: Config.InitialOptions = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/__tests__/'],
  testMatch: ['**/*.test.ts'],
  testPathIgnorePatterns: ['/node_modules/'],
  clearMocks: true,
  collectCoverage: true,
  // Coverage is scoped to the unit-testable logic; the gRPC/NATS bootstrap in index.ts is
  // exercised by running the sidecar, not by unit tests.
  collectCoverageFrom: ['src/services/logHandler.ts', 'src/services/nats.ts', 'src/config/server.ts'],
  coverageDirectory: '<rootDir>/coverage/',
  coveragePathIgnorePatterns: ['/node_modules/', './__tests__'],
  coverageProvider: 'v8',
  coverageThreshold: {
    global: {
      branches: 95,
      functions: 95,
      lines: 95,
      statements: 95,
    },
  },
  // Resolve NodeNext-style explicit `.js` extensions in relative imports back to their `.ts` source.
  moduleNameMapper: {
    '^(\\.{1,2}/.*)\\.js$': '$1',
  },
  transform: {
    '^.+\\.ts$': 'ts-jest',
  },
  verbose: true,
};

export default config;
