
import React, { useContext } from 'react';

import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import {
  Building2,
  ClipboardList,
  Wrench,
  LayoutDashboard,
} from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);

  return (
    <header className="app-header">
      <div className="nav-container">
        <Link
          to="/dashboard"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '1rem',
            textDecoration: 'none',
            color: 'white',
          }}
        >
          <div
            style={{
              backgroundColor: 'white',
              borderRadius: '4px',
              padding: '4px',
            }}
          >
            <Building2 size={24} color="var(--primary)" />
          </div>
          <h1 style={{ fontSize: '1.25rem', margin: 0, fontWeight: '700' }}>
            Smart Campus Hub
          </h1>
        </Link>

        <nav className="flex items-center gap-8" style={{ marginLeft: '2rem' }}>
          <Link to="/dashboard" className="nav-link-custom">
            Directory <LayoutDashboard size={18} />
          </Link>

          {(user?.role === 'ADMIN' ||
            user?.role === 'TECHNICIAN' ||
            user?.role === 'STAFF') && (
            <Link to="/tickets" className="nav-link-custom">
              Jobs & Tickets <Wrench size={18} />
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
            <Link to="/tickets" className="nav-link-custom">
              My Tickets <ClipboardList size={18} />
            </Link>
          )}
        </nav>

        <div
          className="flex items-center gap-4 relative"
          style={{ marginLeft: 'auto' }}
        >
          <div
            style={{
              borderLeft: '1px solid rgba(255,255,255,0.2)',
              height: '24px',
              margin: '0 8px',
            }}
          ></div>

          {user ? (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '1.5rem',
                marginLeft: '0.5rem',
              }}
            >
              <span
                style={{
                  color: 'white',
                  fontSize: '0.9rem',
                  fontWeight: '500',
                }}
              >
                {user.name}
              </span>
              <button
                onClick={logout}
                style={{
                  backgroundColor: 'transparent',
                  color: 'white',
                  border: '1px solid rgba(255,255,255,0.5)',
                  padding: '6px 12px',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontSize: '0.85rem',
                }}
              >
                Logout
              </button>
            </div>
          ) : (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '1.5rem',
                marginLeft: '0.5rem',
              }}
            >
              <Link
                to="/login"
                style={{
                  color: 'rgba(255,255,255,0.9)',
                  textDecoration: 'none',
                  fontSize: '0.95rem',
                  fontWeight: '500',
                }}
              >
                Sign In
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
main
