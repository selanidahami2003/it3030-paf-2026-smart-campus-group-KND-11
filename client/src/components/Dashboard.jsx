import React, { useContext, useState, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';
import api from '../services/api';
import ResourceCard from './ResourceCard';
import ResourceModal from './ResourceModal';
import { Search } from 'lucide-react';

const Dashboard = () => {
    const { user } = useContext(AuthContext);
    const [resources, setResources] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingResource, setEditingResource] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterType, setFilterType] = useState('ALL');

    const fetchResources = async () => {
        try {
            const res = await api.get('/resources');
            setResources(res.data);
        } catch (err) {
            console.error("Failed to fetch resources", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchResources();
    }, []);

    const handleSaveResource = async (formData) => {
        try {
            if (editingResource) {
                await api.put(`/resources/${formData.id}`, formData);
            } else {
                await api.post('/resources', formData);
            }
            setIsModalOpen(false);
            fetchResources();
        } catch (err) {
            console.error("Failed to save resource", err);
            alert("Error saving resource");
        }
    };

    const openEditModal = (resource) => {
        setEditingResource(resource);
        setIsModalOpen(true);
    };

    const openCreateModal = () => {
        setEditingResource(null);
        setIsModalOpen(true);
    };

    const handleDeleteResource = async (id) => {
        if (window.confirm("Are you sure you want to delete this resource?")) {
            try {
                await api.delete(`/resources/${id}`);
                fetchResources();
            } catch (err) {
                console.error("Failed to delete resource", err);
                alert("Error deleting resource");
            }
        }
    };

    if (loading) return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '400px' }}>
            <div className="skel" style={{ width: '100px', height: '100px', borderRadius: '50%' }}></div>
        </div>
    );

    const filteredResources = resources.filter(res => {
        const matchesSearch = res.name.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesType = filterType === 'ALL' || res.type === filterType;
        return matchesSearch && matchesType;
    });

    return (
        <div>
            <div className="directory-header">
                <div className="flex justify-between items-start">
                    <div>
                        <h2>Campus Directory</h2>
                        <p>Explore and book university facilities with ease.</p>
                    </div>
                    {user?.role === 'ADMIN' && (
                        <button className="p-btn" style={{ background: 'white', color: 'var(--primary)' }} onClick={openCreateModal}>
                            + Add Resource
                        </button>
                    )}
                </div>
            </div>
            
            <ResourceModal 
                isOpen={isModalOpen} 
                onClose={() => setIsModalOpen(false)} 
                resource={editingResource} 
                onSave={handleSaveResource} 
            />

            <div className="search-container-modern">
                <div style={{ flex: 1, position: 'relative', display: 'flex', alignItems: 'center' }}>
                    <Search size={20} style={{ position: 'absolute', left: '1rem', color: 'var(--text-secondary)' }} />
                    <input 
                        type="text" 
                        className="p-input" 
                        placeholder="Search for lecture halls, labs, or equipment..." 
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        style={{ paddingLeft: '3rem', border: 'none', background: 'transparent' }}
                    />
                </div>
                <select 
                    className="p-input" 
                    value={filterType}
                    onChange={(e) => setFilterType(e.target.value)}
                    style={{ width: '180px', border: 'none', background: 'var(--surface-color-light)' }}
                >
                    <option value="ALL">All Types</option>
                    <option value="ROOM">Lecture Halls</option>
                    <option value="LAB">Computer Labs</option>
                    <option value="EQUIPMENT">Equipment</option>
                </select>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '2rem' }}>
                {filteredResources.map((res, index) => (
                    <div key={res.id} className="fade-in-up" style={{ animationDelay: `${index * 0.05}s`, opacity: 0, fillMode: 'forwards' }}>
                        <ResourceCard 
                            resource={res} 
                            isAdmin={user?.role === 'ADMIN'}
                            onEdit={openEditModal}
                            onDelete={handleDeleteResource}
                        />
                    </div>
                ))}
                {filteredResources.length === 0 && (
                    <div className="p-card" style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '5rem 3rem', background: 'transparent', border: '2px dashed var(--border-color)' }}>
                        <div style={{ fontSize: '1.25rem', fontWeight: '600', color: 'var(--text-secondary)' }}>No assets match your search.</div>
                        <p>Try adjusting your filters or search terms.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Dashboard;
