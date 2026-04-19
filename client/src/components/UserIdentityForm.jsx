import React, { useState } from 'react';
import { Building2, User } from 'lucide-react';

const UserIdentityForm = ({ onIdentified }) => {
    const [name, setName] = useState('');
    const [studentId, setStudentId] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!name.trim()) {
            setError('Please enter your full name.');
            return;
        }
        if (!studentId.trim()) {
            setError('Please enter your Student / Staff ID.');
            return;
        }
        setError('');
        onIdentified({ name: name.trim(), studentId: studentId.trim() });
    };

    return (
        <div style={{
            minHeight: '100vh',
            background: 'linear-gradient(135deg, #166534 0%, #14532D 50%, #052e16 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1rem'
        }}>
            <div style={{
                background: 'white',
                borderRadius: '20px',
                padding: '2.5rem',
                width: '100%',
                maxWidth: '420px',
                boxShadow: '0 25px 50px -12px rgba(0,0,0,0.4)'
            }}>
                {/* Logo */}
                <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                    <div style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        background: 'var(--primary)',
                        borderRadius: '12px',
                        padding: '12px',
                        marginBottom: '1rem'
                    }}>
                        <Building2 size={32} color="white" />
                    </div>
                    <h1 style={{ fontSize: '1.5rem', fontWeight: '700', color: 'var(--primary)', marginBottom: '0.25rem' }}>
                        Smart Campus Hub
                    </h1>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                        Service Desk — Please identify yourself to continue
                    </p>
                </div>

                {/* Error */}
                {error && (
                    <div style={{
                        background: '#FEF2F2',
                        border: '1px solid #FECACA',
                        borderRadius: '8px',
                        padding: '0.75rem 1rem',
                        marginBottom: '1.25rem',
                        color: '#DC2626',
                        fontSize: '0.875rem',
                        fontWeight: '500'
                    }}>
                        ⚠️ {error}
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    <div style={{ marginBottom: '1.25rem' }}>
                        <label className="p-label">Full Name</label>
                        <input
                            type="text"
                            className="p-input"
                            value={name}
                            onChange={e => setName(e.target.value)}
                            required
                            placeholder="e.g. Kamal Perera"
                            autoFocus
                        />
                    </div>

                    <div style={{ marginBottom: '1.75rem' }}>
                        <label className="p-label">Student / Staff ID</label>
                        <input
                            type="text"
                            className="p-input"
                            value={studentId}
                            onChange={e => setStudentId(e.target.value)}
                            required
                            placeholder="e.g. IT21234567"
                        />
                    </div>

                    <button
                        type="submit"
                        className="p-btn p-btn-primary w-full"
                        style={{ fontSize: '1rem', padding: '0.9rem' }}
                    >
                        <User size={18} style={{ marginRight: '0.5rem' }} />
                        Continue to Service Desk
                    </button>
                </form>

                <p style={{ textAlign: 'center', fontSize: '0.78rem', color: 'var(--text-secondary)', marginTop: '1.25rem' }}>
                    Your details will be used to track your submitted tickets.
                </p>
            </div>
        </div>
    );
};

export default UserIdentityForm;
