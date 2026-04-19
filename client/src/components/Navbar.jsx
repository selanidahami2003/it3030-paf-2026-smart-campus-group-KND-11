import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Building2, User, LogOut, Bell, LayoutDashboard, Shield } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
    const { user, isAdmin, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    return (
        <header className="app-header" style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center', 
            padding: '1rem 2rem', 
            backgroundColor: 'var(--primary, #2d3748)', 
            color: 'white' 
        }}>
            <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '1rem', textDecoration: 'none', color: 'white' }}>
                <div style={{ backgroundColor: 'white', borderRadius: '4px', padding: '4px' }}>
                    <Building2 size={24} color="#2d3748" />
                </div>
                <h1 style={{ fontSize: '1.25rem', margin: 0, fontWeight: '700' }}>Smart Campus Hub</h1>
            </Link>

            <nav style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                <Link to="/" style={{ color: 'white', textDecoration: 'none', fontWeight: '500' }}>Home</Link>
                
                {user ? (
                    <>
                        <Link to="/dashboard" style={{ color: 'white', textDecoration: 'none', fontWeight: '500', display: 'flex', alignItems: 'center', gap: '5px' }}>
                            <LayoutDashboard size={18} />
                            Dashboard
                        </Link>
                        <Link to="/notifications" style={{ color: 'white', textDecoration: 'none', fontWeight: '500', display: 'flex', alignItems: 'center', gap: '5px' }}>
                            <Bell size={18} />
                            Notifications
                        </Link>
                        {isAdmin() && (
                            <Link to="/admin/users" style={{ color: 'white', textDecoration: 'none', fontWeight: '500', display: 'flex', alignItems: 'center', gap: '5px' }}>
                                <Shield size={18} />
                                Admin
                            </Link>
                        )}
                        <button 
                            onClick={handleLogout}
                            style={{ 
                                background: 'rgba(255,255,255,0.1)', 
                                border: '1px solid rgba(255,255,255,0.2)', 
                                color: 'white', 
                                padding: '6px 15px', 
                                borderRadius: '6px', 
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '5px',
                                fontWeight: '500'
                            }}
                        >
                            <LogOut size={16} />
                            Logout
                        </button>
                    </>
                ) : (
                    <>
                        <Link to="/login" style={{ color: 'white', textDecoration: 'none', fontWeight: '500' }}>Login</Link>
                        <Link to="/signup" style={{ 
                            backgroundColor: 'white', 
                            color: '#2d3748', 
                            padding: '6px 15px', 
                            borderRadius: '6px', 
                            textDecoration: 'none', 
                            fontWeight: '600'
                        }}>Signup</Link>
                    </>
                )}
            </nav>
        </header>
    );
};

export default Navbar;

