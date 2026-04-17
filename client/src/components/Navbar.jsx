<<<<<<< HEAD
import React from 'react';
import { Link } from 'react-router-dom';
import { Building2 } from 'lucide-react';

const Navbar = () => {
    return (
        <header className="app-header">
            <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '1rem', textDecoration: 'none', color: 'white' }}>
=======
import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { Building2, LayoutDashboard } from 'lucide-react';

const Navbar = () => {
    const { user } = useContext(AuthContext);

    return (
        <header className="app-header">
            <Link to="/dashboard" style={{ display: 'flex', alignItems: 'center', gap: '1rem', textDecoration: 'none', color: 'white' }}>
>>>>>>> c327aea (Add facilities module)
                <div style={{ backgroundColor: 'white', borderRadius: '4px', padding: '4px' }}>
                    <Building2 size={24} color="var(--primary)" />
                </div>
                <h1 style={{ fontSize: '1.25rem', margin: 0, fontWeight: '700' }}>Smart Campus Hub</h1>
            </Link>

            <nav className="flex items-center gap-8" style={{ marginLeft: '2rem' }}>
<<<<<<< HEAD
                <Link to="/" className="nav-link-custom">Home</Link>
            </nav>
=======
                <Link to="/dashboard" className="nav-link-custom">
                    Directory <LayoutDashboard size={18} />
                </Link>
            </nav>

            <div className="flex items-center gap-4 relative" style={{ marginLeft: 'auto' }}>
                <div style={{ borderLeft: '1px solid rgba(255,255,255,0.2)', height: '24px', margin: '0 8px' }}></div>

                {user ? (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', marginLeft: '0.5rem' }}>
                        <span style={{ color: 'white', fontSize: '0.9rem', fontWeight: '500' }}>{user.name}</span>
                        <button onClick={() => {
                            localStorage.removeItem('token');
                            localStorage.removeItem('user');
                            window.location.href = '/login';
                        }} style={{ 
                            backgroundColor: 'transparent', color: 'white', border: '1px solid rgba(255,255,255,0.5)', 
                            padding: '6px 12px', borderRadius: '6px', cursor: 'pointer', fontSize: '0.85rem'
                        }}>
                            Logout
                        </button>
                    </div>
                ) : (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', marginLeft: '0.5rem' }}>
                        <Link to="/login" style={{ color: 'rgba(255,255,255,0.9)', textDecoration: 'none', fontSize: '0.95rem', fontWeight: '500', transition: 'color 0.3s ease' }}
                            onMouseEnter={(e) => e.currentTarget.style.color = '#fff'}
                            onMouseLeave={(e) => e.currentTarget.style.color = 'rgba(255,255,255,0.9)'}
                        >Sign In</Link>
                    </div>
                )}
            </div>
>>>>>>> c327aea (Add facilities module)
        </header>
    );
};

export default Navbar;
<<<<<<< HEAD

=======
>>>>>>> c327aea (Add facilities module)
