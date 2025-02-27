const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');

const config = getDefaultConfig(__dirname);

// Force resolving Supabase modules and Babel helpers
config.resolver.extraNodeModules = {
  '@supabase/supabase-js': require.resolve('@supabase/supabase-js'),
  'react-native-url-polyfill': require.resolve('react-native-url-polyfill'),
  '@babel/runtime/helpers/interopRequireDefault': require.resolve('@babel/runtime/helpers/interopRequireDefault')
};

// Include node_modules in watchFolders for hot reload support
config.watchFolders = [
  path.resolve(__dirname, 'node_modules')
];

// Ensure we can resolve all file types
config.resolver.sourceExts = ['js', 'jsx', 'ts', 'tsx', 'cjs', 'mjs', 'json'];

module.exports = config;