/**
 * Wrapper for Supabase client to avoid module resolution issues in React Native
 * This provides a bare-bones implementation in case of module resolution errors
 */

import 'react-native-url-polyfill/auto';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';
import Constants from 'expo-constants';

// Get Supabase URL and anon key from environment variables
const supabaseUrl = Constants.expoConfig?.extra?.supabaseUrl || process.env.EXPO_PUBLIC_SUPABASE_URL;
const supabaseKey = Constants.expoConfig?.extra?.supabaseAnonKey || process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

// Fallback values for testing
const fallbackUrl = 'https://your-supabase-project.supabase.co';
const fallbackKey = 'your-anon-key';

// Use fallbacks if environment variables are not set
const url = supabaseUrl || fallbackUrl;
const key = supabaseKey || fallbackKey;

// Basic mock implementation in case the Supabase client fails to load
const createMockClient = () => {
  console.warn('Using mock Supabase client due to module resolution error');
  return {
    from: (table) => ({
      select: (columns) => ({
        eq: (column, value) => ({
          single: () => Promise.resolve({ data: null, error: { message: 'Mock client - module resolution error' } }),
          then: (resolve) => resolve({ data: [], error: null }),
        }),
        then: (resolve) => resolve({ data: [], error: null }),
      }),
      insert: (data) => ({
        select: () => ({
          single: () => Promise.resolve({ data: null, error: { message: 'Mock client - module resolution error' } }),
        }),
        then: (resolve) => resolve({ data: null, error: { message: 'Mock client - module resolution error' } }),
      }),
    }),
    auth: {
      signIn: () => Promise.resolve({ data: null, error: { message: 'Mock client - module resolution error' } }),
      signUp: () => Promise.resolve({ data: null, error: { message: 'Mock client - module resolution error' } }),
      signOut: () => Promise.resolve({ error: null }),
    },
  };
};

// Try to create the real client, fall back to mock if it fails
let supabase;
try {
  console.log('Initializing Supabase client with URL:', url);
  // Initialize the Supabase client with AsyncStorage for React Native
  supabase = createClient(url, key, {
    auth: {
      storage: AsyncStorage,
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: false,
    },
  });
  console.log('Supabase client initialized successfully');
} catch (error) {
  console.error('Error creating Supabase client:', error);
  supabase = createMockClient();
}

export default supabase; 