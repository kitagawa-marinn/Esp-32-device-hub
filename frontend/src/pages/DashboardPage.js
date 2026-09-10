import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import DeviceList from '../components/DeviceList';
import Header from '../components/Header';
import '../styles/Dashboard.css';

function DashboardPage({ user, onLogout }) {
  const [devices, setDevices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchDevices();
    const interval = setInterval(fetchDevices, 10000); // Refresh every 10 seconds
    return () => clearInterval(interval);
  }, []);

  const fetchDevices = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('/api/devices', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setDevices(response.data.data || []);
      setError('');
    } catch (error) {
      setError('Failed to fetch devices');
      console.error('Error fetching devices:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    onLogout();
    navigate('/login');
  };

  return (
    <div className="dashboard-container">
      <Header user={user} onLogout={handleLogout} />
      
      <main className="dashboard-main">
        <div className="dashboard-header">
          <h1>📊 Device Dashboard</h1>
          <p>Total Devices: <strong>{devices.length}</strong></p>
        </div>

        {error && <div className="error-alert">{error}</div>}
        {loading ? (
          <div className="loading">Loading devices...</div>
        ) : (
          <DeviceList devices={devices} />
        )}
      </main>
    </div>
  );
}

export default DashboardPage;
