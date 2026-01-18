CREATE DATABASE IF NOT EXISTS sap_logon;
USE sap_logon;

CREATE TABLE IF NOT EXISTS users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL
);

INSERT INTO users (username, password) VALUES 
('admin', 'admin123'),
('rifki', 'rifki123');