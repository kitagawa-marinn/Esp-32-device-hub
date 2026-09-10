import React from 'react';
import '../styles/Header.css';

function Header({ user, onLogout }) {
  return (
    <header className="app-header">
      <div className="header-content">
        <h1 className="header-title">🚀 ESP32 Device Hub</h1>
        <div className="header-user">
          <span className="user-name">{user?.email || 'User'}</span>
          <button className="logout-btn" onClick={onLogout}>Logout</button>
        </div>
      </div>
    </header>
  );
}

export default Header;
