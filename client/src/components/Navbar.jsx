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