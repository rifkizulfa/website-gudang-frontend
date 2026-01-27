import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import SAPSystemSelector from './components/SAPSystemSelector';
import Zsdi002 from './components/zsdi002';
import Zmme0011 from './components/zmme0011';
import MenuPRD1 from './components/MenuPRD1';
import MenuPRD2 from './components/MenuPRD2';
import Pilihan from './components/Pilihan';
import Zsdi001 from './components/Zsdi001'; 
import UserList from './components/UserList';
import LaporanList from './components/LaporanList';
import OtoritasMenu from './components/OtoritasMenu'; 

function App() {
  const [loggedInUser, setLoggedInUser] = useState(null);

  useEffect(() => {
    // Optional: Cek koneksi backend
    axios.get(`${import.meta.env.VITE_BACKEND_URL}/`)
      .then(data => console.log("✓ Backend connected:", data))
      .catch(err => console.warn("⚠️ Backend tidak terhubung:", err));
  }, []);

  const handleLoginSuccess = (username) => {
    console.log('✓ Login Success:', username);
    setLoggedInUser(username);
  };

  const handleLogout = () => {
    setLoggedInUser(null);
  };

  return (
    <Router>
      <Routes>
        <Route path="/" element={<SAPSystemSelector onLogin={handleLoginSuccess} />} />
        
        <Route
          path="/MenuPRD1"
          element={
            loggedInUser ? (
              <MenuPRD1 username={loggedInUser} onLogout={handleLogout} />
            ) : (
              <SAPSystemSelector onLogin={handleLoginSuccess} />
            )
          }
        />
        
        <Route
          path="/MenuPRD2"
          element={
            loggedInUser ? (
              <MenuPRD2 username={loggedInUser} onLogout={handleLogout} />
            ) : (
              <SAPSystemSelector onLogin={handleLoginSuccess} />
            )
          }
        />
        
        <Route path="/zsdi002" element={<Zsdi002/>} />
        <Route path="/zmme0011" element={<Zmme0011/>} />
        <Route path="/Pilihan" element={<Pilihan />} />
        <Route path="/Zsdi001" element={<Zsdi001 />} />
        <Route path="/UserList" element={<UserList />} />
        <Route path="/LaporanList" element={<LaporanList />} />
        <Route path="/OtoritasMenu" element={<OtoritasMenu />} />
      </Routes>
    </Router>
  );
}

export default App;