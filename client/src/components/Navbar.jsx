import React from 'react';
import { Link } from 'react-router-dom';
import { Building2 } from 'lucide-react';

const Navbar = () => {
    return (
        <header className="app-header">
            <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '1rem', textDecoration: 'none', color: 'white' }}>
                <div style={{ backgroundColor: 'white', borderRadius: '4px', padding: '4px' }}>
                    <Building2 size={24} color="var(--primary)" />
                </div>
                <h1 style={{ fontSize: '1.25rem', margin: 0, fontWeight: '700' }}>Smart Campus Hub</h1>
            </Link>

            <nav className="flex items-center gap-8" style={{ marginLeft: '2rem' }}>
                <Link to="/" className="nav-link-custom">Home</Link>
            </nav>
        </header>
    );
};

export default Navbar;

