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
    Plus,
    Loader2
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
        
        const ticket = tickets.find(t => t.id === id);
        
        // Lazy-load full ticket data (attachments) and comments
        try {
            const fetchPromises = [];
            
            // If ticket has attachments but they aren't loaded in the summary, fetch full ticket
            if (ticket?.hasAttachments && !ticket?.attachment1) {
                fetchPromises.push(api.get(`/tickets/${id}`).then(res => {
                    setTickets(prev => prev.map(t => t.id === id ? { ...t, ...res.data } : t));
                }));
            }
            
            if (!comments[id]) {
                fetchPromises.push(api.get(`/tickets/${id}/comments`).then(res => {
                    setComments(prev => ({ ...prev, [id]: res.data }));
                }));
            }
            
            if (fetchPromises.length > 0) {
                await Promise.all(fetchPromises);
            }
        } catch (err) {
            console.error('Failed to lazy load ticket details:', err);
        }
    }, [activeTicketId, comments, tickets]);

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

    const stats = {
        total: tickets.length,
        open: tickets.filter(t => t.status === 'OPEN').length,
        inProgress: tickets.filter(t => t.status === 'IN_PROGRESS').length,
        resolved: tickets.filter(t => t.status === 'RESOLVED').length
    };

    return (
        <div style={{ maxWidth: '1100px', margin: '0 auto' }} className="fade-in-up">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h2 style={{ fontSize: '1.75rem', fontWeight: '800', color: 'var(--text-primary)', marginBottom: '0.25rem', letterSpacing: '-0.02em' }}>Support Center</h2>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>Track, manage and resolve campus maintenance requests.</p>
                </div>
                {canReport && (
                    <button className="p-btn p-btn-primary" onClick={() => setIsFormOpen(true)} style={{ boxShadow: '0 4px 12px rgba(59, 130, 246, 0.25)', padding: '0.5rem 1rem', borderRadius: 'var(--radius-md)' }}>
                        <Plus size={18} />
                        New Request
                    </button>
                )}
            </div>

            {/* Stats Overview */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
                <div className="stat-card-premium" style={{ padding: '1.25rem' }}>
                    <span style={{ fontSize: '0.75rem', fontWeight: '700', color: 'var(--text-tertiary)', textTransform: 'uppercase' }}>Total Tickets</span>
                    <span style={{ fontSize: '1.75rem', fontWeight: '800' }}>{stats.total}</span>
                </div>
                <div className="stat-card-premium" style={{ padding: '1.25rem', borderLeft: '4px solid var(--info)' }}>
                    <span style={{ fontSize: '0.75rem', fontWeight: '700', color: 'var(--text-tertiary)', textTransform: 'uppercase' }}>Open</span>
                    <span style={{ fontSize: '1.75rem', fontWeight: '800', color: 'var(--info)' }}>{stats.open}</span>
                </div>
                <div className="stat-card-premium" style={{ padding: '1.25rem', borderLeft: '4px solid var(--warning)' }}>
                    <span style={{ fontSize: '0.75rem', fontWeight: '700', color: 'var(--text-tertiary)', textTransform: 'uppercase' }}>Active</span>
                    <span style={{ fontSize: '1.75rem', fontWeight: '800', color: 'var(--warning)' }}>{stats.inProgress}</span>
                </div>
                <div className="stat-card-premium" style={{ padding: '1.25rem', borderLeft: '4px solid var(--success)' }}>
                    <span style={{ fontSize: '0.75rem', fontWeight: '700', color: 'var(--text-tertiary)', textTransform: 'uppercase' }}>Resolved</span>
                    <span style={{ fontSize: '1.75rem', fontWeight: '800', color: 'var(--success)' }}>{stats.resolved}</span>
                </div>
            </div>

            <TicketForm isOpen={isFormOpen} onClose={() => setIsFormOpen(false)} onSuccess={() => fetchTickets(true)} />

            <div className="flex gap-4 mb-8" style={{ background: 'rgba(255,255,255,0.7)', backdropFilter: 'blur(10px)', padding: '0.75rem', borderRadius: 'var(--radius-xl)', boxShadow: 'var(--shadow-sm)', border: '1px solid var(--border-color)' }}>
                <div style={{ flex: 1, position: 'relative' }}>
                    <Search size={18} style={{ position: 'absolute', left: '1.25rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-tertiary)' }} />
                    <input 
                        className="p-input" 
                        placeholder="Search by category or description..." 
                        value={searchTerm} 
                        onChange={(e) => setSearchTerm(e.target.value)} 
                        style={{ paddingLeft: '3.25rem', border: 'none', background: 'transparent' }} 
                    />
                </div>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <select className="p-input" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} style={{ width: '140px', border: '1px solid var(--border-color)', background: 'white', height: '45px', fontSize: '0.85rem' }}>
                        <option value="ALL">All Status</option>
                        <option value="OPEN">Open</option>
                        <option value="IN_PROGRESS">In Progress</option>
                        <option value="RESOLVED">Resolved</option>
                    </select>
                    <select className="p-input" value={priorityFilter} onChange={(e) => setPriorityFilter(e.target.value)} style={{ width: '140px', border: '1px solid var(--border-color)', background: 'white', height: '45px', fontSize: '0.85rem' }}>
                        <option value="ALL">All Priority</option>
                        <option value="URGENT">Urgent</option>
                        <option value="HIGH">High</option>
                        <option value="MEDIUM">Medium</option>
                    </select>
                </div>
            </div>

            {loading ? (
                <div style={{ display: 'grid', gap: '1.25rem' }}>
                    {[1, 2, 3, 4].map(n => <TicketSkeleton key={n} />)}
                </div>
            ) : filteredTickets.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '6rem 0', background: 'white', borderRadius: 'var(--radius-xl)', border: '1px dashed var(--border-color)' }}>
                    <div className="avatar" style={{ width: '100px', height: '100px', margin: '0 auto 2rem', background: 'var(--surface-color-light)', fontSize: '3rem', opacity: 0.6 }}>🎫</div>
                    <h3 style={{ fontSize: '1.5rem', fontWeight: '800' }}>No tickets match your criteria</h3>
                    <p style={{ maxWidth: '400px', margin: '0.5rem auto' }}>Try adjusting your filters or search terms to find what you're looking for.</p>
                </div>
            ) : (
                <div style={{ display: 'grid', gap: '1.25rem' }}>
                    {filteredTickets.map(t => {
                        const status = getStatusInfo(t.status);
                        const isExpanded = activeTicketId === t.id;
                        return (
                            <div key={t.id} className="ticket-card-modern" style={{ boxShadow: isExpanded ? 'var(--shadow-xl)' : 'var(--shadow-sm)' }}>
                                <div className="status-indicator" style={{ backgroundColor: getPriorityColor(t.priority) }} />
                                
                                <div onClick={() => toggleDetails(t.id)} style={{ padding: '1.5rem' }}>
                                    <div className="flex justify-between items-start">
                                        <div style={{ flex: 1 }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
                                                <span style={{ fontSize: '0.65rem', fontWeight: '800', color: getPriorityColor(t.priority), background: `${getPriorityColor(t.priority)}15`, padding: '2px 10px', borderRadius: '20px', textTransform: 'uppercase', letterSpacing: '0.05em', border: `1px solid ${getPriorityColor(t.priority)}30` }}>
                                                    {t.priority}
                                                </span>
                                                <h3 style={{ fontSize: '1.15rem', fontWeight: '800', color: 'var(--text-primary)' }}>
                                                    {t.category ? t.category.charAt(0) + t.category.slice(1).toLowerCase() + ' Incident' : 'Support Request'}
                                                </h3>
                                            </div>
                                            <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: '1.5', maxWidth: '750px' }}>
                                                {t.description?.substring(0, 140)}{t.description?.length > 140 ? '...' : ''}
                                            </p>
                                        </div>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', marginLeft: '2rem' }}>
                                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.25rem' }}>
                                                <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.75rem', fontWeight: '800', padding: '6px 14px', borderRadius: '20px', background: status.bg, color: status.color, border: `1px solid ${status.color}30` }}>
                                                    {status.icon} {status.label}
                                                </span>
                                                <span style={{ fontSize: '0.7rem', color: 'var(--text-tertiary)', fontWeight: '600' }}>#{t.id.toString().slice(-6)}</span>
                                            </div>
                                            <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'var(--surface-color-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-tertiary)', transform: isExpanded ? 'rotate(180deg)' : '', transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)' }}>
                                                <ChevronDown size={18} />
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <div className="flex justify-between items-center mt-6 pt-4" style={{ borderTop: '1px solid rgba(0,0,0,0.04)' }}>
                                        <div className="flex items-center gap-6" style={{ fontSize: '0.8rem', color: 'var(--text-tertiary)' }}>
                                            <div className="flex items-center gap-2">
                                                <div className="avatar" style={{ width: '24px', height: '24px', fontSize: '0.6rem' }}>{t.reporterName?.charAt(0) || 'U'}</div>
                                                <span style={{ fontWeight: '600', color: 'var(--text-secondary)' }}>{t.reporterName || 'Campus User'}</span>
                                            </div>
                                            <div className="flex items-center gap-1.5">
                                                <Clock size={14} /> 
                                                <span>{new Date(t.createdAt || Date.now()).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                                            </div>
                                            <div className="flex items-center gap-1.5">
                                                <MessageSquare size={14} />
                                                <span>{comments[t.id]?.length || 0} replies</span>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            {(user?.id === t.reporterId || user?.role === 'ADMIN') && (
                                                <button onClick={(e) => { e.stopPropagation(); handleDelete(t.id); }} className="p-btn" style={{ padding: '8px', color: 'var(--text-tertiary)', borderRadius: '50%' }} onMouseEnter={(e) => e.currentTarget.style.color = 'var(--danger)'} onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-tertiary)'}>
                                                    <Trash2 size={16} />
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {isExpanded && (
                                    <div style={{ borderTop: '1px solid var(--border-color)', background: '#F8FAFC', padding: '2rem' }}>
                                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: '2.5rem' }}>
                                            <div>
                                                <div style={{ marginBottom: '2.5rem' }}>
                                                    <h4 style={{ fontSize: '0.75rem', fontWeight: '800', textTransform: 'uppercase', color: 'var(--text-tertiary)', letterSpacing: '0.1em', marginBottom: '1rem' }}>Detailed Report</h4>
                                                    <div style={{ background: 'white', padding: '1.5rem', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-color)', fontSize: '1rem', lineHeight: '1.7', color: 'var(--text-primary)', whiteSpace: 'pre-wrap', boxShadow: 'var(--shadow-sm)' }}>
                                                        {t.description}
                                                    </div>
                                                </div>

                                                <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '2rem' }}>
                                                    <div className="flex justify-between items-center mb-6">
                                                        <h4 style={{ fontSize: '0.75rem', fontWeight: '800', textTransform: 'uppercase', color: 'var(--text-tertiary)', letterSpacing: '0.1em' }}>Discussion Activity</h4>
                                                        <span style={{ fontSize: '0.75rem', color: 'var(--primary)', fontWeight: '700' }}>{comments[t.id]?.length || 0} Comments</span>
                                                    </div>
                                                    
                                                    <div className="chat-container mb-6" style={{ background: 'transparent', padding: 0 }}>
                                                        {!comments[t.id] ? (
                                                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                                                <div className="skeleton-box" style={{ height: '60px', width: '70%', borderRadius: '18px 18px 18px 4px' }} />
                                                                <div className="skeleton-box" style={{ height: '40px', width: '50%', alignSelf: 'flex-end', borderRadius: '18px 18px 4px 18px' }} />
                                                            </div>
                                                        ) : comments[t.id].length === 0 ? (
                                                            <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-tertiary)', background: 'white', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-color)' }}>
                                                                <MessageSquare size={24} style={{ marginBottom: '0.5rem', opacity: 0.5 }} />
                                                                <p style={{ fontSize: '0.85rem' }}>No activity yet. Be the first to respond.</p>
                                                            </div>
                                                        ) : comments[t.id].map(c => {
                                                            const isSelf = c.authorId === user?.id || c.author?.email === user?.email;
                                                            return (
                                                                <div key={c.id} style={{ display: 'flex', gap: '0.75rem', flexDirection: isSelf ? 'row-reverse' : 'row', marginBottom: '0.5rem' }}>
                                                                    <div className="avatar" style={{ width: '32px', height: '32px', fontSize: '0.7rem' }}>
                                                                        {c.authorName?.charAt(0) || 'U'}
                                                                    </div>
                                                                    <div className={`chat-bubble ${isSelf ? 'chat-bubble-self' : 'chat-bubble-other'}`}>
                                                                        <div style={{ fontSize: '0.7rem', marginBottom: '2px', fontWeight: '700', opacity: 0.8 }}>{isSelf ? 'You' : c.authorName}</div>
                                                                        <div>{c.content}</div>
                                                                        <div style={{ fontSize: '0.6rem', marginTop: '0.4rem', opacity: 0.7, textAlign: 'right', fontWeight: '600' }}>
                                                                            {new Date(c.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            );
                                                        })}
                                                    </div>

                                                    <div className="flex gap-2" style={{ background: 'white', padding: '0.4rem', borderRadius: 'var(--radius-full)', border: '1px solid var(--border-color)', boxShadow: 'var(--shadow-md)' }}>
                                                        <input 
                                                            className="p-input" 
                                                            placeholder="Type your response here..." 
                                                            value={newComment}
                                                            onChange={(e) => setNewComment(e.target.value)}
                                                            onKeyDown={(e) => e.key === 'Enter' && handleComment(t.id)}
                                                            style={{ border: 'none', background: 'transparent', flex: 1, padding: '0.6rem 1.25rem', fontSize: '0.9rem' }}
                                                        />
                                                        <button onClick={() => handleComment(t.id)} className="p-btn p-btn-primary" style={{ borderRadius: 'var(--radius-full)', width: '38px', height: '38px', padding: '0', flexShrink: 0 }}>
                                                            <Send size={16} />
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>

                                            <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                                                <div>
                                                    <h4 style={{ fontSize: '0.75rem', fontWeight: '800', textTransform: 'uppercase', color: 'var(--text-tertiary)', letterSpacing: '0.1em', marginBottom: '1rem' }}>Evidence</h4>
                                                    {t.hasAttachments && !t.attachment1 ? (
                                                        <div className="flex items-center gap-3" style={{ color: 'var(--text-tertiary)', background: 'white', padding: '1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
                                                            <Loader2 className="spinner" size={16} />
                                                            <span style={{ fontSize: '0.85rem' }}>Optimizing images...</span>
                                                        </div>
                                                    ) : (
                                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                                                            {[t.attachment1, t.attachment2, t.attachment3].filter(Boolean).map((img, i) => (
                                                                <div key={i} className="ticket-card-modern" style={{ height: '180px', borderRadius: 'var(--radius-md)', cursor: 'zoom-in' }}>
                                                                    <img src={img} alt="Evidence" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                                                </div>
                                                            ))}
                                                            {![t.attachment1, t.attachment2, t.attachment3].filter(Boolean).length && (
                                                                <div style={{ background: 'white', border: '1px dashed var(--border-color)', borderRadius: 'var(--radius-lg)', padding: '2.5rem 1rem', textAlign: 'center', color: 'var(--text-tertiary)' }}>
                                                                    <ImageIcon size={32} style={{ margin: '0 auto 0.75rem', opacity: 0.3 }} />
                                                                    <p style={{ fontSize: '0.8rem', fontStyle: 'italic' }}>No attachments provided.</p>
                                                                </div>
                                                            )}
                                                        </div>
                                                    )}
                                                </div>

                                                {isTech && t.status !== 'RESOLVED' && (
                                                    <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '2rem' }}>
                                                        <h4 style={{ fontSize: '0.75rem', fontWeight: '800', textTransform: 'uppercase', color: 'var(--text-tertiary)', letterSpacing: '0.1em', marginBottom: '1.25rem' }}>Resolution Actions</h4>
                                                        <div className="flex flex-column gap-3">
                                                            <button onClick={() => handleStatus(t.id, 'IN_PROGRESS')} className="p-btn p-btn-secondary w-full" style={{ justifyContent: 'center', gap: '0.75rem', fontWeight: '700' }}>
                                                                <Clock size={18} /> Take Ownership
                                                            </button>
                                                            <button onClick={() => handleStatus(t.id, 'RESOLVED')} className="p-btn p-btn-primary w-full" style={{ background: 'var(--success)', justifyContent: 'center', gap: '0.75rem', fontWeight: '700', boxShadow: '0 8px 15px -3px rgba(16, 185, 129, 0.3)' }}>
                                                                <CheckCircle2 size={18} /> Resolve Ticket
                                                            </button>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
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
