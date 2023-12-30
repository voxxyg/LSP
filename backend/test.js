const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());

// Konfigurasi koneksi MySQL
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'mahasiswa_db'
});

// Menguji koneksi ke database
db.connect((err) => {
    if (err) { throw err; }
    console.log('Terhubung ke database');
});

// Endpoint untuk membuat (Create) data mahasiswa
app.post('/mahasiswa', (req, res) => {
    let data = { nama: req.body.nama, alamat: req.body.alamat };
    let sql = 'INSERT INTO mahasiswa SET ?';
    db.query(sql, data, (err, results) => {
        if (err) throw err;
        res.send(JSON.stringify(results));
    });
});

// Endpoint untuk membaca (Read) data mahasiswa
app.get('/mahasiswa', (req, res) => {
    let sql = 'SELECT * FROM mahasiswa';
    db.query(sql, (err, results) => {
        if (err) throw err;
        res.send(JSON.stringify(results));
    });
});

// Endpoint untuk mengubah (Update) data mahasiswa
app.put('/mahasiswa/:id', (req, res) => {
    let data = [req.body.nama, req.body.alamat, req.params.id];
    let sql = 'UPDATE mahasiswa SET nama = ?, alamat = ? WHERE id = ?';
    db.query(sql, data, (err, results) => {
        if (err) throw err;
        res.send(JSON.stringify(results));
    });
});

// Endpoint untuk menghapus (Delete) data mahasiswa
app.delete('/mahasiswa/:id', (req, res) => {
    let sql = 'DELETE FROM mahasiswa WHERE id = ' + req.params.id;
    db.query(sql, (err, results) => {
        if (err) throw err;
        res.send(JSON.stringify(results));
    });
});

app.post('/kelas', (req, res) => {
    let data = { id: req.body.id, kelas: req.body.kelas };
    let sql = 'INSERT INTO kelas SET ?';
    db.query(sql, data, (err, results) => {
        if (err) throw err;
        res.send(JSON.stringify(results));
    });
});

app.get('/kelas', (req, res) => {
    let sql = 'SELECT * FROM kelas';
    db.query(sql, (err, results) => {
        if (err) throw err;
        res.send(JSON.stringify(results));
    });
});

app.put('/kelas/:id', (req, res) => {
    let data = [req.body.kelas, req.params.id];
    let sql = 'UPDATE kelas SET kelas = ? WHERE id = ?';
    db.query(sql, data, (err, results) => {
        if (err) throw err;
        res.send(JSON.stringify(results));
    });
});

app.delete('/kelas/:id', (req, res) => {
    let sql = 'DELETE FROM kelas WHERE id = ' + req.params.id;
    db.query(sql, (err, results) => {
        if (err) throw err;
        res.send(JSON.stringify(results));
    });
});

app.get('/mahasiswa/detail/:id', (req, res) => {
    let sql = `
        SELECT mahasiswa.id, mahasiswa.nama, mahasiswa.alamat, kelas.kelas 
        FROM mahasiswa 
        JOIN kelas ON mahasiswa.id = kelas.id 
        WHERE mahasiswa.id = ?
    `;
    db.query(sql, [req.params.id], (err, result) => {
        if (err) throw err;
        res.send(JSON.stringify(result));
    });
});

// Menjalankan server pada port 3000
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server berjalan di port ${PORT}`);
});