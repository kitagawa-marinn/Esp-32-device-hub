import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Header from '../components/Header';
import '../styles/DeviceDetails.css';

function DeviceDetailsPage({ user, onLogout }) {
  const { id } = useParams();
  const [device, setDevice] = useState(null);
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchDeviceDetails();
    const interval = setInterval(fetchDeviceDetails, 5000);
    return () => clearInterval(interval);
  }, [id]);

  const fetchDeviceDetails = async () => {
    try {
      const token = localStorage.getItem('token');
      const [deviceRes, statusRes] = await Promise.all([
        axios.get(`/api/devices/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        }),
        axios.get(`/api/devices/${id}/status`, {
          headers: { Authorization: `Bearer ${token}` }
        })
      ]);
      setDevice(deviceRes.data.data);
      setStatus(statusRes.data.data);
      setError('');
    } catch (error) {
      setError('Failed to fetch device details');
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRestart = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.post(`/api/devices/${id}/restart`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert('Restart command sent!');
    } catch (error) {
      alert('Failed to send restart command');
    }
  };

  const handleLogout = () => {
    onLogout();
    navigate('/login');
  };

  if (loading) return <div>Loading...</div>;
  if (!device) return <div>Device not found</div>;

  return (
    <div className="device-details-container">
      <Header user={user} onLogout={handleLogout} />
      
      <main className="device-details-main">
        <button className="back-button" onClick={() => navigate('/')}>← Back</button>
        
        <div className="device-info">
          <h1>{device.name || `Device ${id}`}</h1>
          
          {status && (
            <div className="status-grid">
              <div className="status-card">
                <span className="label">Status:</span>
                <span className={`value ${status.status}`}>{status.status}</span>
              </div>
              <div className="status-card">
                <span className="label">Uptime:</span>
                <span className="value">{status.uptime || 'N/A'}</span>
              </div>
              <div className="status-card">
                <span className="label">Signal:</span>
                <span className="value">{status.rssi || 'N/A'} dBm</span>
              </div>
              <div className="status-card">
                <span className="label">CPU Temp:</span>
                <span className="value">{status.cpu_temp || 'N/A'}°C</span>
              </div>
            </div>
          )}

          <div className="device-actions">
            <button className="btn-primary" onClick={handleRestart}>
              🔄 Restart Device
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}

export default DeviceDetailsPage;
