import React, { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import "../styles/sap-style.css";

export default function BarangMasukForm() {
  const [nomorDokumen, setNomorDokumen] = useState("");
  const [tanggalMasuk, setTanggalMasuk] = useState("");
  const [jenisMasuk, setJenisMasuk] = useState("");
  const [pengirim, setPengirim] = useState("");
  const [cabangTujuan, setCabangTujuan] = useState("");
  const [noPO, setNoPO] = useState("");
  const [noDokumen, setNoDokumen] = useState("");
  const [alasanRetur, setAlasanRetur] = useState("");
  const [validated, setValidated] = useState(false);

  const [barangInput, setBarangInput] = useState({
    kode_barang: "",
    qty: ""
  });

  const [barangList, setBarangList] = useState([]);
  const [loadingAdd, setLoadingAdd] = useState(false);

  const payload = {
    nomor_dokumen: nomorDokumen,
    tanggal_masuk: tanggalMasuk,
    jenis_masuk: jenisMasuk,
    pengirim,
    cabang_tujuan_id: parseInt(cabangTujuan),
    no_purchase_order: noPO,
    no_dokumen: noDokumen,
    alasan_retur: jenisMasuk === "retur" ? alasanRetur : null,
    created_by: 1
  };

  // ✅ Fetch data surat jalan & barang masuk berdasarkan nomor dokumen
  const handleFetchSuratJalan = async (nomorSJ) => {
    if (!nomorSJ) return;
    
    try {
      // 1. Fetch semua surat jalan, cari yang match
      const suratResult = (await axios.get(`${import.meta.env.VITE_BACKEND_URL}/surat-jalan`)).data;
      
      if (suratResult.status === "success" && suratResult.data) {
        const suratFound = suratResult.data.find(s => s.nomor_surat_jalan === nomorSJ);
        
        if (suratFound) {
          setTanggalMasuk(suratFound.tanggal_surat || "");
          setPengirim(suratFound.pengirim || "");
          setCabangTujuan(suratFound.cabang_tujuan_id || "");
          setNoPO(suratFound.no_purchase_order || "");
        }
      }

      // 2. Fetch semua barang masuk, cari yang match dengan nomor dokumen
      const barangResult = (await axios.get(`${import.meta.env.VITE_BACKEND_URL}/barang-masuk`)).data;
      
      if (barangResult.status === "success" && barangResult.data) {
        const barangFound = barangResult.data.find(b => b.nomor_dokumen === nomorSJ);
        
        if (barangFound) {
          setTanggalMasuk(barangFound.tanggal_masuk || "");
          setPengirim(barangFound.pengirim || "");
          setCabangTujuan(barangFound.cabang_tujuan_id || "");
          setNoPO(barangFound.no_purchase_order || "");
          setNoDokumen(barangFound.no_dokumen || "");
          setJenisMasuk(barangFound.jenis_masuk || "");
          setAlasanRetur(barangFound.alasan_retur || "");
        } else if (!suratResult.data?.find(s => s.nomor_surat_jalan === nomorSJ)) {
          alert("⚠️ Nomor dokumen tidak ditemukan di surat jalan maupun barang masuk");
        }
      }
    } catch (error) {
      console.error("Error fetch data:", error);
    }
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
      const result = (await axios.get(`${import.meta.env.VITE_BACKEND_URL}/barang/${kode_barang}`)).data;

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

  // ✅ Validasi sebelum simpan
  const handleValidate = async () => {
    if (!nomorDokumen || !tanggalMasuk || !jenisMasuk || !pengirim || !cabangTujuan) {
      alert("❌ Semua field wajib harus diisi");
      return;
    }
    if (jenisMasuk === "retur" && !alasanRetur) {
      alert("❌ Alasan retur wajib diisi jika jenis masuk = retur");
      return;
    }

    try {
      // 🔍 Cek apakah nomor_dokumen sudah ada di DB
      const existingData = (await axios.get(`${import.meta.env.VITE_BACKEND_URL}/barang-masuk`)).data;

      const exists = existingData.data.some(item => item.nomor_dokumen === nomorDokumen);
      if (exists) {
        alert("❌ Nomor dokumen sudah ada, gunakan nomor lain");
        return;
      }

      alert("✅ Data valid, silakan simpan");
      setValidated(true);

    } catch (error) {
      console.error("Error:", error);
      alert("❌ Network Error: " + error.message);
    }
  };

  // ✅ Simpan ke DB
  const handleSubmit = async () => {
    try {
      const data = (await axios.post(`${import.meta.env.VITE_BACKEND_URL}/barang-masuk`, payload)).data;
      if (data.status === "success") {
        alert("✅ Barang Masuk berhasil disimpan");
        // Tidak reset form, biarkan data tetap ada
      } else {
        alert("❌ Gagal simpan: " + (data.message || "Unknown error"));
      }
    } catch (error) {
      console.error("Error:", error);
      alert("❌ Network Error: " + error.message);
    }
  };

  const handlePrint = () => {
    const printNode = document.getElementById("print-area");
    if (!printNode) {
      alert("Print area tidak ditemukan");
      return;
    }
    
    // Buat window baru untuk print
    const printWindow = window.open('', '', 'height=800,width=900');
    const printContent = printNode.innerHTML;
    
    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="UTF-8">
          <title>BARANG MASUK</title>
          <link rel="stylesheet" href="${window.location.origin}/src/styles/sap-style.css">
          <style>
            body { font-family: Arial, sans-serif; font-size: 11px; color: #000; background: white; padding: 20px; margin: 0; }
            * { margin: 0; padding: 0; box-sizing: border-box; }
            table { width: 100%; border-collapse: collapse; }
            td { padding: 4px; text-align: left; }
            th { padding: 4px; text-align: left; font-weight: bold; background-color: #e8e8e8; border: 1px solid #000; }
            td, th { border: 1px solid #000; }
            hr { margin: 10px 0; border: none; border-top: 1px solid #000; }
            h1 { margin: 0 0 15px 0; font-size: 14px; text-align: center; border-bottom: 2px solid #000; padding-bottom: 10px; }
            .content-box { border: 2px solid #000; padding: 15px; margin-top: 10px; }
            div { margin-bottom: 0; }
            strong { font-weight: bold; }
          </style>
        </head>
        <body>
          ${printContent}
        </body>
      </html>
    `);
    
    printWindow.document.close();
    
    // Tunggu sebentar, baru print
    setTimeout(() => {
      printWindow.focus();
      printWindow.print();
    }, 250);
  };

  return (
    <div className="sales-form-wrapper">
      <div className="sales-form-card">
        <h2>Input Barang Masuk</h2>

        <div className="section">
          <label>Nomor Dokumen</label>
          <input 
            type="text" 
            value={nomorDokumen} 
            onChange={(e) => setNomorDokumen(e.target.value)}
            onBlur={(e) => handleFetchSuratJalan(e.target.value)}
            placeholder="Masukkan nomor surat jalan"
          />
        </div>

        <div className="section">
          <label>Tanggal Masuk</label>
          <input type="date" value={tanggalMasuk} onChange={(e) => setTanggalMasuk(e.target.value)} />
        </div>

        <div className="section">
          <label>Jenis Masuk</label>
          <select value={jenisMasuk} onChange={(e) => setJenisMasuk(e.target.value)}>
            <option value="">-- Pilih Jenis Masuk --</option>
            <option value="titipan">Titipan</option>
            <option value="retur">Retur</option>
          </select>
        </div>

        {jenisMasuk === "retur" && (
          <div className="section">
            <label>Alasan Retur</label>
            <textarea value={alasanRetur} onChange={(e) => setAlasanRetur(e.target.value)}></textarea>
          </div>
        )}

        <div className="section">
          <label>Pengirim</label>
          <input type="text" value={pengirim} onChange={(e) => setPengirim(e.target.value)} />
        </div>

        <div className="section">
          <label>Cabang Tujuan ID</label>
          <input type="number" value={cabangTujuan} onChange={(e) => setCabangTujuan(e.target.value)} />
        </div>

        <div className="section">
          <label>No. Purchase Order</label>
          <input 
            type="text" 
            value={noPO} 
            onChange={(e) => setNoPO(e.target.value)}
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
          
          {/* Header */}
          <div className="print-header">
            <h1>BARANG MASUK</h1>
          </div>

          {/* Main Content Box */}
          <div style={{ border: "2px solid #000", padding: "15px" }}>
            
            {/* Info Section */}
            <div className="print-info-section">
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <tbody>
                  <tr>
                    <td style={{ width: "50%", paddingBottom: "8px", paddingRight: "10px" }}>
                      <div><strong>Nomor Dokumen</strong></div>
                      <div>{nomorDokumen}</div>
                    </td>
                    <td style={{ width: "50%", paddingBottom: "8px", paddingLeft: "10px" }}>
                      <div><strong>Tanggal Masuk</strong></div>
                      <div>{tanggalMasuk}</div>
                    </td>
                  </tr>
                  <tr>
                    <td style={{ paddingBottom: "8px", paddingRight: "10px" }}>
                      <div><strong>Pengirim</strong></div>
                      <div>{pengirim}</div>
                    </td>
                    <td style={{ paddingBottom: "8px", paddingLeft: "10px" }}>
                      <div><strong>Jenis Masuk</strong></div>
                      <div>{jenisMasuk}</div>
                    </td>
                  </tr>
                  <tr>
                    <td style={{ paddingRight: "10px" }}>
                      <div><strong>Cabang Tujuan ID</strong></div>
                      <div>{cabangTujuan}</div>
                    </td>
                    <td style={{ paddingLeft: "10px" }}>
                      <div><strong>No. Purchase Order</strong></div>
                      <div>{noPO || "-"}</div>
                    </td>
                  </tr>
                  <tr>
                    <td style={{ paddingRight: "10px" }}>
                      {jenisMasuk === "retur" && (
                        <>
                          <div><strong>Alasan Retur</strong></div>
                          <div>{alasanRetur}</div>
                        </>
                      )}
                    </td>
                    <td style={{ paddingLeft: "10px" }}></td>
                  </tr>
                </tbody>
              </table>
            </div>

            <hr style={{ margin: "10px 0" }} />

            {/* Barang Table */}
            {barangList.length > 0 && (
              <div style={{ marginBottom: "15px" }}>
                <table className="print-barang-table">
                  <thead>
                    <tr>
                      <th>No</th>
                      <th>Kode Barang</th>
                      <th>Nama Barang</th>
                      <th className="col-qty">Qty</th>
                      <th className="col-satuan">Satuan</th>
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
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            <hr style={{ margin: "10px 0" }} />

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
          {!validated ? (
            <button onClick={handleValidate} className="btn-validate">Validate</button>
          ) : (
            <>
              <button onClick={handleSubmit} className="btn-zmme0011">Simpan</button>
              <button onClick={handlePrint} className="btn-validate">🖨️ Cetak</button>
            </>
          )}
          <Link to="/Pilihan" className="kembali">Kembali</Link>
        </div>
      </div>
    </div>
  );
}
