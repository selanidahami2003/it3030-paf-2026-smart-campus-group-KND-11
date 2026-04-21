import React, { useState, useEffect } from 'react';
import { Bell, Check, Trash2, ExternalLink } from 'lucide-react';
import api from '../services/api';
import { useNavigate } from 'react-router-dom';

const NotificationPanel = ({ onClose }) => {
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    const [filter, setFilter] = useState('all');

    const fetchNotifications = async () => {
        try {
            const res = await api.get('/notifications');
            setNotifications(res.data);
        } catch (err) {
            console.error('Failed to fetch notifications', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchNotifications();
    }, []);

    const markAsRead = async (id) => {
        try {
            await api.put(`/notifications/${id}/read`);
            setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
        } catch (err) {
            console.error('Failed to mark as read', err);
        }
    };

    const markAllAsRead = async () => {
        try {
            await api.put('/notifications/read-all');
            setNotifications(prev => prev.map(n => ({ ...n, read: true })));
        } catch (err) {
            console.error('Failed to mark all as read', err);
        }
    };

    const handleNotificationClick = (n) => {
        markAsRead(n.id);
        if (n.type === 'BOOKING_STATUS') {
            navigate('/bookings/my');
        } else if (n.type === 'TICKET_STATUS' || n.type === 'NEW_COMMENT') {
            navigate('/tickets');
        }
        onClose();
    };

    const displayedNotifications = filter === 'unread' ? notifications.filter(n => !n.read) : notifications;

    return (
        <div className="notification-panel p-card" style={{
            position: 'absolute',
            top: '100%',
            right: 0,
            width: '380px',
            maxHeight: '500px',
            marginTop: '10px',
            zIndex: 1000,
            display: 'flex',
            flexDirection: 'column',
            boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)',
            padding: 0,
            overflow: 'hidden'
        }}>
            <div style={{
                padding: '1rem',
                borderBottom: '1px solid var(--border-color)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                backgroundColor: 'var(--surface-color-light)'
            }}>
                <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: '700' }}>Notifications</h3>
                <button 
                    onClick={markAllAsRead}
                    style={{ 
                        fontSize: '0.75rem', 
                        color: 'var(--primary)', 
                        background: 'none', 
                        border: 'none', 
                        cursor: 'pointer',
                        fontWeight: '600'
                    }}
                >
                    Mark all as read
                </button>
            </div>

            {/* Filter Tabs */}
            <div style={{
                display: 'flex',
                padding: '0 1rem',
                borderBottom: '1px solid var(--border-color)',
                backgroundColor: 'var(--surface-color-light)',
                gap: '1rem'
            }}>
                <button
                    onClick={() => setFilter('all')}
                    style={{
                        background: 'none',
                        border: 'none',
                        padding: '0.75rem 0',
                        fontSize: '0.85rem',
                        fontWeight: filter === 'all' ? '600' : '400',
                        color: filter === 'all' ? 'var(--primary)' : 'var(--text-secondary)',
                        borderBottom: filter === 'all' ? '2px solid var(--primary)' : '2px solid transparent',
                        cursor: 'pointer',
                        transition: 'all 0.2s'
                    }}
                >
                    All
                </button>
                <button
                    onClick={() => setFilter('unread')}
                    style={{
                        background: 'none',
                        border: 'none',
                        padding: '0.75rem 0',
                        fontSize: '0.85rem',
                        fontWeight: filter === 'unread' ? '600' : '400',
                        color: filter === 'unread' ? 'var(--primary)' : 'var(--text-secondary)',
                        borderBottom: filter === 'unread' ? '2px solid var(--primary)' : '2px solid transparent',
                        cursor: 'pointer',
                        transition: 'all 0.2s'
                    }}
                >
                    Unread
                </button>
            </div>

            <div style={{ overflowY: 'auto', flex: 1 }}>
                {loading ? (
                    <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-secondary)' }}>Loading...</div>
                ) : displayedNotifications.length === 0 ? (
                    <div style={{ padding: '3rem 2rem', textAlign: 'center' }}>
                        <Bell size={40} style={{ color: 'var(--border-color)', marginBottom: '1rem' }} />
                        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                            {filter === 'unread' ? 'No unread notifications' : 'No notifications yet'}
                        </p>
                    </div>
                ) : (
                    displayedNotifications.map(n => (
                        <div 
                            key={n.id} 
                            style={{
                                padding: '1rem',
                                borderBottom: '1px solid var(--border-color)',
                                backgroundColor: n.read ? 'transparent' : 'rgba(22, 101, 52, 0.03)',
                                transition: 'background-color 0.2s',
                                display: 'flex',
                                gap: '12px',
                                position: 'relative'
                            }}
                            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--surface-color-light)'}
                            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = n.read ? 'transparent' : 'rgba(22, 101, 52, 0.03)'}
                        >
                            {!n.read && (
                                <div style={{
                                    width: '8px',
                                    height: '8px',
                                    borderRadius: '50%',
                                    backgroundColor: 'var(--primary)',
                                    position: 'absolute',
                                    left: '8px',
                                    top: '1.25rem'
                                }}></div>
                            )}
                            <div 
                                style={{ flex: 1, cursor: 'pointer' }}
                                onClick={() => handleNotificationClick(n)}
                            >
                                <p style={{ 
                                    margin: '0 0 4px 0', 
                                    fontSize: '0.875rem', 
                                    color: 'var(--text-primary)',
                                    fontWeight: n.read ? '400' : '600',
                                    lineHeight: '1.4'
                                }}>
                                    {n.message}
                                </p>
                                <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                                    {new Date(n.createdAt).toLocaleString()}
                                </span>
                            </div>
                            {/* Individual Close/Dismiss Button */}
                            <button
                                type="button"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    markAsRead(n.id);
                                }}
                                style={{
                                    background: 'none',
                                    border: 'none',
                                    cursor: 'pointer',
                                    color: 'var(--text-secondary)',
                                    padding: '4px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    opacity: 0.6,
                                    transition: 'opacity 0.2s'
                                }}
                                onMouseEnter={(e) => e.currentTarget.style.opacity = 1}
                                onMouseLeave={(e) => e.currentTarget.style.opacity = 0.6}
                                title="Mark as read"
                            >
                                <Check size={16} />
                            </button>
                        </div>
                    ))
                )}
            </div>

            <div style={{
                padding: '0.75rem',
                textAlign: 'center',
                borderTop: '1px solid var(--border-color)',
                backgroundColor: 'var(--surface-color-light)'
            }}>
                <button 
                    type="button"
                    onClick={(e) => {
                        e.stopPropagation();
                        e.preventDefault();
                        onClose();
                    }}
                    style={{ 
                        fontSize: '0.875rem', 
                        color: 'var(--text-secondary)', 
                        background: 'none', 
                        border: 'none', 
                        cursor: 'pointer',
                        padding: '8px 16px',
                        borderRadius: '4px'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(0,0,0,0.05)'}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                >
                    Close
                </button>
            </div>
        </div>
    );
};

export default NotificationPanel;
