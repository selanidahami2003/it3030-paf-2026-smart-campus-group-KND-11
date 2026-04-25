import React, { useState, useEffect } from 'react';
import api from '../services/api';

const TicketForm = ({ isOpen, onClose, onSuccess }) => {
    const [formData, setFormData] = useState({
        category: 'HARDWARE', 
        description: '', 
        contactDetails: '', 
        priority: 'LOW',
        location: '',
        resourceId: '',
        preferredContactMethod: 'Email'
    });
    const [files, setFiles] = useState([]);
    const [previews, setPreviews] = useState([]);
    const [resources, setResources] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchResources = async () => {
            try {
                const res = await api.get('/resources');
                setResources(res.data);
            } catch (err) {
                console.error("Failed to fetch resources", err);
            }
        };
        if (isOpen) fetchResources();
    }, [isOpen]);

    const handleFileChange = (e) => {
        const selectedFiles = Array.from(e.target.files);
        
        // Validation: Max 3
        if (files.length + selectedFiles.length > 3) {
            setError("Maximum 3 images allowed");
            return;
        }

        // Validation: Only images
        const invalidFiles = selectedFiles.filter(file => !file.type.startsWith('image/'));
        if (invalidFiles.length > 0) {
            setError("Only image files are allowed");
            return;
        }

        setError('');
        const newFiles = [...files, ...selectedFiles];
        setFiles(newFiles);

        // Create previews
        const newPreviews = selectedFiles.map(file => URL.createObjectURL(file));
        setPreviews([...previews, ...newPreviews]);
    };

    const removeFile = (index) => {
        const newFiles = [...files];
        newFiles.splice(index, 1);
        setFiles(newFiles);

        const newPreviews = [...previews];
        URL.revokeObjectURL(newPreviews[index]);
        newPreviews.splice(index, 1);
        setPreviews(newPreviews);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.location || !formData.description || !formData.contactDetails) {
            setError("Please fill all required fields");
            return;
        }

        setLoading(true);
        setError('');
        try {
            // Convert files to base64
            const toBase64 = file => new Promise((resolve, reject) => {
                const reader = new FileReader();
                reader.readAsDataURL(file);
                reader.onload = () => resolve(reader.result);
                reader.onerror = error => reject(error);
            });

            const fileData = await Promise.all(files.map(file => toBase64(file)));

            await api.post('/tickets', {
                ...formData,
                resource: formData.resourceId ? { id: formData.resourceId } : null,
                attachment1: fileData[0] || null,
                attachment2: fileData[1] || null,
                attachment3: fileData[2] || null
            });
            onSuccess();
            onClose();
            // Reset form
            setFormData({ category: 'HARDWARE', description: '', contactDetails: '', priority: 'LOW', location: '', resourceId: '', preferredContactMethod: 'Email' });
            setFiles([]);
            setPreviews([]);
        } catch (err) {
            setError('Failed to submit ticket. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="modal-overlay">
            <div className="modal-content" style={{ maxWidth: '600px' }}>
                <div style={{ padding: '2rem' }}>
                    <div className="flex justify-between items-center mb-6">
                        <h2 style={{ fontSize: '1.5rem' }}>Report an Incident</h2>
                        <button className="p-btn p-btn-secondary" style={{ padding: '0.5rem' }} onClick={onClose} disabled={loading}>
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12"/></svg>
                        </button>
                    </div>

                    {error && <div style={{ backgroundColor: 'rgba(239, 68, 68, 0.1)', color: 'var(--danger)', padding: '0.75rem', borderRadius: 'var(--radius-md)', marginBottom: '1.5rem', fontSize: '0.875rem' }}>{error}</div>}

                    <form onSubmit={handleSubmit}>
                        <div className="grid grid-cols-2 gap-4 mb-4">
                            <div>
                                <label className="p-label">Category *</label>
                                <select className="p-input" value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} disabled={loading}>
                                    <option value="HARDWARE">Hardware Issue</option>
                                    <option value="SOFTWARE">Software Issue</option>
                                    <option value="NETWORK">Network Issue</option>
                                    <option value="FACILITY">Facility Damage</option>
                                </select>
                            </div>
                            <div>
                                <label className="p-label">Priority *</label>
                                <select className="p-input" value={formData.priority} onChange={e => setFormData({...formData, priority: e.target.value})} disabled={loading}>
                                    <option value="LOW">Low</option>
                                    <option value="MEDIUM">Medium</option>
                                    <option value="HIGH">High</option>
                                    <option value="URGENT">Urgent</option>
                                </select>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4 mb-4">
                            <div>
                                <label className="p-label">Location *</label>
                                <input type="text" className="p-input" value={formData.location} onChange={e => setFormData({...formData, location: e.target.value})} placeholder="e.g., Lab 01, Room 202" disabled={loading} required />
                            </div>
                            <div>
                                <label className="p-label">Resource (Optional)</label>
                                <select className="p-input" value={formData.resourceId} onChange={e => setFormData({...formData, resourceId: e.target.value})} disabled={loading}>
                                    <option value="">None / General</option>
                                    {resources.map(r => (
                                        <option key={r.id} value={r.id}>{r.name}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div className="mb-4">
                            <label className="p-label">Description *</label>
                            <textarea className="p-input" rows="4" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} required placeholder="Describe the issue in detail..." disabled={loading}></textarea>
                        </div>

                        <div className="grid grid-cols-2 gap-4 mb-6">
                            <div>
                                <label className="p-label">Contact Method *</label>
                                <select className="p-input" value={formData.preferredContactMethod} onChange={e => setFormData({...formData, preferredContactMethod: e.target.value})} disabled={loading}>
                                    <option value="Email">Email</option>
                                    <option value="Phone">Phone</option>
                                </select>
                            </div>
                            <div>
                                <label className="p-label">Contact Details *</label>
                                <input type="text" className="p-input" value={formData.contactDetails} onChange={e => setFormData({...formData, contactDetails: e.target.value})} required placeholder="Phone or alternate email" disabled={loading} />
                            </div>
                        </div>

                        <div className="mb-6">
                            <label className="p-label">Evidence (Photos - Max 3)</label>
                            <div className="flex flex-col gap-4">
                                <div style={{ 
                                    border: '2px dashed var(--border-color)', 
                                    borderRadius: 'var(--radius-md)', 
                                    padding: '1.25rem', 
                                    textAlign: 'center',
                                    position: 'relative',
                                    cursor: 'pointer',
                                    transition: 'all 0.2s',
                                    backgroundColor: 'var(--surface-color-light)'
                                }} onMouseOver={e => e.currentTarget.style.borderColor = 'var(--primary)'} onMouseOut={e => e.currentTarget.style.borderColor = 'var(--border-color)'}>
                                    <input type="file" onChange={handleFileChange} accept="image/*" multiple style={{ position: 'absolute', inset: 0, opacity: 0, cursor: 'pointer' }} disabled={loading || files.length >= 3} />
                                    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ color: 'var(--text-secondary)', marginBottom: '0.5rem' }}><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
                                    <p className="text-sm font-bold">Click or drag images to upload</p>
                                    <p className="text-xs text-secondary mt-1">PNG, JPG up to 10MB (Max 3)</p>
                                </div>

                                {previews.length > 0 && (
                                    <div className="flex gap-3">
                                        {previews.map((src, idx) => (
                                            <div key={idx} style={{ position: 'relative', width: '80px', height: '80px', borderRadius: 'var(--radius-md)', overflow: 'hidden', border: '1px solid var(--border-color)' }}>
                                                <img src={src} alt="preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                                <button type="button" onClick={() => removeFile(idx)} style={{ position: 'absolute', top: '4px', right: '4px', background: 'rgba(0,0,0,0.5)', color: 'white', border: 'none', borderRadius: '50%', width: '20px', height: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                                                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12"/></svg>
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="flex justify-end gap-4">
                            <button type="button" className="p-btn p-btn-secondary" onClick={onClose} disabled={loading}>Cancel</button>
                            <button type="submit" className="p-btn p-btn-primary" disabled={loading}>
                                {loading ? (
                                    <div className="flex items-center gap-2">
                                        <div style={{ width: '16px', height: '16px', border: '2px solid white', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
                                        Submitting...
                                    </div>
                                ) : 'Submit Ticket'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
            <style>{`
                @keyframes spin { to { transform: rotate(360deg); } }
            `}</style>
        </div>
    );
};

export default TicketForm;

