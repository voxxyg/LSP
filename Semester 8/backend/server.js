import express from "express";
import mysql from "mysql";
import bodyParser from "body-parser";
import cors from "cors";

const app = express();
app.use(bodyParser.json());
app.use(cors());

// Konfigurasi koneksi MySQL
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'data_karyawan'
});

// Menguji koneksi ke database
db.connect((err) => {
    if (err) {
        throw err;
    }
    console.log('Terhubung ke database');
});

// HRD/Admin Login
app.post('/login', (req, res) => {
    const { username, password } = req.body;
    const sql = 'SELECT * FROM HRD WHERE username = ?';
    db.query(sql, username, (err, results) => {
        if (err) {
            return res.status(500).json({ success: false, message: 'Error saat login', error: err.message });
        }
        if (results.length === 0) {
            return res.status(404).json({ success: false, message: 'User tidak ditemukan' });
        }
        const user = results[0];
        const passwordIsValid = password === user.password;
        if (!passwordIsValid) {
            return res.status(401).json({ success: false, message: 'Password salah' });
        }
        res.json({ success: true, message: 'Login berhasil' });
    });
});

// Menambahkan karyawan
app.post('/karyawan', (req, res) => {
    let data = {
        NIP: req.body.nip,
        nama: req.body.nama,
        jabatan: req.body.jabatan,
        gaji_pokok: req.body.gaji_pokok,
        PPH: "5%"
    };

    if (data.jabatan === "Manager") {
        data.bonus = "50%"
    } else if (data.jabatan === "Supervisor") {
        data.bonus = "40%"
    } else {
        data.bonus = "30%"
    }
    
    let sql = 'INSERT INTO Karyawan SET ?';
    db.query(sql, data, (err, results) => {
        if (err) {
            return res.status(500).json({ success: false, message: 'Error saat menambahkan data', error: err.message });
        }
        res.status(201).json({ success: true, message: 'Data berhasil ditambahkan', results: results });
    });
});

// Melihat semua karyawan
app.get('/karyawan', (req, res) => {
    let sql = 'SELECT * FROM Karyawan';
    db.query(sql, (err, results) => {
        if (err) {
            return res.status(500).json({ success: false, message: 'Error saat mengambil data', error: err.message });
        }
        res.json({ success: true, data: results });
    });
});

// Edit Data Karyawan Menggunakan NIP Karyawan
app.put('/karyawan/:nip', (req, res) => {
    let data = {
        nama: req.body.nama,
        jabatan: req.body.jabatan,
        gaji_pokok: req.body.gaji_pokok
    };
    let sql = 'UPDATE Karyawan SET ? WHERE NIP = ?';
    db.query(sql, data, req.params.nip, (err, results) => {
        if (err) {
            return res.status(500).json({ success: false, message: 'Error saat mengedit data', error: err.message });
        }
        res.json({ success: true, message: 'Data berhasil diupdate', results: results });
    });
});

// Menghapus karyawan
app.delete('/karyawan/:nip', (req, res) => {
    let sql = 'DELETE FROM Karyawan WHERE NIP = ?';
    db.query(sql, req.params.nip, (err, results) => {
        if (err) {
            return res.status(500).json({ success: false, message: 'Error saat menghapus data', error: err.message });
        }
        res.json({ success: true, message: 'Data berhasil dihapus', results: results });
    });
});

// Menambahkan laporan gaji
app.post('/laporan_gaji', (req, res) => {
    let data = {
        bulan: req.body.bulan,
        tahun: req.body.tahun,
        karyawan_nip: req.body.nip
    };
    
    // Mendapatkan semua karyawan untuk perhitungan gaji
    let getKaryawanSql = 'SELECT * FROM Karyawan WHERE NIP = ?';
    db.query(getKaryawanSql, data.karyawan_nip, (err, karyawanResults) => {
        if (err) {
            return res.status(500).json({ success: false, message: 'Error saat mengambil data karyawan', error: err.message });
        }

        let bonus = 0;
        let pph = 0;
        const gajiPokok = karyawanResults.map(values => values.gaji_pokok)[0]
        const jabatan = karyawanResults.map(values => values.jabatan)[0]

        // Menghitung bonus
        if (jabatan === 'Manager') {
            bonus = gajiPokok * 0.50;
        } else if (jabatan === 'Supervisor') {
            bonus = gajiPokok * 0.40;
        } else {
            bonus = gajiPokok * 0.30;
        }

        
        let gajiTotal = gajiPokok + bonus;
        pph = gajiTotal * 0.05; 
        gajiTotal -= pph;

        let laporanGajiData = {
            bulan: data.bulan,
            tahun: data.tahun,
            karyawan_nip: data.karyawan_nip,
            gaji_total: gajiTotal
        };

        let insertLaporanGajiSql = 'INSERT INTO LaporanGaji SET ?';
        db.query(insertLaporanGajiSql, laporanGajiData, (err, results) => {
            if (err) {
                return res.status(500).json({ success: false, message: 'Error saat menambahkan laporan gaji', error: err.message });
            }
        });


        res.status(201).json({ success: true, message: 'Laporan gaji berhasil dibuat' });
    });
});

// Mendapatkan laporan gaji
app.get('/laporan_gaji/:bulan', (req, res) => {
    let sql = 'SELECT * FROM LaporanGaji JOIN Karyawan ON (LaporanGaji.karyawan_nip = Karyawan.NIP) WHERE bulan = ?';
    db.query(sql, req.params.bulan, (err, results) => {
        if (err) {
            return res.status(500).json({ success: false, message: 'Error saat mengambil data', error: err.message });
        }
        res.json({ success: true, data: results });
    });
});

// Mendapatkan Slip Gaji
app.get('/slip_gaji/:nip', (req, res) => {
    let sql = 'SELECT * FROM LaporanGaji JOIN Karyawan ON (LaporanGaji.karyawan_nip = Karyawan.NIP) WHERE NIP = ?';
    db.query(sql, req.params.nip ,(err, results) => {
        if (err) {
            return res.status(500).json({ success: false, message: 'Error saat mengambil data', error: err.message });
        }
        res.json({ success: true, data: results });
    });
});

// Menjalankan server
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`Server berjalan pada port ${PORT}`);
});

export {
    app
}