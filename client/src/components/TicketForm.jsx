import React, { useState, useContext } from 'react';
import api from '../services/api';
import { AuthContext } from '../context/AuthContext';

const TicketForm = ({ isOpen, onClose, onSuccess }) => {
    const { user } = useContext(AuthContext);
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

        const phoneRegex = /^\d{10}$/;
        const gmailRegex = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;

        if (contactType === 'phone') {
            if (!phoneRegex.test(formData.contactDetails)) {
                setContactError('Phone number must be exactly 10 digits (e.g., 0712345678).');
                return;
            }
        } else {
            if (!gmailRegex.test(formData.contactDetails)) {
                setContactError('Please enter a valid Gmail address (e.g., name@gmail.com).');
                return;
            }
        }
        setContactError('');

        try {
            // Convert each selected photo to base64 data URL
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
            backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex',
            alignItems: 'flex-start', justifyContent: 'center', zIndex: 1000,
            backdropFilter: 'blur(4px)', paddingTop: '80px', overflowY: 'auto'
        }}>
            <div className="p-card" style={{ width: '450px', maxWidth: '90%' }}>
                <h2 className="mb-4">Report an Incident</h2>
                <form onSubmit={handleSubmit}>
                    <div className="mb-4 flex gap-4">
                        <div className="w-full">
                            <label className="p-label">Category</label>
                            <select className="p-input" value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})}>
                                <option value="HARDWARE">Hardware Issue</option>
                                <option value="SOFTWARE">Software Issue</option>
                                <option value="NETWORK">Network Issue</option>
                                <option value="FACILITY">Facility Damage</option>
                            </select>
                        </div>
                        <div className="w-full">
                            <label className="p-label">Priority</label>
                            <select className="p-input" value={formData.priority} onChange={e => setFormData({...formData, priority: e.target.value})}>
                                <option value="LOW">Low</option>
                                <option value="MEDIUM">Medium</option>
                                <option value="HIGH">High</option>
                                <option value="URGENT">Urgent</option>
                            </select>
                        </div>
                    </div>

                    <div className="mb-4">
                        <label className="p-label">Description</label>
                        <textarea className="p-input" rows="4" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} required placeholder="Describe the issue in detail..."></textarea>
                    </div>

                    <div className="mb-4">
                        <label className="p-label">Contact Details</label>
                        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem' }}>
                            <button
                                type="button"
                                onClick={() => { setContactType('phone'); setFormData({...formData, contactDetails: ''}); setContactError(''); }}
                                style={{
                                    flex: 1, padding: '6px 10px', borderRadius: '6px', cursor: 'pointer', fontSize: '0.85rem', fontWeight: '600', transition: 'all 0.2s',
                                    background: contactType === 'phone' ? 'var(--primary)' : 'transparent',
                                    color: contactType === 'phone' ? 'white' : 'var(--text-secondary)',
                                    border: contactType === 'phone' ? '1px solid var(--primary)' : '1px solid var(--border-color)'
                                }}
                            >📞 Phone</button>
                            <button
                                type="button"
                                onClick={() => { setContactType('email'); setFormData({...formData, contactDetails: ''}); setContactError(''); }}
                                style={{
                                    flex: 1, padding: '6px 10px', borderRadius: '6px', cursor: 'pointer', fontSize: '0.85rem', fontWeight: '600', transition: 'all 0.2s',
                                    background: contactType === 'email' ? 'var(--primary)' : 'transparent',
                                    color: contactType === 'email' ? 'white' : 'var(--text-secondary)',
                                    border: contactType === 'email' ? '1px solid var(--primary)' : '1px solid var(--border-color)'
                                }}
                            >✉️ Gmail</button>
                        </div>

                        {contactType === 'phone' ? (
                            <input
                                type="text"
                                className="p-input"
                                value={formData.contactDetails}
                                onChange={e => {
                                    const value = e.target.value.replace(/\D/g, '');
                                    if (value.length <= 10) {
                                        setFormData({...formData, contactDetails: value});
                                        setContactError(value.length > 0 && value.length < 10 ? 'Phone number must be exactly 10 digits.' : '');
                                    }
                                }}
                                required
                                placeholder="10-digit phone number (e.g., 0712345678)"
                                maxLength={10}
                            />
                        ) : (
                            <input
                                type="email"
                                className="p-input"
                                value={formData.contactDetails}
                                onChange={e => {
                                    const value = e.target.value;
                                    setFormData({...formData, contactDetails: value});
                                    if (value && !value.endsWith('@gmail.com')) {
                                        setContactError('Only Gmail addresses are allowed (e.g., name@gmail.com).');
                                    } else {
                                        setContactError('');
                                    }
                                }}
                                required
                                placeholder="yourname@gmail.com"
                            />
                        )}
                        {contactError && (
                            <small style={{ color: 'var(--danger)', marginTop: '4px', display: 'block' }}>{contactError}</small>
                        )}
                    </div>

                    <div className="mb-4">
                        <label className="p-label">Evidence (Photos - Max 3)</label>
                        <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.5rem' }}>
                            {[0, 1, 2].map((index) => (
                                <div key={index} style={{ flex: 1 }}>
                                    <input
                                        id={`photo-upload-${index}`}
                                        type="file"
                                        accept="image/*"
                                        style={{ display: 'none' }}
                                        onChange={(e) => {
                                            const file = e.target.files[0];
                                            if (file) setFileAtIndex(index, file);
                                            e.target.value = '';
                                        }}
                                    />
                                    <div
                                        onClick={() => document.getElementById(`photo-upload-${index}`).click()}
                                        style={{
                                            width: '100%',
                                            height: '90px',
                                            borderRadius: '8px',
                                            border: files[index] ? '2px solid var(--primary)' : '2px dashed var(--border-color)',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            cursor: 'pointer',
                                            overflow: 'hidden',
                                            background: 'var(--bg-color)',
                                            position: 'relative',
                                            transition: 'border-color 0.2s'
                                        }}
                                        onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--primary)'}
                                        onMouseLeave={e => e.currentTarget.style.borderColor = files[index] ? 'var(--primary)' : 'var(--border-color)'}
                                    >
                                        {files[index] ? (
                                            <>
                                                <img
                                                    src={URL.createObjectURL(files[index])}
                                                    alt={`preview-${index}`}
                                                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                                />
                                                <button
                                                    type="button"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        setFileAtIndex(index, undefined);
                                                    }}
                                                    style={{
                                                        position: 'absolute', top: '4px', right: '4px',
                                                        background: 'rgba(0,0,0,0.6)', color: 'white',
                                                        border: 'none', borderRadius: '50%',
                                                        width: '20px', height: '20px',
                                                        cursor: 'pointer', fontSize: '12px',
                                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                        fontWeight: 'bold'
                                                    }}
                                                >✕</button>
                                            </>
                                        ) : (
                                            <div style={{ textAlign: 'center', color: 'var(--text-secondary)', pointerEvents: 'none' }}>
                                                <div style={{ fontSize: '1.5rem' }}>📷</div>
                                                <div style={{ fontSize: '0.7rem', marginTop: '2px' }}>Photo {index + 1}</div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                        <small style={{ color: 'var(--text-secondary)', display: 'block', marginTop: '0.4rem' }}>
                            Click each slot to add a photo (optional)
                        </small>
                    </div>

                    <div className="flex justify-between gap-4 mt-4">
                        <button type="button" className="p-btn p-btn-secondary w-full" onClick={() => { resetForm(); onClose(); }}>Cancel</button>
                        <button type="submit" className="p-btn p-btn-primary w-full">Submit Ticket</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default TicketForm;
