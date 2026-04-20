import React, { useState, useEffect, useContext, useCallback, useRef } from 'react';
import api from '../services/api';
import { AuthContext } from '../context/AuthContext';
import TicketForm from './TicketForm';
import { 
    Search, 
    Filter, 
    ChevronDown, 
    MoreHorizontal, 
    Trash2, 
    MessageSquare, 
    Image as ImageIcon, 
    Send,
    User as UserIcon,
    AlertCircle,
    CheckCircle2,
    Clock,
    XCircle,
    Plus
} from 'lucide-react';

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

// ─── Main component ────────────────────────────────────────────────────────────
const Tickets = () => {
    const { user } = useContext(AuthContext);
    const [tickets, setTickets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [comments, setComments] = useState({});
    const [newComment, setNewComment] = useState('');
    const [activeTicketId, setActiveTicketId] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('ALL');
    const [priorityFilter, setPriorityFilter] = useState('ALL');

    const cacheRef = useRef(null);
    const fetchingRef = useRef(false);

    const fetchTickets = useCallback(async (force = false) => {
        if (fetchingRef.current) return;
        if (cacheRef.current && !force) {
            setTickets(cacheRef.current);
            setLoading(false);
        }
        fetchingRef.current = true;
        try {
            const url = user?.role === 'ADMIN' || user?.role === 'TECHNICIAN' ? '/tickets' : '/tickets/my';
            const res = await api.get(url);
            cacheRef.current = res.data;
            setTickets(res.data);
        } catch (err) {
            console.error('Failed to fetch tickets:', err);
        } finally {
            setLoading(false);
            fetchingRef.current = false;
        }
    }, [user?.role]);

    useEffect(() => {
        fetchTickets();
    }, [fetchTickets]);

    const handleStatus = useCallback(async (id, status) => {
        setTickets(prev => prev.map(t => t.id === id ? { ...t, status } : t));
        try {
            await api.put(`/tickets/${id}/status`, { status, assigneeId: user.id });
        } catch {
            alert('Status update failed');
            fetchTickets(true);
        }
    }, [user?.id, fetchTickets]);

    const handleDelete = useCallback(async (id) => {
        if (!window.confirm('Delete this ticket?')) return;
        setTickets(prev => prev.filter(t => t.id !== id));
        try {
            await api.delete(`/tickets/${id}`);
        } catch {
            alert('Failed to delete ticket');
            fetchTickets(true);
        }
    }, [fetchTickets]);

    const toggleDetails = useCallback(async (id) => {
        if (activeTicketId === id) {
            setActiveTicketId(null);
            return;
        }
        setActiveTicketId(id);
        if (!comments[id]) {
            try {
                const res = await api.get(`/tickets/${id}/comments`);
                setComments(prev => ({ ...prev, [id]: res.data }));
            } catch {
                setComments(prev => ({ ...prev, [id]: [] }));
            }
        }
    }, [activeTicketId, comments]);

    const handleComment = useCallback(async (id) => {
        if (!newComment.trim()) return;
        setNewComment('');
        try {
            await api.post(`/tickets/${id}/comments`, { content: newComment });
            const res = await api.get(`/tickets/${id}/comments`);
            setComments(prev => ({ ...prev, [id]: res.data }));
        } catch {
            alert('Failed to post comment');
        }
    }, [newComment]);

    const getStatusInfo = (status) => {
        switch(status) {
            case 'OPEN': return { icon: <Clock size={14} />, color: '#3B82F6', label: 'Open', bg: '#EFF6FF' };
            case 'IN_PROGRESS': return { icon: <AlertCircle size={14} />, color: '#F59E0B', label: 'In Progress', bg: '#FFFBEB' };
            case 'RESOLVED': return { icon: <CheckCircle2 size={14} />, color: '#10B981', label: 'Resolved', bg: '#F0FDF4' };
            case 'CLOSED': return { icon: <XCircle size={14} />, color: '#6B7280', label: 'Closed', bg: '#F9FAFB' };
            default: return { icon: <Clock size={14} />, color: '#3B82F6', label: 'Open', bg: '#EFF6FF' };
        }
    };

    const getPriorityColor = (priority) => {
        switch(priority) {
            case 'URGENT': return '#EF4444';
            case 'HIGH': return '#F59E0B';
            case 'MEDIUM': return '#3B82F6';
            case 'LOW': return '#10B981';
            default: return '#1F7A5A';
        }
    };

    const isTech  = user?.role === 'TECHNICIAN';
    const canReport = !user || user.role === 'USER';

    const filteredTickets = tickets.filter(t => {
        const matchesSearch = t.description?.toLowerCase().includes(searchTerm.toLowerCase()) || 
                             t.category?.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = statusFilter === 'ALL' || t.status === statusFilter;
        const matchesPriority = priorityFilter === 'ALL' || t.priority === priorityFilter;
        return matchesSearch && matchesStatus && matchesPriority;
    });

    return (
        <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
            <div className="flex justify-between items-end mb-8">
                <div>
                    <h2 style={{ fontSize: '1.75rem', fontWeight: '800', color: 'var(--text-primary)', marginBottom: '0.25rem' }}>Service Desk</h2>
                    <p style={{ color: 'var(--text-secondary)' }}>Track and manage your campus service requests.</p>
                </div>
                {canReport && (
                    <button className="p-btn p-btn-primary" onClick={() => setIsFormOpen(true)} style={{ boxShadow: 'var(--shadow-lg)', padding: '0.6rem 1rem' }}>
                        <Plus size={18} />
                        Report Incident
                    </button>
                )}
            </div>

            <TicketForm isOpen={isFormOpen} onClose={() => setIsFormOpen(false)} onSuccess={() => fetchTickets(true)} />

            <div className="flex gap-4 mb-6" style={{ background: 'white', padding: '1rem', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-sm)', border: '1px solid var(--border-color)' }}>
                <div style={{ flex: 1, position: 'relative' }}>
                    <Search size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-tertiary)' }} />
                    <input 
                        className="p-input" 
                        placeholder="Search tickets..." 
                        value={searchTerm} 
                        onChange={(e) => setSearchTerm(e.target.value)} 
                        style={{ paddingLeft: '3rem', border: 'none', background: 'var(--surface-color-light)' }} 
                    />
                </div>
                <select className="p-input" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} style={{ width: '150px', border: 'none', background: 'var(--surface-color-light)' }}>
                    <option value="ALL">All Status</option>
                    <option value="OPEN">Open</option>
                    <option value="IN_PROGRESS">In Progress</option>
                    <option value="RESOLVED">Resolved</option>
                </select>
                <select className="p-input" value={priorityFilter} onChange={(e) => setPriorityFilter(e.target.value)} style={{ width: '150px', border: 'none', background: 'var(--surface-color-light)' }}>
                    <option value="ALL">All Priority</option>
                    <option value="URGENT">Urgent</option>
                    <option value="HIGH">High</option>
                </select>
            </div>

            {loading ? (
                <div style={{ display: 'grid', gap: '1rem' }}>
                    {[1, 2, 3].map(n => <div key={n} className="skeleton-box" style={{ height: '120px', borderRadius: 'var(--radius-lg)' }} />)}
                </div>
            ) : filteredTickets.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '5rem 0', color: 'var(--text-tertiary)' }}>
                    <div className="avatar" style={{ width: '80px', height: '80px', margin: '0 auto 1.5rem', background: 'var(--surface-color-light)', fontSize: '2rem' }}>🎫</div>
                    <h3>No tickets found</h3>
                    <p>When you report an incident, it will appear here.</p>
                </div>
            ) : (
                <div style={{ display: 'grid', gap: '1rem' }}>
                    {filteredTickets.map(t => {
                        const status = getStatusInfo(t.status);
                        const isExpanded = activeTicketId === t.id;
                        return (
                            <div key={t.id} className="ticket-card-modern">
                                <div className="status-indicator" style={{ backgroundColor: getPriorityColor(t.priority) }} />
                                
                                <div onClick={() => toggleDetails(t.id)} style={{ padding: '1.25rem 1.5rem' }}>
                                    <div className="flex justify-between items-start mb-2">
                                        <div>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.25rem' }}>
                                                <h3 style={{ fontSize: '1.1rem', fontWeight: '700', color: 'var(--text-primary)' }}>
                                                    {t.category ? t.category.charAt(0) + t.category.slice(1).toLowerCase() + ' Issue' : 'General Issue'}
                                                </h3>
                                                <span style={{ fontSize: '0.7rem', fontWeight: '800', color: getPriorityColor(t.priority), background: `${getPriorityColor(t.priority)}15`, padding: '2px 8px', borderRadius: '4px', textTransform: 'uppercase' }}>
                                                    {t.priority}
                                                </span>
                                            </div>
                                            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', maxWidth: '600px' }}>
                                                {t.description?.substring(0, 100)}{t.description?.length > 100 ? '...' : ''}
                                            </p>
                                        </div>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                            <div style={{ textAlign: 'right' }}>
                                                <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.75rem', fontWeight: '700', padding: '4px 12px', borderRadius: 'var(--radius-full)', background: status.bg, color: status.color, border: `1px solid ${status.color}20` }}>
                                                    {status.icon} {status.label}
                                                </span>
                                            </div>
                                            <ChevronDown size={18} style={{ transform: isExpanded ? 'rotate(180deg)' : '', transition: '0.3s' }} color="var(--text-tertiary)" />
                                        </div>
                                    </div>
                                    
                                    <div className="flex justify-between items-center mt-4">
                                        <div className="flex items-center gap-4" style={{ fontSize: '0.8rem', color: 'var(--text-tertiary)' }}>
                                            <div className="flex items-center gap-1">
                                                <UserIcon size={14} /> Reported by <span style={{ fontWeight: '600', color: 'var(--text-secondary)' }}>{t.reporterName || 'Student'}</span>
                                            </div>
                                            <span>•</span>
                                            <div className="flex items-center gap-1">
                                                <Clock size={14} /> {new Date().toLocaleDateString()}
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <button onClick={(e) => { e.stopPropagation(); handleDelete(t.id); }} className="p-btn" style={{ padding: '4px', color: 'var(--text-tertiary)' }}>
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                {isExpanded && (
                                    <div style={{ borderTop: '1px solid var(--border-color)', background: 'var(--surface-color-light)', padding: '1.5rem' }}>
                                        <div style={{ marginBottom: '2rem' }}>
                                            <h4 style={{ fontSize: '0.8rem', textTransform: 'uppercase', color: 'var(--text-tertiary)', letterSpacing: '0.05em', marginBottom: '0.5rem' }}>Full Description</h4>
                                            <p style={{ background: 'white', padding: '1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', fontSize: '0.95rem', lineHeight: '1.6' }}>
                                                {t.description}
                                            </p>
                                        </div>

                                        <div style={{ marginBottom: '2rem' }}>
                                            <h4 style={{ fontSize: '0.8rem', textTransform: 'uppercase', color: 'var(--text-tertiary)', letterSpacing: '0.05em', marginBottom: '1rem' }}>Evidence Photos</h4>
                                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: '1rem' }}>
                                                {[t.attachment1, t.attachment2, t.attachment3].filter(Boolean).map((img, i) => (
                                                    <div key={i} className="ticket-card-modern" style={{ height: '150px', overflow: 'hidden' }}>
                                                        <img src={img} alt="Evidence" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                                    </div>
                                                ))}
                                                {![t.attachment1, t.attachment2, t.attachment3].filter(Boolean).length && (
                                                    <div style={{ color: 'var(--text-tertiary)', fontStyle: 'italic', fontSize: '0.9rem' }}>No evidence uploaded.</div>
                                                )}
                                            </div>
                                        </div>

                                        <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '1.5rem' }}>
                                            <h4 style={{ fontSize: '0.8rem', textTransform: 'uppercase', color: 'var(--text-tertiary)', letterSpacing: '0.05em', marginBottom: '1rem' }}>Discussion</h4>
                                            
                                            <div className="chat-container mb-6">
                                                {!comments[t.id] ? (
                                                    <div className="skeleton-box" style={{ height: '40px', width: '200px' }} />
                                                ) : comments[t.id].map(c => {
                                                    const isSelf = c.authorId === user?.id || c.author?.email === user?.email;
                                                    return (
                                                        <div key={c.id} style={{ display: 'flex', gap: '0.75rem', flexDirection: isSelf ? 'row-reverse' : 'row' }}>
                                                            <div className="avatar" style={{ width: '32px', height: '32px', fontSize: '0.75rem' }}>
                                                                {c.authorName?.charAt(0) || 'U'}
                                                            </div>
                                                            <div className={`chat-bubble ${isSelf ? 'chat-bubble-self' : 'chat-bubble-other'}`}>
                                                                <div>{c.content}</div>
                                                                <div style={{ fontSize: '0.65rem', marginTop: '0.25rem', opacity: 0.8, textAlign: 'right' }}>
                                                                    {new Date(c.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    );
                                                })}
                                            </div>

                                            <div className="flex gap-2" style={{ background: 'white', padding: '0.5rem', borderRadius: 'var(--radius-full)', border: '1px solid var(--border-color)', boxShadow: 'var(--shadow-sm)' }}>
                                                <input 
                                                    className="p-input" 
                                                    placeholder="Reply to this ticket..." 
                                                    value={newComment}
                                                    onChange={(e) => setNewComment(e.target.value)}
                                                    onKeyDown={(e) => e.key === 'Enter' && handleComment(t.id)}
                                                    style={{ border: 'none', background: 'transparent', flex: 1, padding: '0.6rem 1rem' }}
                                                />
                                                <button onClick={() => handleComment(t.id)} className="p-btn p-btn-primary" style={{ borderRadius: 'var(--radius-full)', width: '40px', height: '40px', padding: '0' }}>
                                                    <Send size={18} />
                                                </button>
                                            </div>
                                        </div>

                                        {isTech && t.status !== 'RESOLVED' && (
                                            <div className="flex gap-3 justify-end mt-8">
                                                <button onClick={() => handleStatus(t.id, 'IN_PROGRESS')} className="p-btn p-btn-secondary" style={{ color: 'var(--warning)', borderColor: 'var(--warning)' }}>
                                                    In Progress
                                                </button>
                                                <button onClick={() => handleStatus(t.id, 'RESOLVED')} className="p-btn p-btn-primary" style={{ background: 'var(--success)' }}>
                                                    Mark as Resolved
                                                </button>
                                            </div>
                                        )}
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
