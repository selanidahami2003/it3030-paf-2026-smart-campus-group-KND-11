import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { Building2, User as UserIcon, ShieldAlert, Calendar, Ticket, Bell } from 'lucide-react';

const UserIdentityForm = () => {
    const { user, identify, googleLogin } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleCardClick = (path) => {
        if (user) {
            navigate(path);
        } else {
            navigate('/login');
        }
    };

    const [role, setRole] = useState('Staff');
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }
        // In a real app, you would call a register endpoint.
        // For now, we mock it via identify as before.
        identify(name, role.toUpperCase());
    };

    const handleGoogleSuccess = async (credentialResponse) => {
        try {
            setError('');
            await googleLogin(credentialResponse.credential);
        } catch (e) {
            setError('Google login failed. Please try again.');
        }
    };

    return (
        <div style={{ display: 'flex', minHeight: '100vh', fontFamily: 'Inter, sans-serif' }}>
            
            {/* Left Side - Blue Banner */}
            <div style={{
                flex: 1,
                background: 'linear-gradient(135deg, #447794 0%, #061222 100%)',
                color: 'white',
                padding: '3rem 4rem',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                position: 'relative',
                overflow: 'hidden'
            }}>
                {/* Background glow effects */}
                <div style={{ position: 'absolute', top: '-10%', left: '-10%', width: '500px', height: '500px', background: 'radial-gradient(circle, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0) 70%)', borderRadius: '50%' }}></div>
                
                <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '4rem' }}>
                        <div style={{ backgroundColor: 'white', borderRadius: '10px', padding: '4px', display: 'flex', width: '40px', height: '40px', overflow: 'hidden' }}>
                            <img src="/logo.png" alt="Logo" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                        </div>
                        <div>
                            <div style={{ fontWeight: '700', fontSize: '1.2rem', lineHeight: '1.2' }}>Smart Campus Hub</div>
                            <div style={{ fontSize: '0.75rem', opacity: 0.8 }}>Campus services and support platform</div>
                        </div>
                    </div>

                    <div style={{ fontSize: '0.75rem', fontWeight: '600', letterSpacing: '0.1em', opacity: 0.8, marginBottom: '1rem' }}>
                        UNIFIED CAMPUS EXPERIENCE
                    </div>
                    
                    <h1 style={{ fontSize: '3rem', fontWeight: '700', lineHeight: '1.1', marginBottom: '1.5rem', maxWidth: '90%' }}>
                        Streamline your campus experience with integrated services.
                    </h1>
                    
                    <p style={{ fontSize: '1.25rem', lineHeight: '1.6', color: '#E2E8F0', maxWidth: '85%', marginBottom: '3rem', fontWeight: '400' }}>
                        Manage bookings, support requests, and campus services through one secure platform.
                    </p>

                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem' }}>
                        {[
                            { text: 'Resource booking', icon: <Calendar size={18} />, path: '/bookings' },
                            { text: 'Support ticket tracking', icon: <Ticket size={18} />, path: '/tickets' },
                            { text: 'Smart notifications', icon: <Bell size={18} />, path: '/notifications' }
                        ].map((item, idx) => (
                            <div 
                                key={idx} 
                                onClick={() => handleCardClick(item.path)}
                                onKeyDown={(e) => e.key === 'Enter' && handleCardClick(item.path)}
                                tabIndex={0}
                                style={{ 
                                    flex: '1 1 150px',
                                    background: 'rgba(255, 255, 255, 0.08)',
                                    backdropFilter: 'blur(12px)',
                                    border: '1px solid rgba(255, 255, 255, 0.1)',
                                    borderRadius: '16px',
                                    padding: '1rem',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    gap: '0.5rem',
                                    transition: 'all 0.3s ease',
                                    cursor: 'pointer',
                                    outline: 'none'
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.transform = 'translateY(-4px)';
                                    e.currentTarget.style.background = 'rgba(255, 255, 255, 0.12)';
                                    e.currentTarget.style.boxShadow = '0 10px 20px rgba(0,0,0,0.1)';
                                    e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.2)';
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.transform = 'translateY(0)';
                                    e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)';
                                    e.currentTarget.style.boxShadow = 'none';
                                    e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)';
                                }}
                                onMouseDown={(e) => e.currentTarget.style.transform = 'scale(0.96)'}
                                onMouseUp={(e) => e.currentTarget.style.transform = 'translateY(-4px)'}
                            >
                                <div style={{ 
                                    width: '32px', height: '32px', borderRadius: '10px', 
                                    background: 'rgba(255, 255, 255, 0.15)', 
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    marginBottom: '0.25rem'
                                }}>
                                    {item.icon}
                                </div>
                                <div style={{ fontSize: '0.85rem', fontWeight: '600', lineHeight: '1.3' }}>{item.text}</div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Footer info or minimal bottom text */}
                <div style={{ opacity: 0.6, fontSize: '0.85rem' }}>
                    © 2026 Smart Campus Hub. All rights reserved.
                </div>
            </div>

            {/* Right Side - Form */}
            <div style={{
                flex: 1,
                backgroundColor: '#F8FAFC', // Subtle off-white background
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '2rem'
            }}>
                <div style={{ width: '100%', maxWidth: '440px' }}>
                    
                    <div style={{ marginBottom: '2rem' }}>
                        <div style={{ fontSize: '0.75rem', fontWeight: '600', letterSpacing: '0.1em', color: '#6B7280', marginBottom: '0.5rem' }}>
                            GET STARTED
                        </div>
                        <h2 style={{ fontSize: '1.45rem', fontWeight: '800', color: '#0F172A', marginBottom: '0.75rem', letterSpacing: '-0.02em', whiteSpace: 'nowrap' }}>
                            Create your Smart Campus Hub account
                        </h2>
                        <p style={{ color: '#475569', fontSize: '0.95rem', lineHeight: '1.6' }}>
                            Access your campus services securely in one place.
                        </p>
                    </div>

                    <div style={{
                        background: 'rgba(255, 255, 255, 0.7)',
                        backdropFilter: 'blur(20px)',
                        WebkitBackdropFilter: 'blur(20px)',
                        borderRadius: '28px',
                        padding: '2.5rem',
                        boxShadow: '0 20px 40px rgba(0, 0, 0, 0.04), 0 1px 3px rgba(0, 0, 0, 0.02)',
                        border: '1px solid rgba(255, 255, 255, 0.8)',
                        position: 'relative'
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
