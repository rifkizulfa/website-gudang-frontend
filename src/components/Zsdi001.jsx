import React, { useState } from "react";
import { Link } from "react-router-dom";
import "../styles/sap-style.css";

const OPTIONS = ["CB001", "CB002", "CB003"];

export default function Zsdi001() {
  const [formData, setFormData] = useState({
    nomor_surat_jalan: "",
    tanggal_surat: "",
    pengirim: "",
    tujuan: "",
    cabang_tujuan_id: "",
    dikirim_oleh: "",
    no_purchase_order: "",
    no_dokumen: "",
    created_by: 1
  });

  const [barangInput, setBarangInput] = useState({
    kode_barang: "",
    qty: ""
  });

  const [barangList, setBarangList] = useState([]);
  const [loadingSave, setLoadingSave] = useState(false);
  const [loadingAdd, setLoadingAdd] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleBarangChange = (e) => {
    const { name, value } = e.target;
    setBarangInput(prev => ({ ...prev, [name]: value }));
  };

  const handleAddBarang = async () => {
    const { kode_barang, qty } = barangInput;
    if (!kode_barang || !qty) {
      alert("Kode barang dan Qty wajib diisi");
      return;
    }
    setLoadingAdd(true);
    try {
      const response = await fetch(`http://localhost:3000/barang/${kode_barang}`);
      const result = await response.json();

      if (result.status === "success" && result.data) {
        const barangDetail = result.data;
        setBarangList(prev => [
          ...prev,
          { ...barangDetail, qty: Number(qty) }
        ]);
        setBarangInput({ kode_barang: "", qty: "" });
      } else {
        alert(result.message || "Barang tidak ditemukan di database");
      }
    } catch (err) {
      console.error("Error fetch barang:", err);
      alert("Terjadi error saat mencari barang");
    } finally {
      setLoadingAdd(false);
    }
  };

  const handleDeleteBarang = (index) => {
    setBarangList(prev => prev.filter((_, i) => i !== index));
  };

  const handleValidateAndSave = async () => {
    const { nomor_surat_jalan, tanggal_surat, pengirim, tujuan, cabang_tujuan_id, dikirim_oleh, created_by } = formData;
    if (!nomor_surat_jalan || !tanggal_surat || !pengirim || !tujuan || !cabang_tujuan_id || !dikirim_oleh || !created_by) {
      alert("Field wajib tidak boleh kosong");
      return;
    }
    if (barangList.length === 0) {
      alert("Minimal 1 barang harus ditambahkan");
      return;
    }

    setLoadingSave(true);
    try {
      const headerRes = await fetch("http://localhost:3000/surat-jalan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });
      const headerResult = await headerRes.json();

      if (headerResult.status === "success") {
        const suratJalanId = headerResult.data.id;

        for (const item of barangList) {
          await fetch("http://localhost:3000/surat-jalan-detail", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              surat_jalan_id: suratJalanId,
              kode_barang: item.kode_barang,
              nama_barang: item.nama_barang,
              satuan: item.satuan,
              qty: item.qty,
              deskripsi: item.deskripsi || null
            })
          });
        }

        alert("✅ Surat Jalan & detail berhasil disimpan!");
      } else {
        alert("Gagal simpan: " + (headerResult.message || "Unknown error"));
      }
    } catch (err) {
      console.error("Error:", err);
      alert("Terjadi error saat menyimpan: " + (err.message || err));
    } finally {
      setLoadingSave(false);
    }
  };

  const handlePrint = () => {
    const printWindow = window.open('', '', 'height=800,width=1000');
    const printContent = document.getElementById("print-area").innerHTML;
    
    printWindow.document.write(`
      <html>
        <head>
          <title>SURAT PENGIRIMAN BARANG</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 0; padding: 20px; color: #000; }
            table { width: 100%; border-collapse: collapse; }
            th, td { border: 1px solid #000; padding: 8px; text-align: left; }
            th { background-color: #e8e8e8; font-weight: bold; }
            .header { text-align: center; margin-bottom: 20px; border-bottom: 3px solid #000; padding-bottom: 10px; }
            .info-section { margin-bottom: 20px; }
            .signature { margin-top: 50px; }
            .sig-box { display: inline-block; width: 45%; text-align: center; vertical-align: top; margin-right: 5%; }
            .sig-box:last-child { margin-right: 0; }
          </style>
        </head>
        <body>
          ${printContent}
        </body>
      </html>
    `);
    
    printWindow.document.close();
    printWindow.print();
  };

  return (
    <div className="sales-form-wrapper">
      <div className="sales-form-card">
        <h2>Input Surat Jalan</h2>

        <div className="section">
          <label>Nomor Surat Jalan</label>
          <input name="nomor_surat_jalan" value={formData.nomor_surat_jalan} onChange={handleChange} required />
        </div>

        <div className="section">
          <label>Tanggal Surat</label>
          <input type="date" name="tanggal_surat" value={formData.tanggal_surat} onChange={handleChange} required />
        </div>

        <div className="section">
          <label>Pengirim</label>
          <select name="pengirim" value={formData.pengirim} onChange={handleChange} required>
            <option value="">-- Pilih Pengirim --</option>
            {OPTIONS.map((opt, i) => <option key={i} value={opt}>{opt}</option>)}
          </select>
        </div>

        <div className="section">
          <label>Tujuan</label>
          <select name="tujuan" value={formData.tujuan} onChange={handleChange} required>
            <option value="">-- Pilih Tujuan --</option>
            {OPTIONS.map((opt, i) => <option key={i} value={opt}>{opt}</option>)}
          </select>
        </div>

        <div className="section">
          <label>Cabang Tujuan ID</label>
          <input type="number" name="cabang_tujuan_id" value={formData.cabang_tujuan_id} onChange={handleChange} required />
        </div>

        <div className="section">
          <label>Dikirim Oleh</label>
          <input name="dikirim_oleh" value={formData.dikirim_oleh} onChange={handleChange} required />
        </div>

        <div className="section">
          <label>No. Purchase Order</label>
          <input 
            name="no_purchase_order" 
            value={formData.no_purchase_order} 
            onChange={handleChange}
            placeholder="Contoh: PO-2025-001"
          />
        </div>

        <hr />
        <h3>Tambah Barang (Kode + Qty)</h3>

        <div className="section">
          <label className="highlight-text">Kode Barang</label>
          <input
            name="kode_barang"
            value={barangInput.kode_barang}
            onChange={handleBarangChange}
            placeholder="Contoh: BRG001"
            required
          />
        </div>

        <div className="section">
          <label className="highlight-text">Qty</label>
          <input
            type="number"
            name="qty"
            value={barangInput.qty}
            onChange={handleBarangChange}
            min="1"
            required
          />
        </div>

        <button onClick={handleAddBarang} className="btn-add" disabled={loadingAdd}>
          {loadingAdd ? "Menambah..." : "Tambah Barang"}
        </button>

        <h4 className="section">Daftar Barang</h4>
        <ul className="section">
          {barangList.map((b, i) => (
            <li key={i} className="highlight-text">
              {b.kode_barang} - {b.nama_barang} ({b.satuan}) | Qty: {b.qty}
              <button onClick={() => handleDeleteBarang(i)} className="btn-delete">Hapus</button>
            </li>
          ))}
        </ul>

        {/* Layout cetak resmi */}
        <div id="print-area" style={{ display: "none" }}>
          <div>
            
            {/* Header */}
            <div className="print-header">
              <h1>SURAT PENGIRIMAN BARANG</h1>
            </div>

            {/* Info Section */}
            <div className="print-info-section">
              <table>
                <tbody>
                  <tr>
                    <td style={{ width: "50%", paddingBottom: "6px" }}>
                      <div><strong>Pengirim</strong></div>
                      <div style={{ marginLeft: "20px" }}>{formData.pengirim}</div>
                    </td>
                    <td style={{ width: "50%", paddingBottom: "6px" }}>
                      <div><strong>No. Surat Jalan</strong></div>
                      <div style={{ marginLeft: "20px" }}>{formData.nomor_surat_jalan}</div>
                    </td>
                  </tr>
                  <tr>
                    <td style={{ paddingBottom: "6px" }}>
                      <div><strong>Tujuan</strong></div>
                      <div style={{ marginLeft: "20px" }}>{formData.tujuan}</div>
                    </td>
                    <td style={{ paddingBottom: "6px" }}>
                      <div><strong>Tanggal</strong></div>
                      <div style={{ marginLeft: "20px" }}>{formData.tanggal_surat}</div>
                    </td>
                  </tr>
                  <tr>
                    <td style={{ paddingBottom: "6px" }}>
                      <div><strong>Dikirim Oleh</strong></div>
                      <div style={{ marginLeft: "20px" }}>{formData.dikirim_oleh}</div>
                    </td>
                    <td style={{ paddingBottom: "6px" }}>
                      <div><strong>No. Purchase Order</strong></div>
                      <div style={{ marginLeft: "20px" }}>{formData.no_purchase_order || "-"}</div>
                    </td>
                  </tr>
                  <tr>
                    <td style={{ paddingBottom: "6px" }}>
                      <div><strong>Cabang Tujuan ID</strong></div>
                      <div style={{ marginLeft: "20px" }}>{formData.cabang_tujuan_id}</div>
                    </td>
                    <td style={{ paddingBottom: "6px" }}></td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Barang Table */}
            <div style={{ marginBottom: "30px" }}>
              <table className="print-barang-table">
                <thead>
                  <tr>
                    <th>No</th>
                    <th>Kode Barang</th>
                    <th>Nama Barang</th>
                    <th className="col-qty">Qty</th>
                    <th className="col-satuan">Satuan</th>
                    <th>Keterangan</th>
                  </tr>
                </thead>
                <tbody>
                  {barangList.map((b, i) => (
                    <tr key={i}>
                      <td className="col-no">{i + 1}</td>
                      <td>{b.kode_barang}</td>
                      <td>{b.nama_barang}</td>
                      <td className="col-qty">{b.qty}</td>
                      <td className="col-satuan">{b.satuan}</td>
                      <td>{b.deskripsi || "-"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Signature Section */}
            <div className="print-signature-section">
              <table className="print-signature-table">
                <tbody>
                  <tr>
                    <td className="print-sig-box">
                      <div className="print-sig-line"></div>
                      <div className="print-sig-name">Pengirim</div>
                    </td>
                    <td className="print-sig-box">
                      <div className="print-sig-line"></div>
                      <div className="print-sig-name">Penerima</div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="button-group">
          <button onClick={handleValidateAndSave} className="btn-validate" disabled={loadingSave}>
            {loadingSave ? "Menyimpan..." : "Validate & Simpan"}
          </button>
          <button onClick={handlePrint} className="btn-validate">🖨️ Cetak</button>
          <Link to="/MenuPRD2" className="kembali">Kembali</Link>
        </div>
      </div>
    </div>
  );
}
