import React, { useContext } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, AuthContext } from './context/AuthContext';
import Navbar from './components/Navbar';
import Tickets from './components/Tickets';
import UserIdentityForm from './components/UserIdentityForm';
import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import Dashboard from './components/Dashboard';
import Login from './components/Login';
import './index.css';

function AppRoutes() {
    const { user, loading, identify } = useContext(AuthContext);

    if (loading) {
        return (
            <div style={{
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                minHeight: '100vh', fontSize: '1rem', color: 'var(--text-secondary)'
            }}>
                Loading...
            </div>
        );
    }

    // Show identity form if user hasn't identified themselves yet
    if (!user) {
        return (
            <UserIdentityForm
                onIdentified={({ name, studentId }) => identify(name, studentId)}
            />
        );
    }

    return (
        <div className="app-container">
            <Navbar />
            <main className="app-main">
                <Routes>
                    <Route path="/tickets" element={<Tickets />} />
                    <Route path="/" element={<Navigate to="/tickets" replace />} />
                    <Route path="*" element={<Navigate to="/tickets" replace />} />
                </Routes>
            </main>
        </div>
    );
}

function App() {
    return (
        <AuthProvider>
            <BrowserRouter>
                <AppRoutes />
            </BrowserRouter>
        </AuthProvider>
    );
}

export default App;
  return (
    <AuthProvider>
      <BrowserRouter>
        <div className="app-container">
          <Navbar />
          <main className="app-main">
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/" element={<Navigate to="/dashboard" />} />
              <Route path="*" element={<Navigate to="/dashboard" />} />
            </Routes>
          </main>
        </div>
      </BrowserRouter>
    </AuthProvider>
  );


export default App;
