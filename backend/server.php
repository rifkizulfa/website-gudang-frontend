<?php
header("Content-Type: application/json");

// koneksi ke PostgreSQL
$host = "localhost";
$dbname = "dbsap";
$user = "postgres";
$pass = "rifki4";

try {
    $pdo = new PDO("pgsql:host=$host;dbname=$dbname", $user, $pass);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch (PDOException $e) {
    echo json_encode(["status" => "error", "message" => "DB connection failed"]);
    exit;
}

// ambil data dari request
$data = json_decode(file_get_contents("php://input"), true);
$username = $data['username'] ?? '';
$password = $data['password'] ?? '';
$system   = $data['system'] ?? '';

if (!$username || !$password) {
    echo json_encode(["status" => "error", "message" => "Username dan Password harus diisi"]);
    exit;
}

// cek user
$stmt = $pdo->prepare("SELECT * FROM users WHERE username = ?");
$stmt->execute([$username]);
$user = $stmt->fetch(PDO::FETCH_ASSOC);

if (!$user) {
    echo json_encode(["status" => "error", "message" => "User tidak ditemukan"]);
    exit;
}

// cek password (plain text dulu)
if ($password !== $user['password']) {
    echo json_encode(["status" => "error", "message" => "Password salah"]);
    exit;
}

// sukses
echo json_encode([
    "status" => "success",
    "user" => ["id" => $user['id'], "username" => $user['username']],
    "system" => $system
]);
