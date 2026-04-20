import React from 'react';
import { Calendar, Monitor, MapPin, Users, Building2, Trash2 } from 'lucide-react';

const ResourceCard = ({ resource, onEdit, onDelete, isAdmin }) => {
    const getPatternImage = (res) => {
        if (res.imageUrl && res.imageUrl.trim() !== '') return res.imageUrl;
        if (res.type === 'ROOM') return 'https://images.unsplash.com/photo-1517502884422-41eaead166d4?auto=format&fit=crop&q=80&w=800';
        if (res.type === 'LAB') return 'https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?auto=format&fit=crop&q=80&w=800';
        return 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=800';
    };

    return (
        <div className="resource-card-premium">
            <div className="resource-card-image-container">
                <img 
                    src={getPatternImage(resource)} 
                    alt={resource.name} 
                    className="resource-card-image"
                    onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=800'; }}
                />
                <div className="image-overlay" />
                <span className={`status-badge-modern ${resource.status === 'ACTIVE' ? 'badge-active' : 'badge-inactive'}`}>
                    {resource.status}
                </span>
            </div>
            
            <div className="resource-details">
                <h3 className="resource-title">{resource.name}</h3>
                
                <div className="info-row">
                    <MapPin size={16} strokeWidth={2.5} color="var(--primary)"/> 
                    <span>{resource.location}</span>
                </div>
                
                <div className="info-row">
                    <Users size={16} strokeWidth={2.5} color="var(--primary)"/> 
                    <span>Capacity: {resource.capacity || 'N/A'}</span>
                </div>

                <div className="flex items-center justify-between mt-4">
                    <div className="type-tag">
                        {resource.type === 'ROOM' ? <Building2 size={14} /> : 
                         resource.type === 'LAB' ? <Monitor size={14} /> : 
                         <Calendar size={14} />}
                        {resource.type}
                    </div>

                    {isAdmin && (
                        <div className="flex gap-2">
                            <button 
                                className="p-btn p-btn-secondary" 
                                style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem' }}
                                onClick={() => onEdit(resource)}
                            >
                                Edit
                            </button>
                            <button 
                                className="p-btn" 
                                style={{ 
                                    padding: '0.4rem', 
                                    backgroundColor: '#fee2e2', 
                                    color: '#dc2626', 
                                    border: '1px solid #fecaca' 
                                }} 
                                onClick={() => onDelete(resource.id)}
                            >
                                <Trash2 size={16} />
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ResourceCard;
