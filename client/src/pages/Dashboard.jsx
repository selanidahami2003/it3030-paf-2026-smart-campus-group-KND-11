import React from 'react';
import { useAuth } from '../context/AuthContext';
import { LayoutDashboard, Users, Bell, LogOut, User as UserIcon } from 'lucide-react';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  const { user, isAdmin, logout } = useAuth();

  const stats = [
    { label: 'Name', value: user?.name, icon: UserIcon, color: 'blue' },
    { label: 'Email', value: user?.email, icon: UserIcon, color: 'purple' },
    { label: 'Role', value: isAdmin() ? 'Administrator' : 'User', icon: LayoutDashboard, color: 'green' },
  ];

  return (
    <div className="dashboard-container" style={{ padding: '40px', maxWidth: '1200px', margin: '0 auto' }}>
      <div className="dashboard-header" style={{ marginBottom: '40px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: '32px', color: '#1a202c', marginBottom: '8px' }}>Dashboard Overview</h1>
          <p style={{ color: '#718096' }}>Welcome back to the Smart Campus Hub</p>
        </div>
        <button 
          onClick={logout}
          style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '8px', 
            padding: '10px 20px', 
            background: '#fff', 
            border: '1px solid #e2e8f0', 
            borderRadius: '10px',
            color: '#e53e3e',
            cursor: 'pointer',
            fontWeight: '600'
          }}
        >
          <LogOut size={18} />
          Logout
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px', marginBottom: '40px' }}>
        {stats.map((stat, index) => (
          <div key={index} style={{ background: '#fff', padding: '24px', borderRadius: '16px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
              <div style={{ padding: '10px', background: `${stat.color === 'blue' ? '#ebf8ff' : stat.color === 'purple' ? '#faf5ff' : '#f0fff4'}`, borderRadius: '12px', color: `${stat.color === 'blue' ? '#3182ce' : stat.color === 'purple' ? '#805ad5' : '#38a169'}` }}>
                <stat.icon size={24} />
              </div>
              <span style={{ color: '#718096', fontWeight: '500' }}>{stat.label}</span>
            </div>
            <div style={{ fontSize: '18px', fontWeight: '700', color: '#2d3748' }}>{stat.value}</div>
          </div>
        ))}
      </div>

      <div style={{ background: '#fff', padding: '32px', borderRadius: '20px', boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
        <h2 style={{ fontSize: '20px', marginBottom: '24px' }}>Quick Actions</h2>
        <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
          <Link to="/notifications" style={{ textDecoration: 'none', background: '#4299e1', color: 'white', padding: '15px 30px', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '10px', fontWeight: '600' }}>
            <Bell size={20} />
            View Notifications
          </Link>
          {isAdmin() && (
            <Link to="/admin/users" style={{ textDecoration: 'none', background: '#2d3748', color: 'white', padding: '15px 30px', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '10px', fontWeight: '600' }}>
              <Users size={20} />
              Manage Users
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
