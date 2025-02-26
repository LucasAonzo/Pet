import AsyncStorage from '@react-native-async-storage/async-storage';

// Set base URL for API requests
const API_URL = 'http://10.0.2.2:5000/api'; // Use this for Android emulator
// const API_URL = 'http://localhost:5000/api'; // Use this for iOS simulator

/**
 * Get authentication token from storage
 */
const getToken = async () => {
  try {
    return await AsyncStorage.getItem('authToken');
  } catch (error) {
    console.error('Error getting token from storage:', error);
    return null;
  }
};

/**
 * Set authentication token in storage
 */
const setToken = async (token) => {
  try {
    await AsyncStorage.setItem('authToken', token);
  } catch (error) {
    console.error('Error setting token in storage:', error);
  }
};

/**
 * Remove authentication token from storage
 */
const removeToken = async () => {
  try {
    await AsyncStorage.removeItem('authToken');
  } catch (error) {
    console.error('Error removing token from storage:', error);
  }
};

/**
 * Make API request with authentication
 */
const apiRequest = async (endpoint, method = 'GET', data = null) => {
  try {
    const token = await getToken();
    
    const headers = {
      'Content-Type': 'application/json',
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const config = {
      method,
      headers,
    };

    if (data && (method === 'POST' || method === 'PUT')) {
      config.body = JSON.stringify(data);
    }

    const response = await fetch(`${API_URL}${endpoint}`, config);
    const responseData = await response.json();

    if (!response.ok) {
      throw new Error(responseData.message || 'Something went wrong');
    }

    return responseData;
  } catch (error) {
    console.error(`API Request Error (${endpoint}):`, error);
    throw error;
  }
};

// Auth API endpoints
export const authAPI = {
  register: (userData) => apiRequest('/auth/register', 'POST', userData),
  login: (credentials) => apiRequest('/auth/login', 'POST', credentials),
  verifyToken: () => apiRequest('/auth/verify'),
};

// User API endpoints
export const userAPI = {
  getProfile: () => apiRequest('/users/profile'),
  updateProfile: (userData) => apiRequest('/users/profile', 'PUT', userData),
  getPets: () => apiRequest('/users/pets'),
};

// Animals API endpoints
export const animalsAPI = {
  getAll: (filters = {}) => {
    const queryParams = new URLSearchParams(filters).toString();
    return apiRequest(`/animals${queryParams ? `?${queryParams}` : ''}`);
  },
  getById: (id) => apiRequest(`/animals/${id}`),
  create: (animalData) => apiRequest('/animals', 'POST', animalData),
  update: (id, animalData) => apiRequest(`/animals/${id}`, 'PUT', animalData),
  delete: (id) => apiRequest(`/animals/${id}`, 'DELETE'),
  addImage: (id, imageData) => apiRequest(`/animals/${id}/images`, 'POST', imageData),
  deleteImage: (animalId, imageId) => apiRequest(`/animals/${animalId}/images/${imageId}`, 'DELETE'),
};

// Adoptions API endpoints
export const adoptionsAPI = {
  create: (animalId) => apiRequest('/adoptions', 'POST', { animalId }),
  getUserAdoptions: () => apiRequest('/adoptions/user'),
  getById: (id) => apiRequest(`/adoptions/${id}`),
  updateStatus: (id, status) => apiRequest(`/adoptions/${id}/status`, 'PUT', { status }),
};

export default {
  getToken,
  setToken,
  removeToken,
  authAPI,
  userAPI,
  animalsAPI,
  adoptionsAPI,
}; 