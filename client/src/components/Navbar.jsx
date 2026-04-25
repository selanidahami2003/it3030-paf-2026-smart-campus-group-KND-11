<<<<<<< Updated upstream
import React, { useContext, useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import {
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
=======
import React, { useContext, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { Building2, Calendar, ClipboardList, Bell, Check, LayoutDashboard, Search, Wrench } from 'lucide-react';
import api from '../services/api';

const Navbar = () => {
    const { user } = useContext(AuthContext);
    const [notifications, setNotifications] = useState([]);
    const [showNotifications, setShowNotifications] = useState(false);

    const fetchNotifications = async () => {
        if (!user) return;
        try {
            const res = await api.get('/notifications/unread');
            setNotifications(res.data);
        } catch (err) {
            console.error(err);
>>>>>>> Stashed changes
        }
    };

    useEffect(() => {
<<<<<<< Updated upstream
        fetchUnreadCount();
        const interval = setInterval(fetchUnreadCount, 30000);
        return () => clearInterval(interval);
    }, [user]);

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
            backgroundColor: '#115e59', // Green theme
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
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
                    to="/home"
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        textDecoration: 'none',
                        color: 'white'
                    }}
                >
                    <div style={{ backgroundColor: 'white', borderRadius: '4px', padding: '2px', display: 'flex' }}>
                        <img src="/logo.png" alt="Logo" style={{ width: '24px', height: '24px', objectFit: 'contain' }} 
                             onError={(e) => { e.target.style.display='none'; e.target.nextSibling.style.display='flex'; }} />
                        <div style={{ display: 'none', width: '24px', height: '24px', color: '#115e59', alignItems: 'center', justifyContent: 'center' }}>
                            <LayoutDashboard size={18} />
                        </div>
                    </div>
                    <span style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>Smart Campus Hub</span>
                </Link>

                {/* Nav links */}
                <nav style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '1.5rem',
                    marginLeft: '2.5rem'
                }}>
                    <Link to="/home" className={`nav-link-custom ${isActive('/home') ? 'active' : ''}`} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        Home
                    </Link>
                    <Link to="/dashboard" className={`nav-link-custom ${isActive('/dashboard') ? 'active' : ''}`} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        Facilities <LayoutDashboard size={16} />
                    </Link>

                    {user?.role === 'USER' && (
                        <>
                            <Link to="/bookings/my" className={`nav-link-custom ${isActive('/bookings/my') ? 'active' : ''}`} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                My Bookings <Calendar size={16} />
                            </Link>
                            <Link to="/reporting" className={`nav-link-custom ${isActive('/reporting') ? 'active' : ''}`} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                Reporting <ClipboardList size={16} />
                            </Link>
                        </>
                    )}

                    {(user?.role === 'ADMIN' || user?.role === 'STAFF' || user?.role === 'TECHNICIAN') && (
                        <>
                            <Link to="/bookings" className={`nav-link-custom ${isActive('/bookings') ? 'active' : ''}`} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                Booking Admin <Calendar size={16} />
                            </Link>
                            <Link to="/tickets" className={`nav-link-custom ${isActive('/tickets') ? 'active' : ''}`} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                Jobs &amp; Tickets <Wrench size={16} />
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
=======
        fetchNotifications();
        const interval = setInterval(fetchNotifications, 30000); // Poll every 30s
        return () => clearInterval(interval);
    }, [user]);

    const markAsRead = async (id) => {
        try {
            await api.put(`/notifications/${id}/read`);
            setNotifications(prev => prev.filter(n => n.id !== id));
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <header className="app-header">
            <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '1rem', textDecoration: 'none', color: 'white' }}>
                <div style={{ backgroundColor: 'white', borderRadius: '4px', padding: '4px' }}>
                    <Building2 size={24} color="var(--primary)" />
                </div>
                <h1 style={{ fontSize: '1.25rem', margin: 0, fontWeight: '700' }}>Smart Campus Hub</h1>
            </Link>

            <nav className="flex items-center gap-8" style={{ marginLeft: '2rem' }}>
                <Link to="/" className="nav-link-custom">Home</Link>
                <Link to="/dashboard" className="nav-link-custom">
                    Facilities <LayoutDashboard size={18} />
                </Link>
                
                {/* Student / User Specific */}
                {user?.role === 'USER' && (
                    <Link to="/bookings/my" className="nav-link-custom">
                        My Bookings <Calendar size={18} />
                    </Link>
                )}

                {/* Staff / Admin Specific */}
                {(user?.role === 'ADMIN' || user?.role === 'STAFF') && (
                    <Link to="/bookings" className="nav-link-custom">
                        Booking Admin <ClipboardList size={18} />
                    </Link>
                )}

                {/* Technician Specific */}
                {(user?.role === 'TECHNICIAN' || user?.role === 'ADMIN') && (
                    <Link to="/tickets" className="nav-link-custom">
                        Jobs & Tickets <Wrench size={18} />
                    </Link>
                )}
                
                {/* General Service Desk for others to report */}
                {user?.role === 'USER' && (
                    <Link to="/tickets" className="nav-link-custom">
                        Reporting <ClipboardList size={18} />
                    </Link>
                )}

                {/* Notifications Dashboard */}
                {user && (
                    <Link to="/notifications" className="nav-link-custom">
                        Notifications <Bell size={18} />
                    </Link>
                )}
            </nav>

            <div className="flex items-center gap-4 relative" style={{ marginLeft: 'auto' }}>
                <div style={{ position: 'relative', cursor: 'pointer' }} onClick={() => setShowNotifications(!showNotifications)}>
                    <Bell size={20} color="rgba(255,255,255,0.8)" />
                    {notifications.length > 0 && (
                        <span style={{
                            position: 'absolute', top: '-6px', right: '-6px', background: 'var(--secondary)',
                            borderRadius: '50%', minWidth: '18px', height: '18px', display: 'flex',
                            alignItems: 'center', justifyContent: 'center', fontSize: '11px', color: 'white', fontWeight: 'bold'
                        }}>
                            {notifications.length > 9 ? '9+' : notifications.length}
                        </span>
                    )}
                </div>

                {showNotifications && (
                    <div className="p-card" style={{
                        position: 'absolute', top: '100%', right: '0px', width: '320px',
                        padding: '1rem', zIndex: 100, marginTop: '1rem',
                        boxShadow: 'var(--shadow-lg)', color: 'var(--text-primary)'
                    }}>
                        <div className="flex justify-between items-center mb-2" style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem' }}>
                            <h4 style={{ margin: 0 }}>Notifications</h4>
                            <span style={{ fontSize: '0.75rem', color: 'var(--primary)', cursor: 'pointer' }} onClick={() => setShowNotifications(false)}>Close</span>
                        </div>
                        <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
                            {notifications.length === 0 ? (
                                <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', textAlign: 'center', margin: '1.5rem 0' }}>All caught up!</p>
                            ) : notifications.map(n => (
                                <div key={n.id} style={{ padding: '0.75rem 0', borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '0.5rem' }}>
                                    <div style={{ flex: 1 }}>
                                        <p style={{ fontSize: '0.875rem', margin: '0 0 0.25rem 0' }}>{n.message}</p>
                                        <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{new Date(n.createdAt).toLocaleString()}</span>
                                    </div>
                                    <button onClick={() => markAsRead(n.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--primary)', padding: '0.25rem' }} title="Mark as read">
                                        <Check size={18} />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

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
                        <Link to="/signup" style={{ 
                            backgroundColor: 'var(--secondary)', 
                            color: 'white', 
                            padding: '9px 22px', 
                            borderRadius: '50px', 
                            textDecoration: 'none', 
                            fontSize: '0.95rem', 
                            fontWeight: '600',
                            border: '2px solid var(--secondary)',
                            transition: 'all 0.3s ease',
                            boxShadow: '0 2px 10px rgba(34, 197, 94, 0.3)'
                        }}
                            onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = 'var(--secondary-hover)'; e.currentTarget.style.transform = 'translateY(-1px)'; }}
                            onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'var(--secondary)'; e.currentTarget.style.transform = 'translateY(0)'; }}
                        >Sign Up</Link>
                    </div>
                )}
            </div>
>>>>>>> Stashed changes
        </header>
    );
};

export default Navbar;
