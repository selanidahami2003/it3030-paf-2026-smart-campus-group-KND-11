import React, { useState } from 'react';
import { Building2, User as UserIcon, ShieldAlert } from 'lucide-react';

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

                <div style={{ display: 'grid', gap: '1rem' }}>
                    <button
                        onClick={() => onIdentified({ name: 'Admin User', studentId: 'ADMIN001' })}
                        className="p-btn p-btn-primary w-full"
                        style={{ 
                            fontSize: '1rem', 
                            padding: '1.25rem', 
                            display: 'flex', 
                            flexDirection: 'column', 
                            gap: '0.25rem',
                            height: 'auto',
                            background: 'var(--primary)'
                        }}
                    >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                            <ShieldAlert size={20} />
                            <span>Administrator Portal</span>
                        </div>
                        <span style={{ fontSize: '0.75rem', fontWeight: '400', opacity: 0.8 }}>Access all tickets and management tools</span>
                    </button>

                    <button
                        onClick={() => onIdentified({ name: 'Student User', studentId: 'ST67890' })}
                        className="p-btn p-btn-secondary w-full"
                        style={{ 
                            fontSize: '1rem', 
                            padding: '1.25rem', 
                            display: 'flex', 
                            flexDirection: 'column', 
                            gap: '0.25rem',
                            height: 'auto',
                            borderColor: 'var(--primary)',
                            color: 'var(--primary)'
                        }}
                    >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                            <UserIcon size={20} />
                            <span>Student / Staff User</span>
                        </div>
                        <span style={{ fontSize: '0.75rem', fontWeight: '400', color: 'var(--text-tertiary)' }}>Report incidents and track your requests</span>
                    </button>
                </div>

                <p style={{ textAlign: 'center', fontSize: '0.78rem', color: 'var(--text-secondary)', marginTop: '1.25rem' }}>
                    Your details will be used to track your submitted tickets.
                </p>
            </div>
        </div>
    );
};

export default UserIdentityForm;
