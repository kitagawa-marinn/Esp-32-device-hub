import React from 'react';
import { Link } from 'react-router-dom';
import DeviceCard from './DeviceCard';
import '../styles/DeviceList.css';

function DeviceList({ devices }) {
  if (devices.length === 0) {
    return (
      <div className="empty-state">
        <p>📭 No ESP32 devices found on your network</p>
        <p className="help-text">Make sure your devices are online and connected</p>
      </div>
    );
  }

  return (
    <div className="device-grid">
      {devices.map((device) => (
        <Link key={device.id} to={`/device/${device.id}`}>
          <DeviceCard device={device} />
        </Link>
      ))}
    </div>
  );
}

export default DeviceList;
