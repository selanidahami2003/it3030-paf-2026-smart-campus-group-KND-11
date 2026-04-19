import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { Building2 } from 'lucide-react';

const Login = () => {
    const { login } = useContext(AuthContext);
    const navigate = useNavigate();
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            await login(formData.email, formData.password);
            navigate('/tickets');
        } catch (err) {
            setError('Invalid email or password. Please try again.');
        } finally {
            setLoading(false);
        }
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
                        Service Desk — Please sign in to continue
                    </p>
                </div>

                {/* Error message */}
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
                        <label className="p-label">Email Address</label>
                        <input
                            type="email"
                            className="p-input"
                            value={formData.email}
                            onChange={e => setFormData({ ...formData, email: e.target.value })}
                            required
                            placeholder="you@smartcampus.edu"
                            autoFocus
                        />
                    </div>
                    <div style={{ marginBottom: '1.75rem' }}>
                        <label className="p-label">Password</label>
                        <input
                            type="password"
                            className="p-input"
                            value={formData.password}
                            onChange={e => setFormData({ ...formData, password: e.target.value })}
                            required
                            placeholder="••••••••"
                        />
                    </div>
                    <button
                        type="submit"
                        className="p-btn p-btn-primary w-full"
                        disabled={loading}
                        style={{ fontSize: '1rem', padding: '0.9rem', opacity: loading ? 0.7 : 1 }}
                    >
                        {loading ? 'Signing in...' : 'Sign In'}
                    </button>
                </form>

                {/* Demo accounts hint */}
                <div style={{
                    marginTop: '1.75rem',
                    padding: '1rem',
                    background: 'var(--surface-color-light)',
                    borderRadius: '10px',
                    fontSize: '0.8rem',
                    color: 'var(--text-secondary)'
                }}>
                    <p style={{ fontWeight: '600', marginBottom: '0.4rem', color: 'var(--text-primary)' }}>Demo Accounts:</p>
                    <p>👤 User: <strong>user@smartcampus.edu</strong> / user123</p>
                    <p style={{ marginTop: '0.25rem' }}>🔧 Technician: <strong>tech@smartcampus.edu</strong> / tech123</p>
                    <p style={{ marginTop: '0.25rem' }}>🛡️ Admin: <strong>admin@smartcampus.edu</strong> / admin123</p>
                </div>
            </div>
        </div>
    );
};

export default Login;
