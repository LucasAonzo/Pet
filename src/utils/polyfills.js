/**
 * React Native Polyfills for Supabase and other libraries
 * This file should be imported at the top of your entry file (index.js or App.js)
 */

// URL polyfill for React Native
import 'react-native-url-polyfill/auto';

// Directly define the interopRequireDefault helper on global
if (typeof global !== 'undefined' && !global['@babel/runtime/helpers/interopRequireDefault']) {
  global['@babel/runtime/helpers/interopRequireDefault'] = function(obj) {
    return obj && obj.__esModule ? obj : { default: obj };
  };
}

console.log('Polyfills initialized'); 