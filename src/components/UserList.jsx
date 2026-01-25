import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import "../styles/sap-style.css";

export default function UserList() {
  const [users, setUsers] = useState([]);
  const [newUsername, setNewUsername] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [newRoleId, setNewRoleId] = useState("");
  const [editId, setEditId] = useState(null);
  const [editUsername, setEditUsername] = useState("");
  const [editPassword, setEditPassword] = useState("");
  const [editRoleId, setEditRoleId] = useState("");

  // Ambil data user
  const fetchUsers = () => {
    axios.get(`${import.meta.env.VITE_BACKEND_URL}/users`)
      .then(res => setUsers(res.data.data))
      .catch(err => alert("Gagal ambil data: " + err.message));
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Tambah user
  const handleAddUser = async () => {
    if (!newUsername || !newPassword || !newRoleId) {
      alert("Username, Password, dan Role ID wajib diisi");
      return;
    }
    try {
      const data = (await axios.post(`${import.meta.env.VITE_BACKEND_URL}/users`, { username: newUsername, password: newPassword, role_id: newRoleId })).data;
      if (data.status === "success") {
        alert("✅ User berhasil ditambahkan");
        setNewUsername("");
        setNewPassword("");
        setNewRoleId("");
        fetchUsers();
      } else {
        alert("❌ Gagal tambah user: " + data.message);
      }
    } catch (err) {
      console.error(err);
      alert("❌ Error: " + err.message);
    }
  };

  // Update user
  const handleUpdateUser = async () => {
    if (!editUsername && !editPassword && !editRoleId) {
      alert("Isi username, password, atau role ID untuk update");
      return;
    }
    try {
      const data = (await axios.put(`${import.meta.env.VITE_BACKEND_URL}/users/${editId}`, { username: editUsername, password: editPassword, role_id: editRoleId })).data;
      if (data.status === "success") {
        alert("✅ User berhasil diupdate");
        setEditId(null);
        setEditUsername("");
        setEditPassword("");
        setEditRoleId("");
        fetchUsers();
      } else {
        alert("❌ Gagal update user: " + data.message);
      }
    } catch (err) {
      console.error(err);
      alert("❌ Error: " + err.message);
    }
  };

  // Hapus user
  const handleDeleteUser = async (id) => {
    if (!window.confirm("Yakin hapus user ini?")) return;
    try {
      const data = (await axios.delete(`${import.meta.env.VITE_BACKEND_URL}/users/${id}`)).data;
      if (data.status === "success") {
        alert("✅ User berhasil dihapus");
        fetchUsers();
      } else {
        alert("❌ Gagal hapus user: " + data.message);
      }
    } catch (err) {
      console.error(err);
      alert("❌ Error: " + err.message);
    }
  };

  return (
    <div className="userlist-container" style={{ color: "black" }}>
      <h2>Daftar Akun Login</h2>

      {/* Form tambah user */}
      <div className="add-user-form">
        <input
          type="text"
          placeholder="Username baru"
          value={newUsername}
          onChange={(e) => setNewUsername(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password baru"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
        />
        <input
          type="number"
          placeholder="Role ID"
          value={newRoleId}
          onChange={(e) => setNewRoleId(e.target.value)}
        />
        <button onClick={handleAddUser}>Tambah User</button>
      </div>

      {/* Form edit user */}
      {editId && (
        <div className="edit-user-form">
          <h3>Edit User ID {editId}</h3>
          <input
            type="text"
            placeholder="Username baru"
            value={editUsername}
            onChange={(e) => setEditUsername(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password baru"
            value={editPassword}
            onChange={(e) => setEditPassword(e.target.value)}
          />
          <input
            type="number"
            placeholder="Role ID"
            value={editRoleId}
            onChange={(e) => setEditRoleId(e.target.value)}
          />
          <button onClick={handleUpdateUser}>Update User</button>
          <button onClick={() => setEditId(null)}>Batal</button>
        </div>
      )}

      {/* Tabel user */}
      <table className="userlist-table" style={{ color: "black" }}>
        <thead>
          <tr>
            <th>ID</th>
            <th>Username</th>
            <th>Role ID</th>
            <th>Aksi</th>
          </tr>
        </thead>
        <tbody>
          {users.map(u => (
            <tr key={u.id}>
              <td>{u.id}</td>
              <td>{u.username}</td>
              <td>{u.role_id}</td>
              <td>
                <button onClick={() => {
                  setEditId(u.id);
                  setEditUsername(u.username);
                  setEditRoleId(u.role_id);
                }}>Edit</button>
                <button onClick={() => handleDeleteUser(u.id)}>Hapus</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <Link to="/MenuPRD1" className="kembali">Kembali ke Menu</Link>
    </div>
  );
}