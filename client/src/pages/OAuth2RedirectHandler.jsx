import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

const OAuth2RedirectHandler = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { loginWithToken } = useAuth(); // We'll add this to AuthContext

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const token = params.get('token');

    if (token) {
      // Store token and redirect
      loginWithToken(token).then(() => {
        navigate('/dashboard', { replace: true });
      }).catch((err) => {
        console.error('OAuth2 Login Failed', err);
        navigate('/login?error=oauth2_failed');
      });
    } else {
      navigate('/login?error=missing_token');
    }
  }, [location, navigate, loginWithToken]);

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      <p>Logging you in via Google... Please wait.</p>
    </div>
  );
};

export default OAuth2RedirectHandler;
