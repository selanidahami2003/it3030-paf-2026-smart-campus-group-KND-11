import React from 'react';
import { Wrench } from 'lucide-react';

const TechnicianDashboard = () => {
  return (
    <div style={{ padding: '2rem' }}>
      <h1 style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <Wrench /> Technician Dashboard
      </h1>
      <p>Welcome to the technician dashboard. Here you can update assigned ticket statuses and add resolution notes.</p>
    </div>
  );
};

export default TechnicianDashboard;
