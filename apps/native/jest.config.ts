// jest.config.ts
import type { JestConfigWithTsJest } from 'ts-jest';

const config: JestConfigWithTsJest = {
  preset: 'jest-expo',
  coverageDirectory: './src/__coverage__',
  coveragePathIgnorePatterns: ['/node_modules/', '/src/(?!states/)'],
  transformIgnorePatterns: [
    'node_modules/(?!((jest-)?react-native|@react-native(-community)?)|expo(nent)?|@expo(nent)?/.*|@expo-google-fonts/.*|react-navigation|@react-navigation/.*|@sentry/react-native|native-base|react-native-svg|uuid)',
  ],
  moduleNameMapper: {
    '^~/app/utils/storage': '<rootDir>/src/__mocks__/storage.ts',
    '^~/tests/(.*)$': '<rootDir>/src/__tests__/$1',
    '^~/mocks/(.*)$': '<rootDir>/src/__mocks__/$1',
    '^~/app/(.*)$': '<rootDir>/src/$1',
  },
};

export default config;
