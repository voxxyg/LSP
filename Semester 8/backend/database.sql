USE data_karyawan;

CREATE TABLE Karyawan (
    NIP VARCHAR(10) PRIMARY KEY,
    nama VARCHAR(100) NOT NULL,
    jabatan ENUM('Manager', 'Supervisor', 'Staff') NOT NULL,
    gaji_pokok DECIMAL(10, 2) NOT NULL
);

CREATE TABLE HRD (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nama VARCHAR(100) NOT NULL,
    username VARCHAR(50) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL
);

CREATE TABLE LaporanGaji (
    id INT AUTO_INCREMENT PRIMARY KEY,
    bulan INT NOT NULL,
    tahun INT NOT NULL,
    tanggal_dibuat TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE GajiKaryawan (
    id INT AUTO_INCREMENT PRIMARY KEY,
    karyawan_nip VARCHAR(10) NOT NULL,
    laporan_gaji_id INT NOT NULL,
    gaji_total DECIMAL(10, 2) NOT NULL,
    FOREIGN KEY (karyawan_nip) REFERENCES Karyawan(NIP),
    FOREIGN KEY (laporan_gaji_id) REFERENCES LaporanGaji(id)
);

DESC GajiKaryawan;

INSERT INTO HRD (name, username, password) VALUES ("Prayoga Danuarta", "Prayoga", "password123");

ALTER TABLE LaporanGaji
    ADD COLUMN karyawan_nip VARCHAR(10) NOT NULL,
    ADD COLUMN gaji_total DECIMAL(10, 2) NOT NULL;

ALTER TABLE LaporanGaji
    ADD CONSTRAINT fk_karyawan_nip FOREIGN KEY (karyawan_nip) REFERENCES Karyawan(NIP);

ALTER TABLE LaporanGaji
    MODIFY bulan VARCHAR(10) NOT NULL;

ALTER TABLE Karyawan
    ADD COLUMN bonus VARCHAR(5) NOT NULL;