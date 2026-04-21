import React, { useContext } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, AuthContext } from './context/AuthContext';

import Navbar from './components/Navbar';
import Dashboard from './components/Dashboard';
import Login from './components/Login';
import Tickets from './components/Tickets';
import UserIdentityForm from './components/UserIdentityForm';
import MyBookings from './components/MyBookings';
import CreateBooking from './components/CreateBooking';

import './index.css';

function AppRoutes() {
  const { user, loading } = useContext(AuthContext);

  if (loading) {
    return (
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '100vh',
          fontSize: '1rem',
          color: 'var(--text-secondary)',
        }}
      >
        Loading...
      </div>
    );
  }

  return (
    <BrowserRouter>
      {user && <Navbar />}
      <Routes>
        {/* Unauthenticated routes */}
        {!user && (
          <>
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<UserIdentityForm />} />
            <Route path="*" element={<Navigate to="/login" replace />} />
          </>
        )}

        {/* Authenticated routes */}
        {user && (
          <>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/tickets" element={<Tickets />} />
            <Route path="/bookings" element={<MyBookings />} />
            <Route path="/bookings/new" element={<CreateBooking />} />
            {/* Notifications page placeholder or panel trigger logic */}
            <Route path="/notifications" element={<Navigate to="/dashboard" replace />} />
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </>
        )}
      </Routes>
    </BrowserRouter>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  );
}

export default App;