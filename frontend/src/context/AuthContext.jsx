import { createContext, useState, useEffect } from 'react';
import axios from 'axios';
import { API_URL } from '../config';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in on mount
    const userInfo = sessionStorage.getItem('userInfo');
    if (userInfo) {
      setUser(JSON.parse(userInfo));
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      const config = { headers: { 'Content-Type': 'application/json' } };
      // Note: Assuming proxy is setup in vite.config.js or we use full URL
      const { data } = await axios.post(`${API_URL}/api/auth/login`, { email, password }, config);
      setUser(data);
      sessionStorage.setItem('userInfo', JSON.stringify(data));
      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
      };
    }
  };

  const register = async (name, email, phone, password) => {
    try {
      const config = { headers: { 'Content-Type': 'application/json' } };
      const { data } = await axios.post(`${API_URL}/api/auth/register`, { name, email, phone, password }, config);
      setUser(data);
      sessionStorage.setItem('userInfo', JSON.stringify(data));
      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
      };
    }
  };

  const updateProfile = async (userData) => {
    try {
      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.put(`${API_URL}/api/auth/profile`, userData, config);
      setUser(data);
      sessionStorage.setItem('userInfo', JSON.stringify(data));
      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
      };
    }
  };

  const logout = () => {
    sessionStorage.removeItem('userInfo');
    sessionStorage.removeItem('adminActiveTab');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, updateProfile }}>
      {children}
    </AuthContext.Provider>
  );
};
