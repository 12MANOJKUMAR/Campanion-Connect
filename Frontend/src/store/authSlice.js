// File: ../store/authSlice.js

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// --- API Endpoints ---
const API_BASE_URL = 'http://localhost:5000/api';
const REGISTER_URL = `${API_BASE_URL}/auth/register`;
const LOGIN_URL = `${API_BASE_URL}/auth/login`;
const LOGOUT_URL = `${API_BASE_URL}/auth/logout`;
const CHECK_AUTH_URL = `${API_BASE_URL}/auth/me`;

// --- Axios Instance with Default Config ---
const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: false,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Attach Authorization header automatically if token exists
axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  } else {
    delete config.headers.Authorization;
  }
  return config;
});

// --- Async Thunks for API Calls ---

/**
 * ✅ FIXED: Checks if the user is already logged in using actual API call
 */
export const checkAuthStatus = createAsyncThunk(
  'auth/checkAuthStatus',
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      
      if (!token) {
        return rejectWithValue('No token found');
      }

      // ✅ Actual API call to verify token
      const response = await axiosInstance.get('/auth/me');

      if (response.data.success) {
        return { user: response.data.user, token };
      } else {
        throw new Error('Authentication failed');
      }

    } catch (error) {
      // ✅ Clear invalid token
      localStorage.removeItem('token');
      sessionStorage.removeItem('simulated_cookie');
      
      const errorMessage = error.response?.data?.message || 'User not authenticated.';
      return rejectWithValue(errorMessage);
    }
  }
);

/**
 * ✅ FIXED: Handles user login with proper error handling and token storage
 */
export const loginUser = createAsyncThunk(
  'auth/loginUser',
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post('/auth/login', { 
        email, 
        password 
      });

      if (response.data.success) {
        const { user, token } = response.data;
        
        // ✅ Store token properly
        if (token) {
          localStorage.setItem('token', token);
        }
        
        // ✅ Return user data for state update
        return { user, token };
      } else {
        throw new Error('Login failed');
      }

    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Login failed. Please check your credentials.';
      return rejectWithValue(errorMessage);
    }
  }
);

/**
 * ✅ FIXED: Handles user logout with proper cleanup
 */
export const logoutUser = createAsyncThunk(
  'auth/logoutUser',
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      
      // ✅ Call logout API with token
      await axiosInstance.post('/auth/logout', {});
      
      // ✅ Clear all stored data
      localStorage.removeItem('token');
      sessionStorage.removeItem('authToken');
      sessionStorage.removeItem('simulated_cookie');
      
      return { success: true };

    } catch (error) {
      // ✅ Clear storage even if API fails
      localStorage.removeItem('token');
      sessionStorage.removeItem('authToken');
      sessionStorage.removeItem('simulated_cookie');
      
      console.error('Logout error:', error);
      return { success: true }; // Still return success for local cleanup
    }
  }
);

/**
 * ✅ FIXED: Handles user registration with proper validation and error handling
 */
export const registerUser = createAsyncThunk(
  'auth/registerUser',
  async (userData, { rejectWithValue }) => {
    try {
      // ✅ Validate required fields
      if (!userData.email || !userData.password || !userData.fullName) {
        return rejectWithValue('Please provide all required fields');
      }

      console.log('Attempting registration for:', userData.email);

      // ✅ API call with proper data mapping
      const response = await axiosInstance.post('/auth/register', {
        fullName: userData.fullName.trim(),
        email: userData.email.trim().toLowerCase(),
        password: userData.password,
        interests: userData.selectedInterests || [],
        profilePicture: userData.profilePicture || null,
      });

      // ✅ Check response and store token
      if (response.data.success) {
        const { user, token } = response.data;
        
        if (token) {
          localStorage.setItem('token', token);
        }
        
        return { user, token };
      } else {
        throw new Error(response.data.message || 'Registration failed');
      }

    } catch (error) {
      // ✅ Comprehensive error handling
      let errorMessage = 'Registration failed. Please try again.';
      
      if (error.response) {
        // Server responded with error
        errorMessage = error.response.data?.message || errorMessage;
        
        // Handle specific error codes
        if (error.response.status === 409) {
          errorMessage = 'Email already exists. Please use a different email.';
        } else if (error.response.status === 400) {
          errorMessage = error.response.data?.message || 'Invalid input. Please check your details.';
        } else if (error.response.status >= 500) {
          errorMessage = 'Server error. Please try again later.';
        }
      } else if (error.request) {
        // Request made but no response
        errorMessage = 'Network error. Please check your connection.';
      }

      console.error('Registration error:', error);
      return rejectWithValue(errorMessage);
    }
  }
);

