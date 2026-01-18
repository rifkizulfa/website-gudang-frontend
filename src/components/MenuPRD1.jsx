import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../styles/sap-style.css';

export default function MenuPRD1({ username, onLogout }) {
  const navigate = useNavigate();

  const handleLogoutClick = () => {
    onLogout();          
    navigate("/");    
  };

  return (
    <main className="menu-utama-wrap">
      <div className="menu-utama-card">
        <h1 className="menu-utama-title">Menu PRD-1</h1>
        <p className="menu-utama-user">Welcome, <strong>{username}</strong></p>

        <ul className="menu-list">
          <li>
            <Link to="/UserList" className="menu-item">
              <div className="menu-item-content">
                <span className="menu-code">1.</span>
              </div>
              <div>
                <span className="menu-label">Tampilkan data akun</span>
              </div>
            </Link>
            <Link to="/LaporanList" className="menu-item"> 
              <div className="menu-item-content"> 
                <span className="menu-code">2.</span> 
              </div> 
              <div> 
                <span className="menu-label">Lihat Laporan Barang </span> 
              </div> 
              </Link>
          </li>
        </ul>

        <button className="menu-logout-btn" onClick={handleLogoutClick}>
          Logout
        </button>
      </div>
    </main>
  );
}
