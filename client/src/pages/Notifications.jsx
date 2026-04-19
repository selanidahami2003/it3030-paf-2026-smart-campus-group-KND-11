import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { Bell, Check, Trash2, Clock, Inbox, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

const Notifications = () => {
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchNotifications();
    }, []);

    const fetchNotifications = async () => {
        try {
            const response = await api.get('/notifications');
            setNotifications(response.data);
        } catch (err) {
            console.error('Failed to fetch notifications');
        } finally {
            setLoading(false);
        }
    };

    const markAsRead = async (id) => {
        try {
            await api.post(`/notifications/${id}/read`);
            setNotifications(notifications.map(n => n.id === id ? { ...n, read: true } : n));
        } catch (err) {
            alert('Failed to mark as read');
        }
    };

    const deleteNotification = async (id) => {
        try {
            await api.delete(`/notifications/${id}`);
            setNotifications(notifications.filter(n => n.id !== id));
        } catch (err) {
            alert('Failed to delete notification');
        }
    };

    if (loading) return <div style={{ padding: '40px', textAlign: 'center' }}>Loading notifications...</div>;

    return (
        <div style={{ padding: '40px', maxWidth: '800px', margin: '0 auto' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '30px' }}>
                <Link to="/dashboard" style={{ color: '#718096', display: 'flex', alignItems: 'center' }}>
                    <ArrowLeft size={24} />
                </Link>
                <h1 style={{ fontSize: '28px' }}>Your Notifications</h1>
            </div>

            {notifications.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '60px', background: 'white', borderRadius: '20px', color: '#718096' }}>
                    <Inbox size={48} style={{ marginBottom: '15px', opacity: 0.5 }} />
                    <p>No notifications yet!</p>
                </div>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                    {notifications.map((n) => (
                        <div key={n.id} style={{ 
                            background: 'white', 
                            padding: '20px', 
                            borderRadius: '15px', 
                            display: 'flex', 
                            alignItems: 'flex-start', 
                            gap: '15px',
                            borderLeft: `5px solid ${n.read ? '#e2e8f0' : '#4299e1'}`,
                            boxShadow: '0 2px 4px rgba(0,0,0,0.02)'
                        }}>
                            <div style={{ 
                                padding: '10px', 
                                background: n.read ? '#f8fafc' : '#ebf8ff', 
                                borderRadius: '10px',
                                color: n.read ? '#94a3b8' : '#3182ce'
                            }}>
                                <Bell size={20} />
                            </div>
                            <div style={{ flex: 1 }}>
                                <p style={{ margin: '0 0 8px 0', fontSize: '16px', color: '#2d3748', fontWeight: n.read ? '400' : '600' }}>
                                    {n.message}
                                </p>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '12px', color: '#a0aec0' }}>
                                    <Clock size={12} />
                                    {new Date(n.createdAt).toLocaleString()}
                                </div>
                            </div>
                            <div style={{ display: 'flex', gap: '10px' }}>
                                {!n.read && (
                                    <button 
                                        onClick={() => markAsRead(n.id)}
                                        style={{ background: 'none', border: 'none', color: '#38a169', cursor: 'pointer', padding: '5px' }}
                                        title="Mark as read"
                                    >
                                        <Check size={18} />
                                    </button>
                                )}
                                <button 
                                    onClick={() => deleteNotification(n.id)}
                                    style={{ background: 'none', border: 'none', color: '#e53e3e', cursor: 'pointer', padding: '5px' }}
                                    title="Delete"
                                >
                                    <Trash2 size={18} />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Notifications;
