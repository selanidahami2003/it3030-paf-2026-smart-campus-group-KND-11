import React, { useState, useContext } from 'react';
import api from '../services/api';
import { AuthContext } from '../context/AuthContext';
import { 
    X, 
    AlertCircle, 
    Phone, 
    Mail, 
    Camera, 
    Type, 
    FileText, 
    Loader2,
    ShieldAlert
} from 'lucide-react';

const TicketForm = ({ isOpen, onClose, onSuccess }) => {
    const { user } = useContext(AuthContext);
    const [submitting, setSubmitting] = useState(false);
    const [formData, setFormData] = useState({
        category: 'HARDWARE', description: '', contactDetails: '', priority: 'LOW'
    });
    const [files, setFiles] = useState([undefined, undefined, undefined]);
    const [contactType, setContactType] = useState('phone');
    const [contactError, setContactError] = useState('');

    const resetForm = () => {
        setFormData({ category: 'HARDWARE', description: '', contactDetails: '', priority: 'LOW' });
        setFiles([undefined, undefined, undefined]);
        setContactType('phone');
        setContactError('');
    };

    if (!isOpen) return null;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);

        const phoneRegex = /^\d{10}$/;
        const gmailRegex = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;

        if (contactType === 'phone') {
            if (!phoneRegex.test(formData.contactDetails)) {
                setContactError('Phone number must be exactly 10 digits.');
                setSubmitting(false);
                return;
            }
        } else {
            if (!gmailRegex.test(formData.contactDetails)) {
                setContactError('Please enter a valid Gmail address.');
                setSubmitting(false);
                return;
            }
        }

        try {
            const toBase64 = (file) => new Promise((resolve, reject) => {
                if (!file) return resolve(null);
                const reader = new FileReader();
                reader.onload = () => resolve(reader.result);
                reader.onerror = reject;
                reader.readAsDataURL(file);
            });

            const [f1, f2, f3] = await Promise.all([
                toBase64(files[0]),
                toBase64(files[1]),
                toBase64(files[2])
            ]);

            await api.post('/tickets', {
                ...formData,
                attachment1: f1,
                attachment2: f2,
                attachment3: f3,
                reporterName: user?.name || 'Unknown'
            });
            resetForm();
            onSuccess();
            onClose();
        } catch (err) {
            console.error(err);
            alert('Failed to submit ticket');
        } finally {
            setSubmitting(false);
        }
    };

    const setFileAtIndex = (index, file) => {
        setFiles(prev => {
            const updated = [...prev];
            updated[index] = file;
            return updated;
        });
    };

    return (
        <div style={{
            position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.6)', display: 'flex',
            alignItems: 'center', justifyContent: 'center', zIndex: 1000,
            backdropFilter: 'blur(8px)', padding: '20px', overflowY: 'auto'
        }}>
            <div className="p-card" style={{ width: '550px', maxWidth: '100%', position: 'relative', overflow: 'hidden' }}>
                <button onClick={onClose} style={{ position: 'absolute', right: '1.5rem', top: '1.5rem', background: 'none', border: 'none', color: 'var(--text-tertiary)', cursor: 'pointer' }}>
                    <X size={20} />
                </button>
                
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
                    <div style={{ width: '48px', height: '48px', background: 'rgba(31, 122, 90, 0.1)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)' }}>
                        <ShieldAlert size={24} />
                    </div>
                    <div>
                        <h2 style={{ fontSize: '1.25rem', fontWeight: '800', margin: 0 }}>Report an Incident</h2>
                        <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', margin: 0 }}>Provide details about the issue you encountered.</p>
                    </div>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="flex gap-4 mb-4">
                        <div style={{ flex: 1 }}>
                            <label className="p-label">Issue Category</label>
                            <div className="floating-group">
                                <AlertCircle className="input-icon-left" size={18} />
                                <select className="p-input p-input-with-icon" value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})}>
                                    <option value="HARDWARE">Hardware</option>
                                    <option value="SOFTWARE">Software</option>
                                    <option value="NETWORK">Network</option>
                                    <option value="FACILITY">Facility</option>
                                </select>
                            </div>
                        </div>
                        <div style={{ flex: 1 }}>
                            <label className="p-label">System Priority</label>
                            <div className="floating-group">
                                <ShieldAlert className="input-icon-left" size={18} />
                                <select className="p-input p-input-with-icon" value={formData.priority} onChange={e => setFormData({...formData, priority: e.target.value})}>
                                    <option value="LOW">Low</option>
                                    <option value="MEDIUM">Medium</option>
                                    <option value="HIGH">High</option>
                                    <option value="URGENT">Urgent</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    <div className="mb-6">
                        <label className="p-label">Incident Description</label>
                        <div className="floating-group">
                            <FileText className="input-icon-left" size={18} style={{ top: '1.5rem', transform: 'none' }} />
                            <textarea 
                                className="p-input p-input-with-icon" 
                                rows="3" 
                                value={formData.description} 
                                onChange={e => setFormData({...formData, description: e.target.value})} 
                                required 
                                placeholder="E.g. The projector in Lab A is not powering on..."
                                style={{ minHeight: '100px' }}
                            ></textarea>
                        </div>
                    </div>

                    <div className="mb-6">
                        <label className="p-label">How should we contact you?</label>
                        <div className="segmented-control">
                            <div className={`segmented-option ${contactType === 'phone' ? 'active' : ''}`} onClick={() => { setContactType('phone'); setFormData({...formData, contactDetails: ''}); setContactError(''); }}>
                                <Phone size={14} style={{ marginRight: '6px', verticalAlign: 'middle' }} /> Phone
                            </div>
                            <div className={`segmented-option ${contactType === 'email' ? 'active' : ''}`} onClick={() => { setContactType('email'); setFormData({...formData, contactDetails: ''}); setContactError(''); }}>
                                <Mail size={14} style={{ marginRight: '6px', verticalAlign: 'middle' }} /> Gmail
                            </div>
                        </div>

                        <div className="floating-group">
                            {contactType === 'phone' ? <Phone className="input-icon-left" size={18} /> : <Mail className="input-icon-left" size={18} />}
                            <input
                                type={contactType === 'phone' ? 'text' : 'email'}
                                className="p-input p-input-with-icon"
                                value={formData.contactDetails}
                                onChange={e => {
                                    const value = contactType === 'phone' ? e.target.value.replace(/\D/g, '') : e.target.value;
                                    if (contactType === 'phone' && value.length > 10) return;
                                    setFormData({...formData, contactDetails: value});
                                    setContactError('');
                                }}
                                required
                                placeholder={contactType === 'phone' ? '10-digit number (e.g. 0712345678)' : 'your.name@gmail.com'}
                            />
                        </div>
                        {contactError && <p style={{ color: 'var(--danger)', fontSize: '0.75rem', marginTop: '0.5rem', fontWeight: '500' }}>{contactError}</p>}
                    </div>

                    <div className="mb-4">
                        <label className="p-label">Evidence Photos (Max 3)</label>
                        <div style={{ display: 'flex', gap: '1rem' }}>
                            {[0, 1, 2].map((i) => (
                                <div key={i} style={{ flex: 1 }}>
                                    <input id={`f-${i}`} type="file" style={{ display: 'none' }} accept="image/*" onChange={(e) => setFileAtIndex(i, e.target.files[0])} />
                                    <div 
                                        onClick={() => document.getElementById(`f-${i}`).click()}
                                        className="ticket-card-modern"
                                        style={{ height: '80px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--surface-color-light)', borderStyle: 'dashed' }}
                                    >
                                        {files[i] ? (
                                            <div style={{ position: 'relative', width: '100%', height: '100%' }}>
                                                <img src={URL.createObjectURL(files[i])} alt="p" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                                <button type="button" onClick={(e) => { e.stopPropagation(); setFileAtIndex(i, undefined); }} style={{ position: 'absolute', top: '2px', right: '2px', background: 'rgba(0,0,0,0.5)', color: 'white', border: 'none', borderRadius: '50%', width: '18px', height: '18px', fontSize: '10px' }}>✕</button>
                                            </div>
                                        ) : (
                                            <Camera size={20} color="var(--text-tertiary)" />
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="flex gap-4 mt-8">
                        <button type="button" className="p-btn" style={{ flex: 1, background: 'var(--surface-color-light)', color: 'var(--text-secondary)' }} onClick={onClose}>
                            Cancel
                        </button>
                        <button type="submit" className="p-btn p-btn-primary" style={{ flex: 2, gap: '0.75rem' }} disabled={submitting}>
                            {submitting ? <Loader2 className="spinner" size={20} /> : 'Submit Ticket'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default TicketForm;
