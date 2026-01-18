import React from "react";
import { Link } from "react-router-dom";
import "../styles/sap-style.css";

export default function Zsdi002() {
  return (
    <div className="sales-form-wrapper">
      <div className="sales-form-card">
        <h2>ZSDI002 - Incoming Goods</h2>
        <p>Komponen ini sedang dalam tahap pengembangan.</p>
        <Link to="/Pilihan" className="kembali">Kembali</Link>
      </div>
    </div>
  );
}
