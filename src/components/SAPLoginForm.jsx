import React, { useState } from "react";
import "../styles/sap-style.css";
import { useNavigate } from "react-router-dom";

export default function SAPLoginForm({ onLogin, selectedSystem }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async () => {
    if (!username || !password) {
      alert("Username dan Password harus diisi");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch("http://localhost:3000/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password, system: selectedSystem }),
      });

      
      const data = await response.json();
      if (data.status === "success") {
        console.log("✓ Backend login success", data);
        onLogin(data.user?.username || username);

        if (selectedSystem === "PRD-1") {
          navigate("/MenuPRD1");
        } else if (selectedSystem === "PRD-2") {
          navigate("/MenuPRD2");
        }
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
    </div>
  );
}
