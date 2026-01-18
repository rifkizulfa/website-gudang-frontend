import React from 'react';
import '../styles/sap-style.css';
import {BrowserRouter as Router, Route, Link} from 'react-router-dom';

export default function MenuPRD2({ username, onLogout }) {
  return (
    <main className="menu-utama-wrap">
      <div className="menu-utama-card">
        <h1 className="menu-utama-title">Menu PRD-2</h1>
        <p className="menu-utama-user">Welcome, <strong>{username}</strong></p>
        
        <ul className="menu-list">
          <li className="menu-item">
            <Link to="/Zsdi001" className="menu-item">
              <div className="menu-item-content">
                <span className="menu-code">1.</span>              
              </div>
              <div>
                <span className="menu-label">Barang keluar</span>
              </div>
            </Link>
          </li>
          <li>
           <Link to="/Pilihan" className="menu-item">
              <div className="menu-item-content">
                <span className="menu-code">2.</span>              
              </div>
              <div> 
                <span className="menu-label">Barang masuk</span>
              </div>
            </Link>
          </li>
        </ul>

        <button className="menu-logout-btn" onClick={onLogout}>
          Logout
        </button>
      </div>
    </main>
  );
}