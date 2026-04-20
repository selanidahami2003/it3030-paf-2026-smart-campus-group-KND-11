
import React, { useContext } from 'react';

import { Link, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import {
  Building2,
  ClipboardList,
  Wrench,
  LayoutDashboard,
  LogOut,
  User as UserIcon,
} from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const location = useLocation();

  const getInitials = (name) => {
    if (!name) return 'U';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);
  };

  const isActive = (path) => location.pathname === path;

  return (
    <header className="app-header">
      <div className="nav-container">
        <Link
          to="/dashboard"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            textDecoration: 'none',
            color: 'var(--text-primary)',
          }}
        >
          <div
            style={{
              backgroundColor: 'var(--primary)',
              borderRadius: 'var(--radius-md)',
              padding: '6px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: 'var(--shadow-sm)',
            }}
          >
            <Building2 size={20} color="white" />
          </div>
          <h1 style={{ fontSize: '1.1rem', margin: 0, fontWeight: '800', letterSpacing: '-0.02em', color: 'var(--primary)' }}>
            SmartCampus
          </h1>
        </Link>

        <nav className="flex items-center gap-2" style={{ marginLeft: '3rem' }}>
          <Link to="/dashboard" className={`nav-link-custom ${isActive('/dashboard') ? 'active' : ''}`}>
            <LayoutDashboard size={18} />
            <span>Directory</span>
          </Link>

          {(user?.role === 'ADMIN' ||
            user?.role === 'TECHNICIAN' ||
            user?.role === 'STAFF') && (
            <Link to="/tickets" className={`nav-link-custom ${isActive('/tickets') ? 'active' : ''}`}>
              <Wrench size={18} />
              <span>Service Desk</span>
            </Link>
          )}


import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { Building2, Calendar, ClipboardList } from 'lucide-react';

const Navbar = () => {
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/login');
        window.location.reload();
    };

    return (
        <header className="app-header">
            {/* Brand — clicking goes to appropriate page */}
            <Link
                to={user ? (user.role === 'ADMIN' || user.role === 'STAFF' ? '/bookings' : '/bookings/my') : '/login'}
                style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', textDecoration: 'none', color: 'white' }}
            >
                <div style={{ backgroundColor: 'white', borderRadius: '6px', padding: '5px' }}>
                    <Building2 size={22} color="var(--primary)" />
                </div>
                <h1 style={{ fontSize: '1.2rem', margin: 0, fontWeight: '700' }}>Smart Campus Booking</h1>
            </Link>

            {/* Nav links — only show when logged in */}
            <nav className="flex items-center gap-8" style={{ marginLeft: '2rem' }}>
                {/* USER: My Bookings */}
                {user?.role === 'USER' && (
                    <Link to="/bookings/my" className="nav-link-custom" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <Calendar size={17} /> My Bookings
                    </Link>
                )}

                {/* ADMIN / STAFF: Manage Bookings */}
                {(user?.role === 'ADMIN' || user?.role === 'STAFF') && (
                    <Link to="/bookings" className="nav-link-custom" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <ClipboardList size={17} /> Manage Bookings
                    </Link>
                )}
            </nav>

            {/* Auth */}
            <div className="flex items-center gap-4" style={{ marginLeft: 'auto' }}>
                {user ? (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                        <span style={{ color: 'white', fontSize: '0.9rem', fontWeight: '500' }}>{user.name}</span>
                        <button
                            onClick={handleLogout}
                            style={{
                                backgroundColor: 'transparent', color: 'white',
                                border: '1px solid rgba(255,255,255,0.5)',
                                padding: '6px 14px', borderRadius: '6px',
                                cursor: 'pointer', fontSize: '0.85rem'
                            }}
                        >
                            Logout
                        </button>
                    </div>
                ) : (
                    <Link to="/login" style={{ color: 'rgba(255,255,255,0.9)', textDecoration: 'none', fontSize: '0.95rem', fontWeight: '500' }}>
                        Sign In
                    </Link>
                )}
            </div>

        </header>
    );
};

export default Navbar;
 Updated upstream


          {user?.role === 'USER' && (
            <Link to="/tickets" className={`nav-link-custom ${isActive('/tickets') ? 'active' : ''}`}>
              <ClipboardList size={18} />
              <span>My Tickets</span>
            </Link>
          )}
        </nav>

        <div
          className="flex items-center gap-4"
          style={{ marginLeft: 'auto' }}
        >
          {user && (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '1rem',
              }}
            >
                <div style={{ textAlign: 'right' }} className="nav-user-info">
                    <div style={{ fontSize: '0.85rem', fontWeight: '600', color: 'var(--text-primary)', lineHeight: '1' }}>{user.name}</div>
                    <div style={{ fontSize: '0.7rem', color: 'var(--text-tertiary)', textTransform: 'capitalize' }}>{user.role?.toLowerCase()}</div>
                </div>
                
                <div className="avatar" title={user.name}>
                    {getInitials(user.name)}
                </div>

                <button
                    onClick={logout}
                    className="p-btn"
                    style={{
                    backgroundColor: 'transparent',
                    color: 'var(--text-secondary)',
                    padding: '8px',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--border-color)',
                    }}
                    title="Logout"
                >
                    <LogOut size={18} />
                </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
main
