import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { Plus } from 'lucide-react';

const STATUS_COLORS = {
    PENDING:   { bg: 'rgba(234,179,8,0.12)',  color: '#ca8a04' },
    APPROVED:  { bg: 'rgba(34,197,94,0.12)',  color: 'var(--success)' },
    REJECTED:  { bg: 'rgba(239,68,68,0.12)',  color: 'var(--danger)' },
    CANCELLED: { bg: 'rgba(107,114,128,0.12)', color: '#6b7280' },
};

const MyBookings = () => {
    const navigate = useNavigate();
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchBookings = async () => {
        try {
            const res = await api.get('/bookings/my');
            setBookings(res.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchBookings(); }, []);

    const handleCancel = async (id) => {
        if (!window.confirm('Cancel this booking?')) return;
        try {
            await api.put(`/bookings/${id}/cancel`);
            fetchBookings();
        } catch (err) {
            alert(err.response?.data?.error || 'Failed to cancel booking.');
        }
    };

    if (loading) return (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '4rem' }}>
            <div style={{ color: 'var(--text-secondary)' }}>Loading your bookings...</div>
        </div>
    );

    return (
        <div>
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h2>My Bookings</h2>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
                        View and manage your booking requests.
                    </p>
                </div>
                <button
                    className="p-btn p-btn-primary"
                    onClick={() => navigate('/bookings/new')}
                    style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
                >
                    <Plus size={18} /> New Booking
                </button>
            </div>

            {bookings.length === 0 ? (
                <div className="p-card" style={{ textAlign: 'center', padding: '3.5rem' }}>
                    <p style={{ color: 'var(--text-secondary)', marginBottom: '1.25rem', fontSize: '1rem' }}>
                        You have no bookings yet.
                    </p>
                    <button className="p-btn p-btn-primary" onClick={() => navigate('/bookings/new')}>
                        Make Your First Booking
                    </button>
                </div>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {bookings.map(b => {
                        const s = STATUS_COLORS[b.status] || STATUS_COLORS.PENDING;
                        const canCancel = b.status === 'PENDING' || b.status === 'APPROVED';
                        return (
                            <div
                                key={b.id}
                                className="p-card"
                                style={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    gap: '1rem',
                                    flexWrap: 'wrap',
                                }}
                            >
                                <div style={{ flex: 1, minWidth: '200px' }}>
                                    <h4 style={{ marginBottom: '0.35rem' }}>
                                        {b.resourceName || 'Unknown Resource'}
                                    </h4>
                                    <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '0.35rem' }}>
                                        {new Date(b.startTime).toLocaleString()} &ndash; {new Date(b.endTime).toLocaleString()}
                                    </p>
                                    <span style={{
                                        display: 'inline-block',
                                        fontSize: '0.72rem',
                                        fontWeight: '700',
                                        letterSpacing: '0.05em',
                                        padding: '2px 10px',
                                        borderRadius: '20px',
                                        backgroundColor: s.bg,
                                        color: s.color,
                                        textTransform: 'uppercase',
                                    }}>
                                        {b.status}
                                    </span>
                                </div>
                                {canCancel && (
                                    <button
                                        className="p-btn p-btn-secondary"
                                        onClick={() => handleCancel(b.id)}
                                        style={{ color: 'var(--danger)', borderColor: 'var(--danger)', whiteSpace: 'nowrap' }}
                                    >
                                        Cancel
                                    </button>
                                )}
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

export default MyBookings;
