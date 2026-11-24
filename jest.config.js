module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  testMatch: ['**/__tests__/**/*.[jt]s?(x)', '**/?(*.)+(spec|test).[jt]s?(x)'],
  moduleNameMapper: {
    '^react-native$': 'react-native-web',
    '^expo-notifications(.*)$': '<rootDir>/__mocks__/expo-notifications.js',
    '^lucide-react-native$': '<rootDir>/__mocks__/lucide-react-native.js',
  },
  transform: {
    '^.+\\.[jt]sx?$': ['ts-jest', { tsconfig: { jsx: 'react-jsx' } }],
  },
  transformIgnorePatterns: [
    'node_modules/(?!(react-native|@react-native|nativewind|react-native-css-interop)/)',
  ],
  globals: {
    __DEV__: true,
  },
};

