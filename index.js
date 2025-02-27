// Error handler for debugging Supabase issues
console.log('Starting application...');

// Import polyfills first
import './src/utils/polyfills';

// Import the main app and register it
import { registerRootComponent } from 'expo';
import App from './App';

// Set up global error handler for React Native
if (__DEV__) {
  // In development, log errors to console
  const errorHandler = (error, isFatal) => {
    console.error('Global error caught:', error);
  };
  
  // Use React Native's error handler instead of Node.js process.on
  global.ErrorUtils.setGlobalHandler(errorHandler);
}

registerRootComponent(App);
