import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { GoogleLogin } from '@react-oauth/google';
import { LayoutGrid, Lock, Quote, Calendar, Ticket, Bell } from 'lucide-react';

const Login = () => {
  const { user, login, googleLogin } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleCardClick = (path) => {
    if (user) {
      navigate(path);
    } else {
      navigate('/login');
    }
  };

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

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

  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      setError('');
      await googleLogin(credentialResponse.credential);
      navigate('/tickets');
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
              WELCOME BACK
            </div>
            <h2 style={{ fontSize: '1.6rem', fontWeight: '800', color: '#0F172A', marginBottom: '0.75rem', letterSpacing: '-0.02em', whiteSpace: 'nowrap' }}>
              Sign in to Smart Campus Hub
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
            
            {/* Top part matching image (Institutional sign-in) */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
              <div>
                <div style={{ fontWeight: '600', color: '#111827', fontSize: '0.95rem' }}>Institutional sign-in</div>
                <div style={{ fontSize: '0.85rem', color: '#6B7280' }}>Use your university Google account</div>
              </div>
              <Lock size={18} color="#9CA3AF" />
            </div>

            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1.5rem' }}>
              <GoogleLogin
                onSuccess={handleGoogleSuccess}
                onError={() => setError('Google login failed')}
                size="large"
                theme="filled_blue"
                width="100%"
                text="continue_with"
                shape="rectangular"
              />
            </div>

            <div style={{ textAlign: 'center', margin: '1.5rem 0', color: '#9CA3AF', fontSize: '0.85rem', display: 'flex', alignItems: 'center' }}>
              <div style={{ flex: 1, height: '1px', background: '#F3F4F6' }}></div>
              <span style={{ padding: '0 10px' }}>OR</span>
              <div style={{ flex: 1, height: '1px', background: '#F3F4F6' }}></div>
            </div>

            {error && (
              <div style={{ background: '#FEF2F2', border: '1px solid #FECACA', borderRadius: '8px', padding: '0.75rem 1rem', marginBottom: '1.25rem', color: '#DC2626', fontSize: '0.875rem', fontWeight: '500' }}>
                ⚠️ {error}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ display: 'block', marginBottom: '0.6rem', color: '#334155', fontSize: '0.875rem', fontWeight: '600' }}>Email Address</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  placeholder="name@university.edu"
                  style={{ 
                    width: '100%', 
                    padding: '0.875rem 1.1rem', 
                    borderRadius: '14px', 
                    border: '1px solid #E2E8F0', 
                    fontSize: '0.95rem', 
                    background: 'rgba(255, 255, 255, 0.5)',
                    transition: 'all 0.2s'
                  }}
                />
              </div>

              <div style={{ marginBottom: '1rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.6rem' }}>
                  <label style={{ color: '#334155', fontSize: '0.875rem', fontWeight: '600' }}>Password</label>
                  <a href="#" style={{ color: '#2D5B75', fontSize: '0.8rem', fontWeight: '600', textDecoration: 'none' }}>Forgot password?</a>
                </div>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  placeholder="••••••••"
                  style={{ 
                    width: '100%', 
                    padding: '0.875rem 1.1rem', 
                    borderRadius: '14px', 
                    border: '1px solid #E2E8F0', 
                    fontSize: '0.95rem', 
                    background: 'rgba(255, 255, 255, 0.5)',
                    transition: 'all 0.2s'
                  }}
                />
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '2rem' }}>
                <input type="checkbox" id="remember" style={{ cursor: 'pointer' }} />
                <label htmlFor="remember" style={{ fontSize: '0.85rem', color: '#64748B', cursor: 'pointer' }}>Keep me signed in</label>
              </div>

              <button
                type="submit"
                disabled={loading}
                style={{
                  width: '100%', background: '#2D5B75', color: 'white', padding: '1rem', borderRadius: '14px', border: 'none', fontSize: '1rem', fontWeight: '700', cursor: 'pointer', transition: 'all 0.3s', opacity: loading ? 0.7 : 1, boxShadow: '0 4px 12px rgba(45, 91, 117, 0.25)'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = '#123249';
                  e.currentTarget.style.transform = 'translateY(-2px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = '#2D5B75';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                {loading ? 'Signing in...' : 'Sign In to Portal'}
              </button>
            </form>

            <div style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.85rem', color: '#6B7280', lineHeight: '1.5' }}>
              Secure single sign-on with role-based access for students, staff, and administrators.
            </div>
          </div>

          <div style={{ textAlign: 'center', marginTop: '2rem', fontSize: '0.875rem', color: '#6B7280' }}>
            Need assistance? <Link to="/signup" style={{ color: '#111827', fontWeight: '600', textDecoration: 'none' }}>Create an account</Link> or contact our IT support team.
          </div>
          
          <div style={{ display: 'flex', justifyContent: 'center', gap: '1.5rem', marginTop: '3rem', fontSize: '0.7rem', fontWeight: '600', letterSpacing: '0.1em', color: '#9CA3AF' }}>
            <span style={{ cursor: 'pointer' }}>PRIVACY</span>
            <span style={{ cursor: 'pointer' }}>ACCESSIBILITY</span>
            <span style={{ cursor: 'pointer' }}>SECURITY</span>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Login;
