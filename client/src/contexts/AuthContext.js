import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../api/axios';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(localStorage.getItem('token'));

  if (token) {
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  }

  useEffect(() => {
    const initializeAuth = async () => {
      console.log('AuthContext: Starting initialization');
      // Add timeout to prevent infinite loading
      const timeout = setTimeout(() => {
        console.warn('Auth initialization timeout - proceeding without auth');
        setLoading(false);
      }, 5000); // 5 second timeout

      if (token) {
        console.log('AuthContext: Token found, validating...');
        try {
          const response = await api.get('/api/auth/profile', { timeout: 3000 }); // 3 second API timeout
          console.log('AuthContext: Token validation successful', response.data);
          setUser(response.data);
        } catch (error) {
          console.error('AuthContext: Token validation failed:', error);
          localStorage.removeItem('token');
          setToken(null);
          delete api.defaults.headers.common['Authorization'];
        }
      } else {
        console.log('AuthContext: No token found');
      }
      clearTimeout(timeout);
      console.log('AuthContext: Initialization complete');
      setLoading(false);
    };

    initializeAuth();
  }, [token]);

  const login = async (email, password, isOAuth = false) => {
    try {
      if (isOAuth) {
        const token = localStorage.getItem('token');
        if (token) {
          setToken(token);
          api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
          
          const response = await api.get('/api/auth/profile');
          setUser(response.data);
          
          return { success: true };
        }
        return { success: false, message: 'OAuth authentication failed' };
      }
      
      const response = await api.post('/api/auth/login', { email, password });
      const { token: newToken, user: userData } = response.data;
      
      localStorage.setItem('token', newToken);
      setToken(newToken);
      setUser(userData);
      api.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;
      
      return { success: true };
    } catch (error) {
      return { 
        success: false, 
        message: error.response?.data?.message || 'Login failed' 
      };
    }
  };

  const register = async (userData) => {
    try {
      const response = await api.post('/api/auth/register', userData);
      const { token: newToken, user: newUser } = response.data;
      
      localStorage.setItem('token', newToken);
      setToken(newToken);
      setUser(newUser);
      api.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;
      
      return { success: true };
    } catch (error) {
      return { 
        success: false, 
        message: error.response?.data?.message || 'Registration failed' 
      };
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
    delete api.defaults.headers.common['Authorization'];
  };

  const updateProfile = async (profileData) => {
    try {
      const response = await api.put('/api/auth/profile', profileData);
      setUser(response.data);
      return { success: true };
    } catch (error) {
      return { 
        success: false, 
        message: error.response?.data?.message || 'Profile update failed' 
      };
    }
  };

  const loginWithGoogle = () => {
    window.location.href = `${process.env.REACT_APP_API_URL || 'https://learnit-1-dhm3.onrender.com'}/api/auth/google`;
  };

  const value = {
    user,
    loading,
    login,
    register,
    logout,
    updateProfile,
    loginWithGoogle
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
