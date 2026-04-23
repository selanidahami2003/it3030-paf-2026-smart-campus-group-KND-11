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
    ShieldAlert,
    Send
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
                reader.onload = (e) => {
                    const img = new Image();
                    img.onload = () => {
                        const canvas = document.createElement('canvas');
                        let width = img.width;
                        let height = img.height;
                        
                        // Max dimension 1200px
                        const MAX_SIZE = 1200;
                        if (width > height) {
                            if (width > MAX_SIZE) {
                                height *= MAX_SIZE / width;
                                width = MAX_SIZE;
                            }
                        } else {
                            if (height > MAX_SIZE) {
                                width *= MAX_SIZE / height;
                                height = MAX_SIZE;
                            }
                        }
                        
                        canvas.width = width;
                        canvas.height = height;
                        const ctx = canvas.getContext('2d');
                        ctx.drawImage(img, 0, 0, width, height);
                        
                        // Compress to 0.7 quality
                        const dataUrl = canvas.toDataURL('image/jpeg', 0.7);
                        resolve(dataUrl);
                    };
                    img.onerror = reject;
                    img.src = e.target.result;
                };
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
            const errorMsg = err.response?.data?.message || err.message || 'Unknown error';
            alert(`Failed to submit ticket: ${errorMsg}`);
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
            backgroundColor: 'rgba(15, 23, 42, 0.6)', display: 'flex',
            alignItems: 'center', justifyContent: 'center', zIndex: 1000,
            backdropFilter: 'blur(12px)', padding: '20px', overflowY: 'auto'
        }}>
            <div className="p-card fade-in-up" style={{ width: '600px', maxWidth: '100%', position: 'relative', overflow: 'hidden', padding: 0, border: 'none', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)' }}>
                {/* Header Gradient Decor */}
                <div style={{ height: '6px', background: 'var(--primary)', width: '100%' }} />
                
                <button onClick={onClose} style={{ position: 'absolute', right: '1.5rem', top: '1.5rem', background: 'rgba(0,0,0,0.05)', border: 'none', color: 'var(--text-tertiary)', cursor: 'pointer', width: '32px', height: '32px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s' }} onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(0,0,0,0.1)'} onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(0,0,0,0.05)'}>
                    <X size={18} />
                </button>
                
                <div style={{ padding: '2.5rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', marginBottom: '2.5rem' }}>
                        <div style={{ width: '56px', height: '56px', background: 'rgba(31, 122, 90, 0.1)', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)', boxShadow: 'inset 0 2px 4px rgba(31, 122, 90, 0.1)' }}>
                            <ShieldAlert size={28} />
                        </div>
                        <div>
                            <h2 style={{ fontSize: '1.5rem', fontWeight: '800', margin: 0, letterSpacing: '-0.02em' }}>Report an Incident</h2>
                            <p style={{ fontSize: '0.95rem', color: 'var(--text-secondary)', margin: '0.25rem 0 0' }}>Provide specific details to help us resolve it quickly.</p>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit}>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '1.5rem' }}>
                            <div>
                                <label className="p-label" style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Issue Category</label>
                                <div className="floating-group">
                                    <AlertCircle className="input-icon-left" size={18} />
                                    <select className="p-input p-input-with-icon" value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} style={{ background: 'var(--surface-color-light)', border: '1px solid var(--border-color)', height: '52px' }}>
                                        <option value="HARDWARE">Hardware Issue</option>
                                        <option value="SOFTWARE">Software Issue</option>
                                        <option value="NETWORK">Network Connectivity</option>
                                        <option value="FACILITY">Facility / Infrastructure</option>
                                    </select>
                                </div>
                            </div>
                            <div>
                                <label className="p-label" style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Urgency Level</label>
                                <div className="floating-group">
                                    <ShieldAlert className="input-icon-left" size={18} />
                                    <select className="p-input p-input-with-icon" value={formData.priority} onChange={e => setFormData({...formData, priority: e.target.value})} style={{ background: 'var(--surface-color-light)', border: '1px solid var(--border-color)', height: '52px' }}>
                                        <option value="LOW">Low - Minimal Impact</option>
                                        <option value="MEDIUM">Medium - Functional Issue</option>
                                        <option value="HIGH">High - Urgent Attention</option>
                                        <option value="URGENT">Critical - Immediate Action</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        <div className="mb-6">
                            <label className="p-label" style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Incident Description</label>
                            <div className="floating-group">
                                <FileText className="input-icon-left" size={18} style={{ top: '1.25rem', transform: 'none' }} />
                                <textarea 
                                    className="p-input p-input-with-icon" 
                                    rows="4" 
                                    value={formData.description} 
                                    onChange={e => setFormData({...formData, description: e.target.value})} 
                                    required 
                                    placeholder="Describe what happened, where, and any error messages seen..."
                                    style={{ minHeight: '120px', background: 'var(--surface-color-light)', border: '1px solid var(--border-color)', paddingTop: '1rem' }}
                                ></textarea>
                            </div>
                        </div>

                        <div className="mb-6" style={{ background: 'var(--surface-color-light)', padding: '1.25rem', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-color)' }}>
                            <label className="p-label" style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '1rem' }}>Contact Preference</label>
                            <div className="segmented-control" style={{ background: 'rgba(0,0,0,0.05)', marginBottom: '1rem' }}>
                                <div className={`segmented-option ${contactType === 'phone' ? 'active' : ''}`} onClick={() => { setContactType('phone'); setFormData({...formData, contactDetails: ''}); setContactError(''); }}>
                                    <Phone size={14} style={{ marginRight: '6px', verticalAlign: 'middle' }} /> Phone Call
                                </div>
                                <div className={`segmented-option ${contactType === 'email' ? 'active' : ''}`} onClick={() => { setContactType('email'); setFormData({...formData, contactDetails: ''}); setContactError(''); }}>
                                    <Mail size={14} style={{ marginRight: '6px', verticalAlign: 'middle' }} /> Gmail / Inbox
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
                                    placeholder={contactType === 'phone' ? 'Enter 10-digit phone number' : 'Enter your gmail address'}
                                    style={{ background: 'white' }}
                                />
                            </div>
                            {contactError && <p style={{ color: 'var(--danger)', fontSize: '0.75rem', marginTop: '0.5rem', fontWeight: '600' }}>{contactError}</p>}
                        </div>

                        <div className="mb-8">
                            <label className="p-label" style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '1rem' }}>Visual Evidence (Up to 3 photos)</label>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem' }}>
                                {[0, 1, 2].map((i) => (
                                    <div key={i}>
                                        <input id={`f-${i}`} type="file" style={{ display: 'none' }} accept="image/*" onChange={(e) => setFileAtIndex(i, e.target.files[0])} />
                                        <div 
                                            onClick={() => document.getElementById(`f-${i}`).click()}
                                            className="ticket-card-modern"
                                            style={{ height: '90px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: files[i] ? 'white' : 'rgba(0,0,0,0.02)', border: files[i] ? '1px solid var(--primary)' : '1px dashed var(--border-color)', borderRadius: 'var(--radius-md)' }}
                                        >
                                            {files[i] ? (
                                                <div style={{ position: 'relative', width: '100%', height: '100%' }}>
                                                    <img src={URL.createObjectURL(files[i])} alt="preview" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 'calc(var(--radius-md) - 1px)' }} />
                                                    <button type="button" onClick={(e) => { e.stopPropagation(); setFileAtIndex(i, undefined); }} style={{ position: 'absolute', top: '-8px', right: '-8px', background: 'var(--danger)', color: 'white', border: 'none', borderRadius: '50%', width: '22px', height: '22px', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: 'var(--shadow-sm)' }}>
                                                        <X size={12} strokeWidth={3} />
                                                    </button>
                                                </div>
                                            ) : (
                                                <div style={{ textAlign: 'center' }}>
                                                    <Camera size={20} color="var(--text-tertiary)" />
                                                    <span style={{ display: 'block', fontSize: '0.65rem', color: 'var(--text-tertiary)', marginTop: '4px', fontWeight: '700' }}>PHOTO {i+1}</span>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="flex gap-4" style={{ marginTop: '2rem' }}>
                            <button type="button" className="p-btn" style={{ flex: 1, background: 'var(--surface-color-light)', color: 'var(--text-secondary)', borderRadius: 'var(--radius-lg)' }} onClick={onClose}>
                                Discard
                            </button>
                            <button type="submit" className="p-btn p-btn-primary" style={{ flex: 2, gap: '0.75rem', borderRadius: 'var(--radius-lg)', height: '52px', fontSize: '1.05rem', boxShadow: '0 10px 20px -5px rgba(31, 122, 90, 0.4)' }} disabled={submitting}>
                                {submitting ? <Loader2 className="spinner" size={20} /> : (
                                    <>
                                        <span>Submit Incident Report</span>
                                        <Send size={18} />
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default TicketForm;
