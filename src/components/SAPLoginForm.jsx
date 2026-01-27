import React, { useState } from "react";
import axios from "axios"; // ✅ jangan lupa import axios
import "../styles/sap-style.css";
import { useNavigate } from "react-router-dom";

export default function SAPLoginForm({ onLogin }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const testBackend = async () => {
  try {
    const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/test`);
    console.log("✓ Backend aktif:", response.data);
    alert("Backend aktif: " + response.data.message);
  } catch (error) {
    console.error("❌ Backend tidak terhubung:", error);
    alert("Gagal konek ke backend: " + error.message);
  }
};


  const handleLogin = async () => {
    if (!username || !password) {
      alert("Username dan Password harus diisi");
      return;
    }

    setLoading(true);
    try {
      // ✅ simpan response agar bisa ambil response.data
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/login`,
        { username, password },
        {
          headers: { "Content-Type": "application/json" },
          
        }
      );

      const data = response.data;
      if (data.status === "success") {
        console.log("✓ Login success", data);
        onLogin(data.user?.username || username);
        navigate("/MenuPRD1"); // arahkan ke menu setelah login
      } else {
        alert("Login failed: " + (data.message || "Unknown error"));
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Network Error: " + error.message);
    } finally {
      setLoading(false);
    }

    
  };

  return (
    <div className="sap-login-form">
      <h2>SAP Login</h2>
      <input
        type="text"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        placeholder="Enter User ID"
        disabled={loading}
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Enter Password"
        disabled={loading}
      />
      <button onClick={handleLogin} disabled={loading}>
        {loading ? "Logging in..." : "Login"}
      </button>

      <button onClick={testBackend} disabled={loading}>
  Test Backend
</button>

    </div>

    
  );
}
