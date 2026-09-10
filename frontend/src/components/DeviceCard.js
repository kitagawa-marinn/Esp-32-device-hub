import React from 'react';
import '../styles/DeviceCard.css';

function DeviceCard({ device }) {
  const getStatusColor = (status) => {
    return status === 'online' ? 'green' : 'red';
  };

  return (
    <div className={`device-card status-${getStatusColor(device.status)}`}>
      <div className="device-header">
        <h3>{device.name || `Device ${device.id}`}</h3>
        <span className={`status-badge ${device.status}`}>{device.status}</span>
      </div>
      
      <div className="device-info">
        <p><strong>Type:</strong> {device.type || 'ESP32'}</p>
        <p><strong>IP:</strong> {device.ip || 'N/A'}</p>
        <p><strong>MAC:</strong> {device.mac || 'N/A'}</p>
      </div>
      
      <div className="device-footer">
        <small>Last seen: {device.lastSeen ? new Date(device.lastSeen).toLocaleTimeString() : 'Never'}</small>
      </div>
    </div>
  );
}

export default DeviceCard;
