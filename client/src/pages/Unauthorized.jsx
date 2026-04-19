import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldAlert } from 'lucide-react';

const Unauthorized = () => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '60vh', textAlign: 'center' }}>
      <ShieldAlert size={80} color="#e53e3e" style={{ marginBottom: '20px' }} />
      <h1 style={{ fontSize: '2.5rem', color: '#2d3748', marginBottom: '10px' }}>403 - Access Denied</h1>
      <p style={{ fontSize: '1.2rem', color: '#4a5568', marginBottom: '30px' }}>
        You do not have the required permissions to view this page.
      </p>
      <Link to="/" style={{ 
        backgroundColor: '#3182ce', 
        color: 'white', 
        padding: '10px 20px', 
        borderRadius: '6px', 
        textDecoration: 'none', 
        fontWeight: 'bold' 
      }}>
        Return to Home
      </Link>
    </div>
  );
};

export default Unauthorized;
