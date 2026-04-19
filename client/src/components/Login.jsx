import React, { useContext, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { GoogleLogin } from '@react-oauth/google';

const Login = () => {
    const { login, googleLogin } = useContext(AuthContext);
    const [email, setEmail] = useState('admin@smartcampus.edu');
    const [password, setPassword] = useState('admin123');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await login(email, password);
            navigate('/');
        } catch (err) {
            alert('Login failed');
        }
    };

    return (
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: '10vh' }}>
            <div className="p-card" style={{ width: '400px' }}>
                <h2 style={{ textAlign: 'center', marginBottom: '2rem' }}>Welcome Back</h2>
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="p-label">Email</label>
                        <input type="email" className="p-input" value={email} onChange={e => setEmail(e.target.value)} required />
                    </div>
                    <div className="mb-4">
                        <label className="p-label">Password</label>
                        <input type="password" className="p-input" value={password} onChange={e => setPassword(e.target.value)} required />
                    </div>
                    <button type="submit" className="p-btn p-btn-primary w-full mb-4">Login</button>
                </form>
                <div style={{ textAlign: 'center', margin: '1rem 0', color: 'var(--text-secondary)' }}>OR</div>
                <div style={{ display: 'flex', justifyContent: 'center' }}>
                    <GoogleLogin 
                        onSuccess={async (credentialResponse) => {
                            try {
                                await googleLogin(credentialResponse.credential);
                                navigate('/');
                            } catch(e) {
                                alert('Google OAuth simulated login failed');
                            }
                        }}
                        onError={() => console.log('Login Failed')}
                    />
                </div>
                <div className="mt-4" style={{ textAlign: 'center', fontSize: '0.875rem' }}>
                    Don't have an account? <Link to="/signup" style={{ color: 'var(--primary)', fontWeight: '600' }}>Sign up</Link>
                </div>
            </div>
        </div>
    );
};

export default Login;
