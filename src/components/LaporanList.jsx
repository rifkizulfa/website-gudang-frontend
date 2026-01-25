import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import "../styles/sap-style.css";

export default function LaporanList() {
  const [laporanMasuk, setLaporanMasuk] = useState([]);
  const [laporanKeluar, setLaporanKeluar] = useState([]);

  useEffect(() => {
    axios.get(`${import.meta.env.VITE_BACKEND_URL}/barang-masuk`)
      .then(res => setLaporanMasuk(res.data.data))
      .catch(err => alert("Gagal ambil data barang masuk: " + err.message));

    axios.get(`${import.meta.env.VITE_BACKEND_URL}/surat-jalan`)
      .then(res => setLaporanKeluar(res.data.data))
      .catch(err => alert("Gagal ambil data barang keluar: " + err.message));
  }, []);

  return (
    <div className="laporan-container" style={{ color: "black" }}>
      <div className="laporan-section">
        <h2>Laporan Barang Masuk</h2>
        <table className="laporan-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>No. Dokumen</th>
              <th>Pengirim</th>
              <th>Tanggal Masuk</th>
            </tr>
          </thead>
          <tbody>
            {laporanMasuk.map(l => (
              <tr key={l.id}>
                <td>{l.id}</td>
                <td>{l.nomor_dokumen}</td>
                <td>{l.pengirim}</td>
                <td>{l.tanggal_masuk}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="laporan-section">
        <h2>Laporan Barang Keluar</h2>
        <table className="laporan-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>No. Surat Jalan</th>
              <th>Pengirim</th>
              <th>Tanggal Surat</th>
            </tr>
          </thead>
          <tbody>
            {laporanKeluar.map(l => (
              <tr key={l.id}>
                <td>{l.id}</td>
                <td>{l.nomor_surat_jalan}</td>
                <td>{l.pengirim}</td>
                <td>{l.tanggal_surat}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Link to="/MenuPRD1" className="kembali">Kembali ke Menu</Link>
    </div>
  );
}
