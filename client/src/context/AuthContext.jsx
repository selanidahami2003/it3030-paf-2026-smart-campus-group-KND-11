import React, { createContext, useState, useContext, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    const token = localStorage.getItem('token');
    if (storedUser && token) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    const response = await api.post('/auth/login', { email, password });
    const { accessToken, ...userData } = response.data;
    localStorage.setItem('token', accessToken);
    localStorage.setItem('user', JSON.stringify(userData));
    setUser(userData);
    return userData;
  };

  const loginWithToken = async (token) => {
    localStorage.setItem('token', token);
    const response = await api.get('/auth/me');
    const { accessToken, ...userData } = response.data;
    localStorage.setItem('user', JSON.stringify(userData));
    setUser(userData);
    return userData;
  };

  const signup = async (name, email, password) => {
    await api.post('/auth/signup', { name, email, password });
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  const hasRole = (role) => {
    return user && user.roles && user.roles.includes(role);
  };

  const isAdmin = () => hasRole('ROLE_ADMIN');
  const isTechnician = () => hasRole('ROLE_TECHNICIAN');

  return (
    <AuthContext.Provider value={{ user, loading, login, loginWithToken, signup, logout, isAdmin, isTechnician, hasRole }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
