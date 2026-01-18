import React from "react";
import { Link } from "react-router-dom";

export default function otoritasMenu({ role }) {
  return (
    <div>
      <h2>Menu Otoritas</h2>
      <ul>
        {role === "administrator" && (
          <li><Link to="/LaporanList">Laporan Barang Masuk</Link></li>
        )}
        {role === "staff" && (
          <li><span style={{ color: "gray" }}>Laporan Barang Masuk (Tidak diizinkan)</span></li>
        )}
      </ul>
    </div>
  );
}
