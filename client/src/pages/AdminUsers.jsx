import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { Users, Trash2, Shield, User as UserIcon, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await api.get('/admin/users');
      setUsers(response.data);
    } catch (err) {
      setError('Failed to fetch users');
    } finally {
      setLoading(false);
    }
  };

  const deleteUser = async (id) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;
    
    try {
      await api.delete(`/admin/users/${id}`);
      setUsers(users.filter(user => user.id !== id));
    } catch (err) {
        alert('Failed to delete user');
    }
  };

  if (loading) return <div style={{ padding: '40px', textAlign: 'center' }}>Loading users...</div>;

  return (
    <div style={{ padding: '40px', maxWidth: '1000px', margin: '0 auto' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '30px' }}>
        <Link to="/dashboard" style={{ color: '#718096', display: 'flex', alignItems: 'center' }}>
          <ArrowLeft size={24} />
        </Link>
        <h1 style={{ fontSize: '28px' }}>User Management</h1>
      </div>

      {error && <div style={{ background: '#fff5f5', color: '#c53030', padding: '15px', borderRadius: '10px', marginBottom: '20px' }}>{error}</div>}

      <div style={{ background: 'white', borderRadius: '15px', overflow: 'hidden', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
              <th style={{ padding: '15px 20px', textAlign: 'left', color: '#64748b', fontWeight: '600' }}>User</th>
              <th style={{ padding: '15px 20px', textAlign: 'left', color: '#64748b', fontWeight: '600' }}>Email</th>
              <th style={{ padding: '15px 20px', textAlign: 'left', color: '#64748b', fontWeight: '600' }}>Roles</th>
              <th style={{ padding: '15px 20px', textAlign: 'center', color: '#64748b', fontWeight: '600' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                <td style={{ padding: '15px 20px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div style={{ background: '#e2e8f0', padding: '8px', borderRadius: '50%', color: '#475569' }}>
                      <UserIcon size={18} />
                    </div>
                    <span style={{ fontWeight: '500' }}>{u.name}</span>
                  </div>
                </td>
                <td style={{ padding: '15px 20px', color: '#64748b' }}>{u.email}</td>
                <td style={{ padding: '15px 20px' }}>
                  <div style={{ display: 'flex', gap: '5px' }}>
                    {u.roles.map(role => (
                      <span key={role} style={{ 
                        fontSize: '12px', 
                        padding: '2px 8px', 
                        borderRadius: '20px', 
                        background: role === 'ROLE_ADMIN' ? '#fff5f5' : '#ebf8ff',
                        color: role === 'ROLE_ADMIN' ? '#c53030' : '#3182ce',
                        border: `1px solid ${role === 'ROLE_ADMIN' ? '#feb2b2' : '#bee3f8'}`
                      }}>
                        {role === 'ROLE_ADMIN' ? 'Admin' : 'User'}
                      </span>
                    ))}
                  </div>
                </td>
                <td style={{ padding: '15px 20px', textAlign: 'center' }}>
                  <button 
                    onClick={() => deleteUser(u.id)}
                    style={{ background: 'none', border: 'none', color: '#e53e3e', cursor: 'pointer', padding: '5px' }}
                  >
                    <Trash2 size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminUsers;