// --- Auth Slice ---

// ✅ FIXED: Check token availability in localStorage on initialization
const token = localStorage.getItem('token');

const initialState = {
  user: null,
  token: token || null, // ✅ Initialize with token from localStorage
  isAuthenticated: !!token, // ✅ Set to true if token exists
  isAuthLoading: !!token, // ✅ Set to true if token exists (will verify)
  status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    // ✅ Manual logout action
    clearAuth: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.status = 'idle';
      state.error = null;
      state.isAuthLoading = false;
      localStorage.removeItem('token');
      sessionStorage.removeItem('authToken');
      sessionStorage.removeItem('simulated_cookie');
    },
    // ✅ Clear error action
    clearError: (state) => {
      state.error = null;
    },
    // ✅ Set credentials action (for manual login/register)
    setCredentials: (state, action) => {
      const { user, token } = action.payload;
      state.user = user;
      state.token = token;
      state.isAuthenticated = !!token; // ✅ Based on token presence
      state.isAuthLoading = false;
      state.status = 'succeeded';
      state.error = null;
      
      // ✅ Store token in localStorage
      if (token) {
        localStorage.setItem('token', token);
      }
    },
    // ✅ NEW: Hydrate auth state from localStorage
    hydrateAuth: (state) => {
      const token = localStorage.getItem('token');
      if (token) {
        state.token = token;
        state.isAuthenticated = true;
        state.isAuthLoading = true; // Will verify with checkAuthStatus
      } else {
        state.isAuthenticated = false;
        state.isAuthLoading = false;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      // --- checkAuthStatus ---
      .addCase(checkAuthStatus.pending, (state) => {
        state.isAuthLoading = true;
        state.error = null;
        state.status = 'loading';
      })
      .addCase(checkAuthStatus.fulfilled, (state, action) => {
        state.isAuthenticated = true; // ✅ Token is valid
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthLoading = false;
        state.status = 'succeeded';
        state.error = null;
      })
      .addCase(checkAuthStatus.rejected, (state, action) => {
        state.isAuthenticated = false; // ✅ Token is invalid
        state.user = null;
        state.token = null;
        state.isAuthLoading = false;
        state.status = 'idle';
        state.error = action.payload;
        // ✅ Clear localStorage token
        localStorage.removeItem('token');
      })

      // --- loginUser ---
      .addCase(loginUser.pending, (state) => {
        state.status = 'loading';
        state.isAuthLoading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        const { user, token } = action.payload;
        state.status = 'succeeded';
        state.isAuthenticated = !!token; // ✅ Based on token presence
        state.user = user;
        state.token = token;
        state.isAuthLoading = false;
        state.error = null;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
        state.isAuthenticated = false;
        state.user = null;
        state.token = null;
        state.isAuthLoading = false;
      })

      // --- logoutUser ---
      .addCase(logoutUser.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
        state.status = 'idle';
        state.error = null;
        state.isAuthLoading = false;
      })
      .addCase(logoutUser.rejected, (state, action) => {
        // ✅ Still clear auth state even on error
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
        state.status = 'idle';
        state.error = action.payload;
        state.isAuthLoading = false;
      })

      // --- registerUser ---
      .addCase(registerUser.pending, (state) => {
        state.status = 'loading';
        state.isAuthLoading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        const { user, token } = action.payload;
        state.status = 'succeeded';
        state.isAuthenticated = !!token; // ✅ Based on token presence
        state.user = user;
        state.token = token;
        state.isAuthLoading = false;
        state.error = null;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
        state.isAuthenticated = false;
        state.user = null;
        state.token = null;
        state.isAuthLoading = false;
        // ✅ Clear localStorage token
        localStorage.removeItem('token');
      });
  },
});

// ✅ Export actions
export const { clearAuth, clearError, setCredentials, hydrateAuth } = authSlice.actions;

// ✅ Export selectors for easy state access
export const selectCurrentUser = (state) => state.auth.user;
export const selectIsAuthenticated = (state) => state.auth.isAuthenticated;
export const selectAuthStatus = (state) => state.auth.status;
export const selectAuthError = (state) => state.auth.error;
export const selectIsAuthLoading = (state) => state.auth.isAuthLoading;
export const selectAuthToken = (state) => state.auth.token;

export default authSlice.reducer;