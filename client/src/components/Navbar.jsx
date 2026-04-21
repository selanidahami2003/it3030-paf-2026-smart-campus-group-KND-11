import React, { useContext, useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import {
  Building2,
  ClipboardList,
  Wrench,
  LayoutDashboard,
  LogOut,
  User as UserIcon,
  Calendar,
  Bell
} from 'lucide-react';
import api from '../services/api';

const Navbar = () => {
    const { user, logout } = useContext(AuthContext);
    const location = useLocation();
    const navigate = useNavigate();
    const [unreadCount, setUnreadCount] = useState(0);
    const [showNotifications, setShowNotifications] = useState(false);
    const notificationRef = useRef(null);

    const fetchUnreadCount = async () => {
        if (!user) return;
        try {
            const res = await api.get('/notifications/unread-count');
            setUnreadCount(res.data.count);
        } catch (err) {
            console.error('Failed to fetch unread count', err);
        }
    };

    useEffect(() => {
        fetchUnreadCount();
        const interval = setInterval(fetchUnreadCount, 30000); // Poll every 30s
        return () => clearInterval(interval);
    }, [user]);

    // Close notifications when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (notificationRef.current && !notificationRef.current.contains(event.target)) {
                setShowNotifications(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const isActive = (path) => location.pathname === path;

    return (
        <header className="app-header" style={{
            position: 'sticky',
            top: 0,
            zIndex: 100,
            backdropFilter: 'blur(10px)',
            background: 'rgba(18, 50, 73, 0.95)', // Midnight blue glass effect
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.2)'
        }}>
            <div className="nav-container" style={{
                maxWidth: '1400px',
                margin: '0 auto',
                padding: '0 1.5rem',
                height: '70px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
            }}>
                {/* Brand */}
                <Link
                    to="/dashboard"
                    style={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: '0.75rem', 
                        textDecoration: 'none', 
                        color: 'white' 
                    }}
                >
                    <div style={{ backgroundColor: 'white', borderRadius: '10px', padding: '4px', display: 'flex', width: '40px', height: '40px', overflow: 'hidden' }}>
                        <img src="/logo.png" alt="Smart Campus Hub Logo" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <span style={{ fontSize: '1.2rem', fontWeight: '800', letterSpacing: '-0.02em', lineHeight: 1 }}>SMART CAMPUS</span>
                        <span style={{ fontSize: '0.7rem', fontWeight: '600', opacity: 0.8, letterSpacing: '0.1em' }}>HUB PLATFORM</span>
                    </div>
                </Link>

                {/* Nav links */}
                <nav style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '1.5rem',
                    marginLeft: '2.5rem'
                }}>
                    <Link to="/dashboard" className={`nav-link-custom ${isActive('/dashboard') ? 'active' : ''}`} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <LayoutDashboard size={18} /> Dashboard
                    </Link>

                    {user?.role === 'USER' && (
                        <>
                            <Link to="/bookings/my" className={`nav-link-custom ${isActive('/bookings/my') ? 'active' : ''}`} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <Calendar size={18} /> My Bookings
                            </Link>
                            <Link to="/tickets" className={`nav-link-custom ${isActive('/tickets') ? 'active' : ''}`} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <ClipboardList size={18} /> My Tickets
                            </Link>
                        </>
                    )}

                    {(user?.role === 'ADMIN' || user?.role === 'STAFF' || user?.role === 'TECHNICIAN') && (
                        <>
                            <Link to="/bookings" className={`nav-link-custom ${isActive('/bookings') ? 'active' : ''}`} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <Calendar size={18} /> Manage Bookings
                            </Link>
                            <Link to="/tickets" className={`nav-link-custom ${isActive('/tickets') ? 'active' : ''}`} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <Wrench size={18} /> Jobs & Tickets
                            </Link>
                        </>
                    )}
                </nav>

                {/* Right actions */}
                <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    {user ? (
                        <>
                            {/* Notification Bell */}
                            <div style={{ position: 'relative' }} ref={notificationRef}>
                                <button 
                                    onClick={() => setShowNotifications(!showNotifications)}
                                    style={{
                                        background: 'rgba(255, 255, 255, 0.1)',
                                        border: 'none',
                                        borderRadius: '50%',
                                        width: '40px',
                                        height: '40px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        cursor: 'pointer',
                                        color: 'white',
                                        transition: 'all 0.2s'
                                    }}
                                    onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)'}
                                    onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)'}
                                >
                                    <Bell size={20} />
                                    {unreadCount > 0 && (
                                        <span style={{
                                            position: 'absolute',
                                            top: '8px',
                                            right: '8px',
                                            backgroundColor: '#ef4444',
                                            color: 'white',
                                            fontSize: '0.65rem',
                                            fontWeight: '700',
                                            borderRadius: '50%',
                                            minWidth: '16px',
                                            height: '16px',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            padding: '0 4px',
                                            border: '2px solid var(--primary)'
                                        }}>
                                            {unreadCount > 9 ? '9+' : unreadCount}
                                        </span>
                                    )}
                                </button>
                                {showNotifications && (
                                    <div style={{ position: 'absolute', top: '100%', right: 0, marginTop: '0.5rem', background: 'white', color: 'black', padding: '1rem', borderRadius: '8px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)', zIndex: 50, whiteSpace: 'nowrap' }}>
                                        Notifications coming soon...
                                    </div>
                                )}
                            </div>

                            <div style={{ 
                                display: 'flex', 
                                alignItems: 'center', 
                                gap: '1rem',
                                background: 'rgba(0, 0, 0, 0.1)',
                                padding: '4px 4px 4px 12px',
                                borderRadius: '30px',
                                border: '1px solid rgba(255, 255, 255, 0.1)'
                            }}>
                                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                                    <span style={{ color: 'white', fontSize: '0.85rem', fontWeight: '700' }}>{user.name}</span>
                                    <span style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '0.65rem', fontWeight: '600' }}>{user.role}</span>
                                </div>
                                <div style={{ 
                                    width: '32px', 
                                    height: '32px', 
                                    borderRadius: '50%', 
                                    backgroundColor: 'white', 
                                    display: 'flex', 
                                    alignItems: 'center', 
                                    justifyContent: 'center',
                                    color: 'var(--primary)'
                                }}>
                                    <UserIcon size={18} />
                                </div>
                                <button
                                    onClick={handleLogout}
                                    style={{
                                        backgroundColor: 'transparent', 
                                        color: 'white',
                                        border: 'none',
                                        padding: '8px', 
                                        borderRadius: '50%',
                                        cursor: 'pointer',
                                        display: 'flex',
                                        opacity: 0.8,
                                        transition: 'opacity 0.2s'
                                    }}
                                    onMouseEnter={(e) => e.currentTarget.style.opacity = 1}
                                    onMouseLeave={(e) => e.currentTarget.style.opacity = 0.8}
                                    title="Logout"
                                >
                                    <LogOut size={18} />
                                </button>
                            </div>
                        </>
                    ) : (
                        <Link to="/login" style={{ 
                            color: 'white', 
                            textDecoration: 'none', 
                            fontSize: '0.95rem', 
                            fontWeight: '600',
                            padding: '8px 20px',
                            borderRadius: '8px',
                            border: '1px solid rgba(255, 255, 255, 0.3)',
                            transition: 'all 0.2s'
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)'}
                        onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                        >
                            Sign In
                        </Link>
                    )}
                </div>
            </div>
            <style>{`
                .nav-link-custom {
                    color: rgba(255, 255, 255, 0.8);
                    text-decoration: none;
                    font-size: 0.9rem;
                    font-weight: 600;
                    padding: 0.5rem 0;
                    position: relative;
                    transition: color 0.2s;
                }
                .nav-link-custom:hover {
                    color: white;
                }
                .nav-link-custom.active {
                    color: white;
                }
                .nav-link-custom.active::after {
                    content: '';
                    position: absolute;
                    bottom: -4px;
                    left: 0;
                    width: 100%;
                    height: 2px;
                    background-color: white;
                    border-radius: 2px;
                }
            `}</style>
        </header>
    );
};

export default Navbar;
