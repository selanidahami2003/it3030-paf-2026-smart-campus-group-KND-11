import React, { createContext, useState, useEffect } from 'react';
import api from '../services/api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  // null = no identified/logged user yet
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    const token = localStorage.getItem('token');

    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);

        // restore session if either:
        // 1) full auth token exists
        // 2) identity-form student user exists
        if (token || parsedUser?.studentId) {
          setUser(parsedUser);
        }
      } catch (error) {
        console.error('Failed to parse stored user', error);
        localStorage.removeItem('user');
      }
    }

    setLoading(false);
  }, []);

  // Called when user fills the identity form
  const identify = (name, studentId) => {
    const isSystemAdmin = studentId.startsWith('ADMIN');
    const newUser = {
      id: isSystemAdmin ? '1' : '2',
      name,
      studentId,
      email: isSystemAdmin ? 'admin@smartcampus.edu' : 'user@smartcampus.edu',
      role: isSystemAdmin ? 'ADMIN' : 'USER',
    };

    localStorage.setItem('user', JSON.stringify(newUser));
    setUser(newUser);
  };

  const login = async (email, password) => {
    try {
      const res = await api.post('/auth/login', { email, password });
      const { accessToken, user: userData } = res.data;

      localStorage.setItem('token', accessToken);
      localStorage.setItem('user', JSON.stringify(userData));
      setUser(userData);

      return true;
    } catch (error) {
      console.error('Login failed', error);
      throw error;
    }
  };

  const googleLogin = async (credential) => {
    // Mock Google login for assignment/demo flow
    const mockUser = {
      id: `g-${Math.random().toString(36).substr(2, 9)}`,
      name: 'Google Student',
      email: 'student@smartcampus.edu',
      role: 'USER',
    };

    localStorage.setItem('token', credential || 'mock-google-token');
    localStorage.setItem('user', JSON.stringify(mockUser));
    setUser(mockUser);

    return true;
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        identify,
        login,
        googleLogin,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};