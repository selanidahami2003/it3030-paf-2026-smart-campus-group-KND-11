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
      <Link
        to={user ? (user.role === 'ADMIN' || user.role === 'STAFF' ? '/bookings' : '/bookings/my') : '/login'}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem',
          textDecoration: 'none',
          color: 'white'
        }}
      >
        <div style={{ backgroundColor: 'white', borderRadius: '6px', padding: '5px' }}>
          <Building2 size={22} color="var(--primary)" />
        </div>
        <h1 style={{ fontSize: '1.2rem', margin: 0, fontWeight: '700' }}>
          Smart Campus Booking
        </h1>
      </Link>

      <nav className="flex items-center gap-8" style={{ marginLeft: '2rem' }}>
        {user?.role === 'USER' && (
          <Link to="/bookings/my" className="nav-link-custom">
            <Calendar size={17} /> My Bookings
          </Link>
        )}

        {(user?.role === 'ADMIN' || user?.role === 'STAFF') && (
          <Link to="/bookings" className="nav-link-custom">
            <ClipboardList size={17} /> Manage Bookings
          </Link>
        )}
      </nav>

      <div className="flex items-center gap-4" style={{ marginLeft: 'auto' }}>
        {user ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
            <span style={{ color: 'white' }}>{user.name}</span>
            <button onClick={handleLogout}>Logout</button>
          </div>
        ) : (
          <Link to="/login">Sign In</Link>
        )}
      </div>
    </header>
  );
};

export default Navbar;