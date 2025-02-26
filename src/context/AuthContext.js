import React, { createContext, useState, useEffect, useContext } from 'react';
import { authAPI, userAPI, setToken, removeToken, getToken } from '../services/api';

// Create auth context
const AuthContext = createContext();

// Auth provider component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Initialize: check if user is already logged in
  useEffect(() => {
    const checkLoggedIn = async () => {
      try {
        const token = await getToken();
        
        if (token) {
          // Verify token and get user data
          const userData = await userAPI.getProfile();
          setUser(userData);
        }
      } catch (error) {
        console.log('Not logged in or invalid token');
        // Remove invalid token
        await removeToken();
      } finally {
        setIsLoading(false);
      }
    };

    checkLoggedIn();
  }, []);

  // Register user
  const register = async (userData) => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Register user and get token
      const response = await authAPI.register(userData);
      
      // Save token
      await setToken(response.token);
      
      // Get user profile
      const userProfile = await userAPI.getProfile();
      setUser(userProfile);
      
      return userProfile;
    } catch (error) {
      setError(error.message || 'Registration failed');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Login user
  const login = async (email, password) => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Login and get token
      const response = await authAPI.login({ email, password });
      
      // Save token
      await setToken(response.token);
      
      // Get user profile
      const userProfile = await userAPI.getProfile();
      setUser(userProfile);
      
      return userProfile;
    } catch (error) {
      setError(error.message || 'Login failed');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Logout user
  const logout = async () => {
    try {
      setIsLoading(true);
      
      // Remove token from storage
      await removeToken();
      
      // Clear user state
      setUser(null);
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Update user profile
  const updateProfile = async (userData) => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Update user profile
      const updatedProfile = await userAPI.updateProfile(userData);
      
      // Update user state
      setUser(updatedProfile);
      
      return updatedProfile;
    } catch (error) {
      setError(error.message || 'Profile update failed');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Auth context value
  const value = {
    user,
    isAuthenticated: !!user,
    isLoading,
    error,
    register,
    login,
    logout,
    updateProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Hook to use the auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext; 