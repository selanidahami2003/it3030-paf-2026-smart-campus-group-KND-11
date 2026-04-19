import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { AuthContext } from '../context/AuthContext';
import { Calendar, Clock, ArrowLeft, CheckCircle, AlertCircle, BookOpen } from 'lucide-react';

const RESOURCE_OPTIONS = [
    'Lecture Hall A',
    'Lecture Hall B',
    'Computer Lab 1',
    'Computer Lab 2',
    'Science Lab',
    'Meeting Room',
    'Auditorium',
    'Sports Hall',
    'Projector',
    'Camera Equipment',
    'Other',
];

const CreateBooking = () => {
    const navigate = useNavigate();
    const { user } = useContext(AuthContext);

    const [formData, setFormData] = useState({
        resourceName: '',
        customResource: '',
        startTime: '',
        endTime: '',
    });
    const [status, setStatus] = useState('idle'); // idle | loading | success | error
    const [errorMsg, setErrorMsg] = useState('');

    const toIso = (val) => val && val.length === 16 ? val + ':00' : val;

    const validate = () => {
        const name = formData.resourceName === 'Other' ? formData.customResource : formData.resourceName;
        if (!name || !name.trim()) return 'Please select or enter a resource name.';
        if (!formData.startTime) return 'Please select a start date and time.';
        if (!formData.endTime) return 'Please select an end date and time.';
        if (new Date(formData.endTime) <= new Date(formData.startTime))
            return 'End time must be after start time.';
        if (new Date(formData.startTime) < new Date())
            return 'Start time cannot be in the past.';
        return null;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const validationError = validate();
        if (validationError) {
            setStatus('error');
            setErrorMsg(validationError);
            return;
        }

        setStatus('loading');
        setErrorMsg('');
        const finalName = formData.resourceName === 'Other'
            ? formData.customResource.trim()
            : formData.resourceName;

        try {
            await api.post('/bookings', {
                resourceName: finalName,
                startTime: toIso(formData.startTime),
                endTime: toIso(formData.endTime),
            });
            setStatus('success');
            setTimeout(() => navigate('/bookings/my'), 2200);
        } catch (err) {
            setStatus('error');
            setErrorMsg(err.response?.data?.error || 'Failed to submit booking. Please try again.');
        }
    };

    const set = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        if (status === 'error') setStatus('idle');
    };

    if (status === 'success') {
        return (
            <div style={{ maxWidth: '540px', margin: '0 auto' }}>
                <div className="p-card" style={{ textAlign: 'center', padding: '3.5rem 2rem' }}>
                    <div style={{ display: 'inline-flex', backgroundColor: 'rgba(34,197,94,0.12)', borderRadius: '50%', padding: '20px', marginBottom: '1.5rem' }}>
                        <CheckCircle size={48} color="var(--success)" />
                    </div>
                    <h2 style={{ marginBottom: '0.75rem', color: 'var(--success)' }}>Request Submitted!</h2>
                    <p style={{ color: 'var(--text-secondary)', marginBottom: '0.5rem', fontSize: '1rem' }}>
                        Your booking request has been sent for approval.
                    </p>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
                        Redirecting to your bookings...
                    </p>
                    <div style={{ marginTop: '2rem', height: '4px', borderRadius: '2px', background: 'var(--border-color)', overflow: 'hidden' }}>
                        <div style={{ height: '100%', background: 'var(--success)', animation: 'progress 2.2s linear forwards' }} />
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div style={{ maxWidth: '580px', margin: '0 auto' }}>
            {/* Back button */}
            <button
                onClick={() => navigate('/bookings/my')}
                style={{
                    background: 'none', border: 'none', color: 'var(--primary)',
                    cursor: 'pointer', display: 'flex', alignItems: 'center',
                    gap: '6px', marginBottom: '1.5rem', fontSize: '0.875rem',
                    fontWeight: '600', padding: 0, transition: 'opacity 0.2s'
                }}
            >
                <ArrowLeft size={16} /> Back to My Bookings
            </button>

            <div className="p-card" style={{ padding: '2.25rem' }}>

                {/* Header */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem', paddingBottom: '1.5rem', borderBottom: '1px solid var(--border-color)' }}>
                    <div style={{ backgroundColor: 'var(--primary)', borderRadius: '12px', padding: '12px', display: 'flex', flexShrink: 0 }}>
                        <BookOpen size={24} color="white" />
                    </div>
                    <div>
                        <h2 style={{ margin: 0, fontSize: '1.35rem', fontWeight: '700' }}>New Booking Request</h2>
                        <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', margin: '3px 0 0' }}>
                            Logged in as <strong style={{ color: 'var(--primary)' }}>{user?.name}</strong>
                        </p>
                    </div>
                </div>

                {/* Error alert */}
                {status === 'error' && (
                    <div style={{
                        display: 'flex', alignItems: 'flex-start', gap: '10px',
                        marginBottom: '1.5rem', padding: '0.9rem 1rem',
                        borderRadius: '10px', background: 'rgba(239,68,68,0.08)',
                        border: '1px solid rgba(239,68,68,0.25)', color: 'var(--danger)',
                        fontSize: '0.875rem'
                    }}>
                        <AlertCircle size={18} style={{ flexShrink: 0, marginTop: '1px' }} />
                        <span>{errorMsg}</span>
                    </div>
                )}

                <form onSubmit={handleSubmit} noValidate>

                    {/* Resource selection */}
                    <div style={{ marginBottom: '1.5rem' }}>
                        <label className="p-label" style={{ color: 'var(--text-primary)', fontSize: '0.875rem', fontWeight: '700' }}>
                            Resource to Book <span style={{ color: 'var(--danger)' }}>*</span>
                        </label>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.6rem', marginTop: '0.5rem' }}>
                            {RESOURCE_OPTIONS.map(opt => (
                                <button
                                    key={opt}
                                    type="button"
                                    onClick={() => set('resourceName', opt)}
                                    style={{
                                        padding: '0.6rem 0.5rem',
                                        border: formData.resourceName === opt
                                            ? '2px solid var(--primary)'
                                            : '1.5px solid var(--border-color)',
                                        borderRadius: '8px',
                                        background: formData.resourceName === opt
                                            ? 'rgba(22,101,52,0.08)'
                                            : 'var(--surface-color-light)',
                                        color: formData.resourceName === opt
                                            ? 'var(--primary)'
                                            : 'var(--text-secondary)',
                                        fontSize: '0.78rem',
                                        fontWeight: formData.resourceName === opt ? '700' : '500',
                                        cursor: 'pointer',
                                        transition: 'all 0.18s ease',
                                        textAlign: 'center',
                                        lineHeight: '1.3',
                                    }}
                                >
                                    {opt}
                                </button>
                            ))}
                        </div>

                        {/* Custom field shown when "Other" is selected */}
                        {formData.resourceName === 'Other' && (
                            <div style={{ marginTop: '0.75rem' }}>
                                <input
                                    className="p-input"
                                    placeholder="Describe the resource you need..."
                                    value={formData.customResource}
                                    onChange={e => set('customResource', e.target.value)}
                                    autoFocus
                                    style={{ marginTop: '0.25rem' }}
                                />
                            </div>
                        )}
                    </div>

                    {/* Date & Time */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
                        <div>
                            <label className="p-label" style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '0.875rem', fontWeight: '700', color: 'var(--text-primary)' }}>
                                <Calendar size={14} color="var(--primary)" />
                                Start Date &amp; Time <span style={{ color: 'var(--danger)' }}>*</span>
                            </label>
                            <input
                                type="datetime-local"
                                className="p-input"
                                value={formData.startTime}
                                onChange={e => set('startTime', e.target.value)}
                                min={new Date().toISOString().slice(0, 16)}
                                required
                                style={{ marginTop: '0.5rem' }}
                            />
                        </div>
                        <div>
                            <label className="p-label" style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '0.875rem', fontWeight: '700', color: 'var(--text-primary)' }}>
                                <Clock size={14} color="var(--primary)" />
                                End Date &amp; Time <span style={{ color: 'var(--danger)' }}>*</span>
                            </label>
                            <input
                                type="datetime-local"
                                className="p-input"
                                value={formData.endTime}
                                onChange={e => set('endTime', e.target.value)}
                                min={formData.startTime || new Date().toISOString().slice(0, 16)}
                                required
                                style={{ marginTop: '0.5rem' }}
                            />
                        </div>
                    </div>

                    {/* Duration preview */}
                    {formData.startTime && formData.endTime && new Date(formData.endTime) > new Date(formData.startTime) && (
                        <div style={{
                            display: 'flex', alignItems: 'center', gap: '8px',
                            padding: '0.65rem 1rem', borderRadius: '8px',
                            background: 'rgba(22,101,52,0.07)', marginBottom: '1.5rem',
                            fontSize: '0.83rem', color: 'var(--primary)', fontWeight: '600'
                        }}>
                            <Clock size={14} />
                            Duration: {(() => {
                                const diff = (new Date(formData.endTime) - new Date(formData.startTime)) / 60000;
                                const h = Math.floor(diff / 60);
                                const m = diff % 60;
                                return h > 0 ? `${h}h ${m > 0 ? m + 'm' : ''}` : `${m}m`;
                            })()}
                        </div>
                    )}

                    {/* Action buttons */}
                    <div style={{ display: 'flex', gap: '0.75rem', paddingTop: '0.5rem', borderTop: '1px solid var(--border-color)', marginTop: '0.5rem' }}>
                        <button
                            type="button"
                            className="p-btn p-btn-secondary"
                            onClick={() => navigate('/bookings/my')}
                            disabled={status === 'loading'}
                            style={{ flex: 1 }}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="p-btn p-btn-primary"
                            disabled={status === 'loading'}
                            style={{ flex: 2, gap: '8px' }}
                        >
                            {status === 'loading' ? (
                                <>
                                    <span style={{ width: '16px', height: '16px', border: '2px solid rgba(255,255,255,0.4)', borderTopColor: 'white', borderRadius: '50%', display: 'inline-block', animation: 'spin 0.7s linear infinite' }} />
                                    Submitting...
                                </>
                            ) : (
                                <>
                                    <Calendar size={16} /> Submit Booking Request
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>

            <style>{`
                @keyframes spin { to { transform: rotate(360deg); } }
                @keyframes progress { from { width: 0; } to { width: 100%; } }
            `}</style>
        </div>
    );
};

export default CreateBooking;
