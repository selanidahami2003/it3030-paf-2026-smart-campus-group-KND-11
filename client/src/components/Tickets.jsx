import React, { useState, useEffect, useContext } from 'react';
import api from '../services/api';
import { AuthContext } from '../context/AuthContext';
import TicketForm from './TicketForm';
import TicketDetails from './TicketDetails';

const Tickets = () => {
    const { user } = useContext(AuthContext);
    const [tickets, setTickets] = useState([]);
    const [filteredTickets, setFilteredTickets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [selectedTicketId, setSelectedTicketId] = useState(null);
    
    // Filters
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState('ALL');
    const [priorityFilter, setPriorityFilter] = useState('ALL');
    const [categoryFilter, setCategoryFilter] = useState('ALL');

    const fetchTickets = async () => {
        try {
            setLoading(true);
            const url = user.role === 'ADMIN' || user.role === 'TECHNICIAN' ? '/tickets' : '/tickets/my';
            const res = await api.get(url);
            setTickets(res.data);
            setFilteredTickets(res.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (user) {
            fetchTickets();
        }
    }, [user]);

    useEffect(() => {
        let result = tickets;

        if (searchQuery) {
            result = result.filter(t => 
                t.id.toLowerCase().includes(searchQuery.toLowerCase()) || 
                t.description.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }

        if (statusFilter !== 'ALL') {
            result = result.filter(t => t.status === statusFilter);
        }

        if (priorityFilter !== 'ALL') {
            result = result.filter(t => t.priority === priorityFilter);
        }

        if (categoryFilter !== 'ALL') {
            result = result.filter(t => t.category === categoryFilter);
        }

        setFilteredTickets(result);
    }, [searchQuery, statusFilter, priorityFilter, categoryFilter, tickets]);

    const handleDeleteTicket = async (id) => {
        if (!window.confirm('Are you sure you want to permanently delete this incident report?')) return;
        try {
            await api.delete(`/tickets/${id}`);
            fetchTickets();
        } catch (err) {
            console.error("Failed to delete ticket", err);
            alert("Could not delete ticket. Please try again.");
        }
    };

    const getStatusBadgeClass = (status) => {
        switch (status) {
            case 'OPEN': return 'badge-status-open';
            case 'IN_PROGRESS': return 'badge-status-progress';
            case 'RESOLVED': return 'badge-status-resolved';
            case 'CLOSED': return 'badge-status-closed';
            case 'REJECTED': return 'badge-status-rejected';
            default: return '';
        }
    };

    const getPriorityBadgeClass = (priority) => {
        switch (priority) {
            case 'LOW': return 'badge-priority-low';
            case 'MEDIUM': return 'badge-priority-medium';
            case 'HIGH': return 'badge-priority-high';
            case 'URGENT': return 'badge-priority-urgent';
            default: return '';
        }
    };

    if (!user) return <div className="p-card text-center py-12">Please login to view tickets.</div>;

    return (
        <div className="fade-in">
            <div className="flex justify-between items-end mb-8 flex-wrap gap-4">
                <div>
                    <h2 style={{ fontSize: '2rem', marginBottom: '0.25rem' }}>Service Desk</h2>
                    <p className="text-secondary">Track and manage campus-wide incidents and support requests.</p>
                </div>
                <button className="p-btn p-btn-primary" onClick={() => setIsFormOpen(true)}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ marginRight: '0.5rem' }}><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                    Report Incident
                </button>
            </div>

            <div className="p-card mb-8" style={{ padding: '1.25rem' }}>
                <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
                    <div className="flex flex-col">
                        <label className="text-xs font-bold text-secondary uppercase mb-2">Search</label>
                        <input type="text" className="p-input" style={{ padding: '0.5rem 1rem' }} placeholder="Ticket ID or Keyword..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} />
                    </div>
                    <div className="flex flex-col">
                        <label className="text-xs font-bold text-secondary uppercase mb-2">Status</label>
                        <select className="p-input" style={{ padding: '0.5rem 1rem' }} value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
                            <option value="ALL">All Statuses</option>
                            <option value="OPEN">Open</option>
                            <option value="IN_PROGRESS">In Progress</option>
                            <option value="RESOLVED">Resolved</option>
                            <option value="CLOSED">Closed</option>
                            <option value="REJECTED">Rejected</option>
                        </select>
                    </div>
                    <div className="flex flex-col">
                        <label className="text-xs font-bold text-secondary uppercase mb-2">Priority</label>
                        <select className="p-input" style={{ padding: '0.5rem 1rem' }} value={priorityFilter} onChange={e => setPriorityFilter(e.target.value)}>
                            <option value="ALL">All Priorities</option>
                            <option value="LOW">Low</option>
                            <option value="MEDIUM">Medium</option>
                            <option value="HIGH">High</option>
                            <option value="URGENT">Urgent</option>
                        </select>
                    </div>
                    <div className="flex flex-col">
                        <label className="text-xs font-bold text-secondary uppercase mb-2">Category</label>
                        <select className="p-input" style={{ padding: '0.5rem 1rem' }} value={categoryFilter} onChange={e => setCategoryFilter(e.target.value)}>
                            <option value="ALL">All Categories</option>
                            <option value="HARDWARE">Hardware</option>
                            <option value="SOFTWARE">Software</option>
                            <option value="NETWORK">Network</option>
                            <option value="FACILITY">Facility</option>
                        </select>
                    </div>
                </div>
            </div>

            <TicketForm isOpen={isFormOpen} onClose={() => setIsFormOpen(false)} onSuccess={fetchTickets} />
            {selectedTicketId && <TicketDetails ticketId={selectedTicketId} onClose={() => setSelectedTicketId(null)} onUpdate={fetchTickets} />}

            <div className="grid" style={{ gap: '1rem' }}>
                {loading ? (
                    [1, 2, 3].map(i => <div key={i} className="skeleton skeleton-card"></div>)
                ) : filteredTickets.length === 0 ? (
                    <div className="p-card text-center py-12">
                        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" style={{ color: 'var(--text-secondary)', marginBottom: '1rem', opacity: 0.5 }}><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                        <h3 className="text-secondary">No tickets found matching your filters.</h3>
                    </div>
                ) : (
                    filteredTickets.map(t => (
                        <div key={t.id} className={`p-card ticket-card priority-${t.priority.toLowerCase()}`} 
                             style={{ padding: '1.25rem', cursor: 'pointer' }}
                             onClick={() => setSelectedTicketId(t.id)}>
                            <div className="flex justify-between items-start mb-4">
                                <div className="flex flex-col gap-1">
                                    <div className="flex items-center gap-2 mb-1">
                                        <span className="text-xs font-bold text-secondary">#{t.id}</span>
                                        <span className="text-xs text-secondary">•</span>
                                        <span className="text-xs text-secondary font-bold uppercase">{t.category}</span>
                                    </div>
                                    <h3 style={{ fontSize: '1.125rem' }} className="truncate">{t.description.substring(0, 80)}{t.description.length > 80 ? '...' : ''}</h3>
                                </div>
                                <div className="flex flex-col items-end gap-2">
                                    <div className="flex items-center gap-2">
                                        <span className={`badge ${getStatusBadgeClass(t.status)}`}>{t.status}</span>
                                        <span className={`badge ${getPriorityBadgeClass(t.priority)}`}>{t.priority}</span>
                                        {(user.role === 'ADMIN' || t.creator?.id === user.id) && (
                                            <button 
                                                className="p-btn p-btn-secondary" 
                                                style={{ padding: '0', width: '28px', height: '28px', color: 'var(--danger)', border: 'none', background: 'rgba(239, 68, 68, 0.05)' }}
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleDeleteTicket(t.id);
                                                }}
                                            >
                                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M10 11v6M14 11v6"/></svg>
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                            
                            <div className="flex justify-between items-center mt-6 pt-4" style={{ borderTop: '1px solid var(--border-color)' }}>
                                <div className="flex items-center gap-4">
                                    <div className="flex items-center gap-1 text-xs text-secondary">
                                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                                        <span>{t.creator?.name || 'Unknown'}</span>
                                    </div>
                                    <div className="flex items-center gap-1 text-xs text-secondary">
                                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
                                        <span>{new Date(t.createdAt).toLocaleDateString()}</span>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    {(t.attachment1 || t.attachment2 || t.attachment3) && (
                                        <div className="flex items-center gap-1 text-xs text-secondary" title="Attachments">
                                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"/></svg>
                                            <span>{[t.attachment1, t.attachment2, t.attachment3].filter(Boolean).length}</span>
                                        </div>
                                    )}
                                    {/* Since comment count isn't in the model, I'll show a placeholder or skip if not available */}
                                    <div className="flex items-center gap-1 text-xs text-secondary" title="Comments">
                                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
                                        <span>Click to view</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default Tickets;

