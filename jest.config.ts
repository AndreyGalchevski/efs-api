/* eslint-disable import/no-extraneous-dependencies */
import { defaults as tsJestPreset } from 'ts-jest/presets';

const config = {
  ...tsJestPreset,
  verbose: true,
  testEnvironment: 'node',
  setupFiles: ['dotenv/config'],
  testPathIgnorePatterns: ['/node_modules/', '/dist/'],
};

export default config;
