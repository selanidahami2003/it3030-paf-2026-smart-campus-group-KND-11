import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import api from '../services/api';
import { Trash2, Phone, X } from 'lucide-react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

const STATUS_COLORS = {
    PENDING:   { bg: '#fff3cd', color: '#856404' },
    APPROVED:  { bg: '#d1fae5', color: '#065f46' },
    REJECTED:  { bg: '#fee2e2', color: '#991b1b' },
    CANCELLED: { bg: '#f3f4f6', color: '#6b7280' },
    EXPIRED:   { bg: '#fee2e2', color: '#991b1b' },
};

const AdminBookings = () => {
    const { user } = useContext(AuthContext);
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('valid');
    const [contactModal, setContactModal] = useState(null);

    const fetchBookings = async () => {
        setLoading(true);
        try {
            const res = await api.get('/bookings');
            setBookings(res.data);
        } catch (err) {
            console.error('Failed to fetch bookings', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchBookings(); }, []);

    const now = new Date();

    const isExpired = (b) => {
        if (b.status === 'REJECTED' || b.status === 'CANCELLED') return false;
        return b.endTime && new Date(b.endTime) < now;
    };

    const validBookings   = bookings.filter(b => !isExpired(b));
    const expiredBookings = bookings.filter(b => isExpired(b));
    const displayed = filter === 'valid' ? validBookings : expiredBookings;

    const handleDelete = async (id) => {
        if (!window.confirm('Delete this booking?')) return;
        try {
            await api.delete(`/bookings/${id}`);
            fetchBookings();
        } catch (err) {
            alert(err.response?.data?.error || 'Delete failed.');
        }
    };

    const handleApprove = async (id) => {
        try {
            await api.put(`/bookings/${id}/approve`);
            fetchBookings();
        } catch (err) {
            alert(err.response?.data?.error || 'Failed to approve.');
        }
    };

    const handleReject = async (id) => {
        try {
            await api.put(`/bookings/${id}/reject`);
            fetchBookings();
        } catch (err) {
            alert(err.response?.data?.error || 'Failed to reject.');
        }
    };

    const handleGeneratePDF = () => {
        const doc = new jsPDF();
        doc.setFontSize(16);
        doc.setTextColor(22, 101, 52);
        doc.text('Valid Bookings Report', 14, 18);
        doc.setFontSize(10);
        doc.setTextColor(100);
        doc.text(`Generated: ${new Date().toLocaleString()}`, 14, 26);
        autoTable(doc, {
            startY: 32,
            head: [['User', 'Resource', 'Start Time', 'End Time', 'Status']],
            body: validBookings.map(b => [
                b.userName || b.userId,
                b.resourceName || 'Unknown Resource',
                b.startTime ? new Date(b.startTime).toLocaleString() : '-',
                b.endTime   ? new Date(b.endTime).toLocaleString()   : '-',
                b.status,
            ]),
            headStyles: { fillColor: [22, 101, 52], textColor: 255, fontStyle: 'bold' },
            alternateRowStyles: { fillColor: [240, 253, 244] },
            styles: { fontSize: 9 },
        });
        doc.save('valid-bookings-report.pdf');
    };

    const getDisplayStatus = (b) => {
        if (isExpired(b)) return 'EXPIRED';
        return b.status;
    };

    return (
        <div>
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
                <div>
                    <h2 style={{ margin: 0 }}>Manage Bookings</h2>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginTop: '4px' }}>
                        Review and manage all facility booking requests.
                    </p>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
                    {/* Valid / Expired toggles */}
                    <div style={{ display: 'flex', borderRadius: '8px', overflow: 'hidden', border: '1px solid #e2e8f0' }}>
                        <button
                            onClick={() => setFilter('valid')}
                            style={{
                                padding: '6px 16px',
                                fontSize: '0.8rem',
                                fontWeight: '700',
                                border: 'none',
                                cursor: 'pointer',
                                background: filter === 'valid' ? '#166534' : 'white',
                                color:  filter === 'valid' ? 'white' : '#374151',
                                transition: 'all 0.2s',
                            }}
                        >
                            Valid &nbsp;<span style={{
                                background: filter === 'valid' ? 'rgba(255,255,255,0.25)' : '#e2e8f0',
                                borderRadius: '12px',
                                padding: '1px 8px',
                                fontSize: '0.72rem',
                            }}>{validBookings.length}</span>
                        </button>
                        <button
                            onClick={() => setFilter('expired')}
                            style={{
                                padding: '6px 16px',
                                fontSize: '0.8rem',
                                fontWeight: '700',
                                border: 'none',
                                cursor: 'pointer',
                                background: filter === 'expired' ? '#991b1b' : 'white',
                                color:  filter === 'expired' ? 'white' : '#374151',
                                transition: 'all 0.2s',
                            }}
                        >
                            Expired &nbsp;<span style={{
                                background: filter === 'expired' ? 'rgba(255,255,255,0.25)' : '#e2e8f0',
                                borderRadius: '12px',
                                padding: '1px 8px',
                                fontSize: '0.72rem',
                            }}>{expiredBookings.length}</span>
                        </button>
                    </div>
                    <button
                        className="p-btn p-btn-primary"
                        onClick={handleGeneratePDF}
                        style={{ fontSize: '0.8rem', padding: '7px 14px' }}
                    >
                        Export PDF
                    </button>
                </div>
            </div>

            {/* Table */}
            <div className="p-card" style={{ padding: 0, overflow: 'hidden' }}>
                {loading ? (
                    <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-secondary)' }}>Loading bookings...</div>
                ) : displayed.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-secondary)' }}>
                        No {filter} bookings found.
                    </div>
                ) : (
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                            <tr style={{ borderBottom: '1px solid #e2e8f0' }}>
                                {['User', 'Resource', 'Time', 'Status', 'Actions'].map(h => (
                                    <th key={h} style={{
                                        padding: '12px 16px',
                                        textAlign: 'left',
                                        fontSize: '0.78rem',
                                        fontWeight: '700',
                                        color: 'var(--text-secondary)',
                                        textTransform: 'uppercase',
                                        letterSpacing: '0.05em',
                                    }}>{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {displayed.map((b, i) => {
                                const displayStatus = getDisplayStatus(b);
                                const sc = STATUS_COLORS[displayStatus] || STATUS_COLORS.PENDING;
                                const isPending = b.status === 'PENDING';
                                const hasPhone  = b.userPhone || b.contactPhone;
                                return (
                                    <tr
                                        key={b.id || b._id}
                                        style={{
                                            borderBottom: i < displayed.length - 1 ? '1px solid #f1f5f9' : 'none',
                                            transition: 'background 0.15s',
                                        }}
                                        onMouseEnter={e => e.currentTarget.style.background = '#f8fafc'}
                                        onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                                    >
                                        <td style={{ padding: '12px 16px', fontSize: '0.875rem', fontWeight: '500' }}>
                                            {b.userName || b.userId || 'Unknown'}
                                        </td>
                                        <td style={{ padding: '12px 16px', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                                            {b.resourceName || 'Unknown Resource'}
                                        </td>
                                        <td style={{ padding: '12px 16px', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                                            {b.startTime ? new Date(b.startTime).toLocaleString() : '-'}
                                        </td>
                                        <td style={{ padding: '12px 16px' }}>
                                            <span style={{
                                                display: 'inline-block',
                                                padding: '3px 10px',
                                                borderRadius: '20px',
                                                fontSize: '0.7rem',
                                                fontWeight: '700',
                                                letterSpacing: '0.05em',
                                                textTransform: 'uppercase',
                                                backgroundColor: sc.bg,
                                                color: sc.color,
                                            }}>
                                                {displayStatus}
                                            </span>
                                        </td>
                                        <td style={{ padding: '12px 16px' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                                {isPending && (
                                                    <>
                                                        <button
                                                            onClick={() => handleApprove(b.id || b._id)}
                                                            style={{
                                                                padding: '4px 12px',
                                                                fontSize: '0.75rem',
                                                                fontWeight: '700',
                                                                border: 'none',
                                                                borderRadius: '6px',
                                                                cursor: 'pointer',
                                                                background: '#166534',
                                                                color: 'white',
                                                                transition: 'opacity 0.2s',
                                                            }}
                                                            onMouseEnter={e => e.currentTarget.style.opacity = '0.85'}
                                                            onMouseLeave={e => e.currentTarget.style.opacity = '1'}
                                                        >Approve</button>
                                                        <button
                                                            onClick={() => handleReject(b.id || b._id)}
                                                            style={{
                                                                padding: '4px 12px',
                                                                fontSize: '0.75rem',
                                                                fontWeight: '700',
                                                                border: 'none',
                                                                borderRadius: '6px',
                                                                cursor: 'pointer',
                                                                background: '#dc2626',
                                                                color: 'white',
                                                                transition: 'opacity 0.2s',
                                                            }}
                                                            onMouseEnter={e => e.currentTarget.style.opacity = '0.85'}
                                                            onMouseLeave={e => e.currentTarget.style.opacity = '1'}
                                                        >Reject</button>
                                                    </>
                                                )}
                                                <button
                                                    onClick={() => handleDelete(b.id || b._id)}
                                                    title="Delete booking"
                                                    style={{
                                                        padding: '4px 10px',
                                                        fontSize: '0.75rem',
                                                        fontWeight: '700',
                                                        border: 'none',
                                                        borderRadius: '6px',
                                                        cursor: 'pointer',
                                                        background: '#fee2e2',
                                                        color: '#991b1b',
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        gap: '4px',
                                                        transition: 'background 0.2s',
                                                    }}
                                                    onMouseEnter={e => e.currentTarget.style.background = '#fecaca'}
                                                    onMouseLeave={e => e.currentTarget.style.background = '#fee2e2'}
                                                >
                                                    <Trash2 size={13} /> Delete
                                                </button>
                                                {hasPhone && (
                                                    <button
                                                        onClick={() => setContactModal(b)}
                                                        title="View contact"
                                                        style={{
                                                            padding: '6px',
                                                            border: 'none',
                                                            borderRadius: '6px',
                                                            cursor: 'pointer',
                                                            background: '#d1fae5',
                                                            color: '#065f46',
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            transition: 'background 0.2s',
                                                        }}
                                                        onMouseEnter={e => e.currentTarget.style.background = '#a7f3d0'}
                                                        onMouseLeave={e => e.currentTarget.style.background = '#d1fae5'}
                                                    >
                                                        <Phone size={14} />
                                                    </button>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                )}
            </div>

            {/* Contact Modal */}
            {contactModal && (
                <div
                    onClick={() => setContactModal(null)}
                    style={{
                        position: 'fixed', inset: 0, zIndex: 1000,
                        background: 'rgba(0,0,0,0.4)',
                        backdropFilter: 'blur(4px)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}
                >
                    <div
                        onClick={e => e.stopPropagation()}
                        style={{
                            background: 'rgba(255,255,255,0.95)',
                            borderRadius: '16px',
                            padding: '2rem',
                            minWidth: '300px',
                            boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
                            position: 'relative',
                        }}
                    >
                        <button
                            onClick={() => setContactModal(null)}
                            style={{ position: 'absolute', top: '1rem', right: '1rem', background: 'none', border: 'none', cursor: 'pointer', color: '#6b7280' }}
                        >
                            <X size={20} />
                        </button>
                        <h3 style={{ margin: '0 0 1rem', color: '#166534' }}>Contact Details</h3>
                        <p style={{ margin: '0 0 0.5rem', fontWeight: '600' }}>{contactModal.userName || 'User'}</p>
                        <p style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '8px', color: '#374151' }}>
                            <Phone size={16} />
                            {contactModal.userPhone || contactModal.contactPhone}
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminBookings;
