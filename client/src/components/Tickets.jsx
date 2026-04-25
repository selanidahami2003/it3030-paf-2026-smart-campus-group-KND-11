import React, { useState, useEffect, useContext, useCallback, useRef } from 'react';
import api from '../services/api';
import { AuthContext } from '../context/AuthContext';
import TicketForm from './TicketForm';

// ─── Skeleton loader for individual ticket cards ───────────────────────────────
const TicketSkeleton = () => (
    <div className="p-card ticket-skeleton" style={{ padding: '1.5rem', overflow: 'hidden' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
            <div className="skel skel-line" style={{ width: '45%', height: '1.1rem', borderRadius: '6px' }} />
            <div className="skel skel-badge" style={{ width: '80px', height: '1.5rem', borderRadius: '20px' }} />
        </div>
        <div className="skel skel-line" style={{ width: '92%', height: '0.9rem', marginBottom: '0.5rem', borderRadius: '4px' }} />
        <div className="skel skel-line" style={{ width: '70%', height: '0.9rem', marginBottom: '1rem', borderRadius: '4px' }} />
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <div className="skel skel-line" style={{ width: '30%', height: '0.8rem', borderRadius: '4px' }} />
            <div className="skel skel-line" style={{ width: '35%', height: '0.8rem', borderRadius: '4px' }} />
        </div>
    </div>
);

// ─── Status badge colour map ───────────────────────────────────────────────────
const STATUS_COLORS = {
    OPEN:        { bg: '#EFF6FF', color: '#1D4ED8', border: '#BFDBFE' },
    IN_PROGRESS: { bg: '#FFFBEB', color: '#B45309', border: '#FDE68A' },
    RESOLVED:    { bg: '#F0FDF4', color: '#166534', border: '#BBF7D0' },
    CLOSED:      { bg: '#F8FAFC', color: '#475569', border: '#E2E8F0' },
};

const PRIORITY_COLORS = {
    URGENT: '#DC2626',
    HIGH:   '#EA580C',
    MEDIUM: '#D97706',
    LOW:    '#16A34A',
};

// ─── Main component ────────────────────────────────────────────────────────────
const Tickets = () => {
    const { user } = useContext(AuthContext);
    const [tickets, setTickets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [comments, setComments] = useState({});
    const [newComment, setNewComment] = useState('');
    const [activeTicketId, setActiveTicketId] = useState(null);

    // Cache ref — avoids duplicate fetches on strict-mode double-mount
    const cacheRef = useRef(null);
    const fetchingRef = useRef(false);

    // ── fetchTickets: stable reference with useCallback ──────────────────────
    const fetchTickets = useCallback(async (force = false) => {
        if (fetchingRef.current) return; // prevent concurrent fetches
        // Return cached data immediately while revalidating in background
        if (cacheRef.current && !force) {
            setTickets(cacheRef.current);
            setLoading(false);
        }
        fetchingRef.current = true;
        try {
            const url = user.role === 'ADMIN' || user.role === 'TECHNICIAN'
                ? '/tickets'
                : '/tickets/my';
            const res = await api.get(url);
            cacheRef.current = res.data;
            setTickets(res.data);
        } catch (err) {
            console.error('Failed to fetch tickets:', err);
        } finally {
            setLoading(false);
            fetchingRef.current = false;
        }
    }, [user?.role]); // only re-create if role changes

    // ── Fetch immediately on mount ────────────────────────────────────────────
    useEffect(() => {
        fetchTickets();
    }, [fetchTickets]);

    // ── Status update ─────────────────────────────────────────────────────────
    const handleStatus = useCallback(async (id, status) => {
        // Optimistic UI update
        setTickets(prev => prev.map(t => t.id === id ? { ...t, status } : t));
        try {
            await api.put(`/tickets/${id}/status`, { status, assigneeId: user.id });
        } catch {
            alert('Status update failed');
            fetchTickets(true); // revert by refetching
        }
    }, [user?.id, fetchTickets]);

    // ── Delete ticket ─────────────────────────────────────────────────────────
    const handleDelete = useCallback(async (id) => {
        if (!window.confirm('Delete this ticket? This cannot be undone.')) return;
        // Optimistic removal
        setTickets(prev => prev.filter(t => t.id !== id));
        cacheRef.current = cacheRef.current?.filter(t => t.id !== id) ?? null;
        setActiveTicketId(prev => prev === id ? null : prev);
        try {
            await api.delete(`/tickets/${id}`);
        } catch {
            alert('Failed to delete ticket');
            fetchTickets(true);
        }
    }, [fetchTickets]);

    // ── Toggle expand and lazy-load comments ──────────────────────────────────
    const toggleDetails = useCallback(async (id) => {
        if (activeTicketId === id) {
            setActiveTicketId(null);
            return;
        }
        setActiveTicketId(id);
        // Only fetch comments if not already in cache
        if (!comments[id]) {
            try {
                const res = await api.get(`/tickets/${id}/comments`);
                setComments(prev => ({ ...prev, [id]: res.data }));
            } catch {
                setComments(prev => ({ ...prev, [id]: [] }));
            }
        }
    }, [activeTicketId, comments]);

    // ── Post comment ──────────────────────────────────────────────────────────
    const handleComment = useCallback(async (id) => {
        if (!newComment.trim()) return;
        const content = newComment;
        setNewComment('');
        try {
            await api.post(`/tickets/${id}/comments`, { content });
            const res = await api.get(`/tickets/${id}/comments`);
            setComments(prev => ({ ...prev, [id]: res.data }));
        } catch {
            alert('Failed to post comment');
        }
    }, [newComment]);

    // ─────────────────────────────────────────────────────────────────────────
    const isTech  = user?.role === 'TECHNICIAN';
    const isAdmin = user?.role === 'ADMIN';
    const canReport = !user || user.role === 'USER';

    return (
        <div>
            {/* ── Header ── */}
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h2>Service Desk</h2>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
                        Report incidents or track existing support requests.
                    </p>
                </div>
                {canReport && (
                    <button className="p-btn p-btn-primary" onClick={() => setIsFormOpen(true)}>
                        Report Incident
                    </button>
                )}
            </div>

            <TicketForm
                isOpen={isFormOpen}
                onClose={() => setIsFormOpen(false)}
                onSuccess={() => fetchTickets(true)}
            />

            {/* ── Skeleton loader while first fetch is in flight ── */}
            {loading ? (
                <div style={{ display: 'grid', gap: '1rem' }}>
                    {[1, 2, 3].map(n => <TicketSkeleton key={n} />)}
                </div>
            ) : tickets.length === 0 ? (
                <div className="p-card text-center" style={{ padding: '3rem', color: 'var(--text-secondary)' }}>
                    <div style={{ fontSize: '2.5rem', marginBottom: '0.75rem' }}>🎫</div>
                    <p style={{ fontWeight: 600, fontSize: '1rem', color: 'var(--text-primary)', marginBottom: '0.25rem' }}>
                        No tickets yet
                    </p>
                    <p style={{ fontSize: '0.875rem' }}>Submit an incident report to get started.</p>
                </div>
            ) : (
                <div style={{ display: 'grid', gap: '1rem' }}>
                    {tickets.map(t => {
                        const statusStyle = STATUS_COLORS[t.status] || STATUS_COLORS.OPEN;
                        const isExpanded  = activeTicketId === t.id;
                        const priorityColor = PRIORITY_COLORS[t.priority] || 'var(--text-primary)';

                        return (
                            <div key={t.id} className="p-card ticket-card" style={{ padding: '0', overflow: 'hidden' }}>
                                {/* ── Card header (clickable) ── */}
                                <div
                                    style={{
                                        padding: '1.25rem 1.5rem',
                                        cursor: 'pointer',
                                        transition: 'background-color 0.15s ease',
                                    }}
                                    onClick={() => toggleDetails(t.id)}
                                    onMouseOver={e  => e.currentTarget.style.backgroundColor = 'var(--surface-color-light)'}
                                    onMouseOut={e   => e.currentTarget.style.backgroundColor = 'transparent'}
                                >
                                    <div className="flex justify-between items-center mb-2">
                                        <h3 style={{ fontSize: '1rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px' }}>
                                            <span style={{
                                                display: 'inline-block', width: '8px', height: '8px',
                                                borderRadius: '50%', backgroundColor: priorityColor, flexShrink: 0
                                            }} />
                                            {t.category
                                                ? t.category.charAt(0) + t.category.slice(1).toLowerCase() + ' Issue'
                                                : 'Issue'}
                                        </h3>

                                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                            {/* Status badge */}
                                            <span style={{
                                                fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.04em',
                                                padding: '3px 10px', borderRadius: '20px',
                                                backgroundColor: statusStyle.bg,
                                                color: statusStyle.color,
                                                border: `1px solid ${statusStyle.border}`,
                                                textTransform: 'uppercase',
                                            }}>
                                                {t.status?.replace('_', ' ')}
                                            </span>

                                            {/* Delete button */}
                                            <button
                                                onClick={e => { e.stopPropagation(); handleDelete(t.id); }}
                                                title="Delete ticket"
                                                style={{
                                                    background: 'none', border: 'none', cursor: 'pointer',
                                                    color: 'var(--danger, #e53e3e)', fontSize: '0.9rem',
                                                    padding: '4px 6px', borderRadius: '6px',
                                                    transition: 'background 0.15s',
                                                    lineHeight: 1,
                                                }}
                                                onMouseOver={e => e.currentTarget.style.background = 'rgba(229,62,62,0.1)'}
                                                onMouseOut={e  => e.currentTarget.style.background = 'none'}
                                            >
                                                🗑️
                                            </button>

                                            {/* Expand chevron */}
                                            <span style={{
                                                fontSize: '0.8rem', color: 'var(--text-secondary)',
                                                transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)',
                                                transition: 'transform 0.25s ease', display: 'inline-block'
                                            }}>▼</span>
                                        </div>
                                    </div>

                                    <p style={{ color: 'var(--text-secondary)', marginBottom: '0.75rem', fontSize: '0.9rem', lineHeight: 1.5 }}>
                                        {t.description?.substring(0, 120)}{(t.description?.length || 0) > 120 ? '…' : ''}
                                    </p>

                                    <div className="flex justify-between" style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                                        <span>
                                            Priority:{' '}
                                            <strong style={{ color: priorityColor }}>{t.priority}</strong>
                                        </span>
                                        <span>
                                            Reported by:{' '}
                                            <strong style={{ color: 'var(--text-primary)' }}>
                                                {t.reporterName || t.creatorName || 'Unknown'}
                                            </strong>
                                        </span>
                                    </div>
                                </div>

                                {/* ── Expanded detail panel ── */}
                                {isExpanded && (
                                    <div style={{
                                        borderTop: '1px solid var(--border-color)',
                                        padding: '1.5rem',
                                        background: 'var(--surface-color-light)',
                                        animation: 'fadeSlideIn 0.2s ease',
                                    }}>
                                        {/* Full description */}
                                        <div className="mb-4">
                                            <strong style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                                                Full Description
                                            </strong>
                                            <p className="mt-1" style={{ fontSize: '0.9rem', color: 'var(--text-primary)', lineHeight: 1.6 }}>
                                                {t.description}
                                            </p>
                                        </div>

                                        {/* Evidence Photos */}
                                        <div className="mb-4">
                                            <strong style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em', display: 'block', marginBottom: '0.75rem' }}>
                                                Evidence Photos
                                            </strong>
                                            {(t.attachment1 || t.attachment2 || t.attachment3) ? (
                                                <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                                                    {[t.attachment1, t.attachment2, t.attachment3].filter(Boolean).map((src, idx) => (
                                                        <div
                                                            key={idx}
                                                            style={{
                                                                width: '130px', height: '130px',
                                                                borderRadius: '12px', overflow: 'hidden',
                                                                border: '2px solid var(--border-color)',
                                                                boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                                                                cursor: 'pointer',
                                                                transition: 'transform 0.2s, box-shadow 0.2s',
                                                                flexShrink: 0
                                                            }}
                                                            onMouseOver={e => { e.currentTarget.style.transform = 'scale(1.05)'; e.currentTarget.style.boxShadow = '0 6px 20px rgba(0,0,0,0.2)'; }}
                                                            onMouseOut={e  => { e.currentTarget.style.transform = 'scale(1)';   e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.1)'; }}
                                                            onClick={() => {
                                                                const w = window.open();
                                                                w.document.write(`<img src="${src}" style="max-width:100%;max-height:100vh">`);
                                                            }}
                                                        >
                                                            <img
                                                                src={src}
                                                                alt={`Evidence ${idx + 1}`}
                                                                loading="lazy"
                                                                style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                                                            />
                                                        </div>
                                                    ))}
                                                </div>
                                            ) : (
                                                <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', fontStyle: 'italic' }}>
                                                    No evidence provided.
                                                </p>
                                            )}
                                        </div>

                                        {/* Technician action buttons */}
                                        {isTech && t.status !== 'CLOSED' && t.status !== 'RESOLVED' && (
                                            <div className="flex gap-2 mb-6">
                                                <button
                                                    className="p-btn p-btn-secondary"
                                                    onClick={() => handleStatus(t.id, 'IN_PROGRESS')}
                                                >
                                                    Mark In Progress
                                                </button>
                                                <button
                                                    className="p-btn p-btn-secondary"
                                                    onClick={() => handleStatus(t.id, 'RESOLVED')}
                                                    style={{ color: 'var(--success)', borderColor: 'var(--success)' }}
                                                >
                                                    Resolve
                                                </button>
                                            </div>
                                        )}

                                        {/* Comments */}
                                        <div className="mt-4">
                                            <h4 className="mb-2 text-sm" style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem', fontSize: '0.85rem', fontWeight: 600 }}>
                                                Updates &amp; Comments
                                            </h4>
                                            <div style={{
                                                maxHeight: '200px', overflowY: 'auto',
                                                margin: '1rem 0', background: 'var(--bg-color)',
                                                padding: '1rem', borderRadius: 'var(--radius-md)'
                                            }}>
                                                {!comments[t.id] ? (
                                                    <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', textAlign: 'center' }}>
                                                        Loading comments…
                                                    </p>
                                                ) : comments[t.id].length === 0 ? (
                                                    <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', textAlign: 'center' }}>
                                                        No comments yet. Add one below!
                                                    </p>
                                                ) : comments[t.id].map(c => (
                                                    <div key={c.id} style={{ marginBottom: '0.75rem', paddingBottom: '0.75rem', borderBottom: '1px solid var(--border-color)' }}>
                                                        <div className="flex justify-between" style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '0.25rem' }}>
                                                            <span style={{ fontWeight: 600, color: c.author?.email === user.email ? 'var(--primary)' : 'var(--text-primary)' }}>
                                                                {c.author?.name}
                                                            </span>
                                                            <span>{new Date(c.createdAt).toLocaleString()}</span>
                                                        </div>
                                                        <p style={{ fontSize: '0.875rem', color: 'var(--text-primary)' }}>{c.content}</p>
                                                    </div>
                                                ))}
                                            </div>

                                            {!isAdmin && (
                                                <div className="flex gap-2">
                                                    <input
                                                        type="text"
                                                        className="p-input"
                                                        value={newComment}
                                                        onChange={e => setNewComment(e.target.value)}
                                                        placeholder="Add an update or ask a question…"
                                                        onKeyDown={e => e.key === 'Enter' && handleComment(t.id)}
                                                    />
                                                    <button className="p-btn p-btn-primary" onClick={() => handleComment(t.id)}>
                                                        Post
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

export default Tickets;
