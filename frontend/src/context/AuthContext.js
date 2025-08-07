import React, { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '../services/api';

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');
  
    if (token && storedUser) {
      const parsedUser = JSON.parse(storedUser);
  
      if (parsedUser.roles && parsedUser.roles.length > 0) {
        parsedUser.role = parsedUser.roles[0].replace('ROLE_', '');
      }
  
      setUser(parsedUser);
      setIsAuthenticated(true);
    }
  
    setLoading(false);
  }, []);
  



  const login = async (username, password) => {
    try {
      const response = await authAPI.login({ username, password });
  
      const { accessToken, roles, ...rest } = response.data;
  
      // Normalize role (e.g., 'ROLE_ADMIN' → 'ADMIN')
      const normalizedRole = roles[0].replace('ROLE_', '');
  
      const userData = {
        ...rest,
        roles,
        role: normalizedRole, // ← Store this for easy access
      };
  
      localStorage.setItem('token', accessToken);
      localStorage.setItem('user', JSON.stringify(userData));
  
      setUser(userData);
      setIsAuthenticated(true);
  
      return { success: true };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Login failed',
      };
    }
  };
  

  const register = async (userData) => {
    try {
      const response = await authAPI.register(userData);
      return { success: true, message: response.data.message };
    } catch (error) {
      return { 
        success: false, 
        message: error.response?.data?.message || 'Registration failed' 
      };
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    setIsAuthenticated(false);
  };

  const value = {
    user,
    isAuthenticated,
    loading,
    login,
    register,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}; 