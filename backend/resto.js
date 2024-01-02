const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const { v4: uuidv4 } = require('uuid');
const cors = require('cors');
const bcrypt = require('bcrypt');

const app = express();
app.use(bodyParser.json());
app.use(cors());

// Konfigurasi koneksi MySQL
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'restoran'
});

// Menguji koneksi ke database
db.connect((err) => {
    if (err) { throw err; }
    console.log('Terhubung ke database');
});

app.post('/makanan_minuman', (req, res) => {
    let data = { jenis: req.body.jenis, nama: req.body.nama, harga: req.body.harga, stok: req.body.stok };
    let sql = 'INSERT INTO makanan_minuman SET ?';
    db.query(sql, data, (err, results) => {
        if (err) {
            return res.status(500).json({ success: false, message: 'Error saat menambahkan data', error: err.message });
        }
        res.status(201).json({ success: true, message: 'Data berhasil ditambahkan', results: results });
    });
});

app.get('/makanan_minuman', (req, res) => {
    let sql = 'SELECT * FROM makanan_minuman';
    db.query(sql, (err, results) => {
        if (err) {
            return res.status(500).json({ success: false, message: 'Error saat mengambil data', error: err.message });
        }
        res.json({ success: true, data: results });
    });
});

app.put('/makanan_minuman/:id', (req, res) => {
    let updateFields = { jenis: req.body.jenis, nama: req.body.nama, harga: req.body.harga, stok: req.body.stok };
    let sql = 'UPDATE makanan_minuman SET ';
    let updateData = [];

    for (let key in updateFields) {
        if (updateFields[key] !== undefined) {
            sql += `${key} = ?, `;
            updateData.push(updateFields[key]);
        }
    }

    sql = sql.slice(0, -2) + ' WHERE id = ?';
    updateData.push(req.params.id);

    db.query(sql, updateData, (err, results) => {
        if (err) {
            return res.status(500).json({ success: false, message: 'Error saat memperbarui data', error: err.message });
        }
        res.json({ success: true, message: 'Data berhasil diperbarui', results: results });
    });
});

app.delete('/makanan_minuman/:id', (req, res) => {
    let sql = 'DELETE FROM makanan_minuman WHERE id = ?';
    db.query(sql, [req.params.id], (err, results) => {
        if (err) {
            return res.status(500).json({ success: false, message: 'Error saat menghapus data', error: err.message });
        }
        res.json({ success: true, message: 'Data berhasil dihapus', results: results });
    });
});


// Stok

// app.post('/stok', (req, res) => {
//     let data = { id: req.body.id, stok: req.body.stok };
//     let sql = 'INSERT INTO stok SET ?';
//     db.query(sql, data, (err, results) => {
//         if (err) {
//             return res.status(500).json({ success: false, message: 'Error saat menambahkan stok', error: err.message });
//         }
//         res.status(201).json({ success: true, message: 'Stok berhasil ditambahkan', results: results });
//     });
// });

// app.get('/stok', (req, res) => {
//     let sql = 'SELECT * FROM stok';
//     db.query(sql, (err, results) => {
//         if (err) {
//             return res.status(500).json({ success: false, message: 'Error saat mengambil data stok', error: err.message });
//         }
//         res.json({ success: true, data: results });
//     });
// });

// app.put('/stok/:id', (req, res) => {
//     let data = [req.body.stok, req.params.id];
//     let sql = 'UPDATE stok SET stok = ? WHERE id = ?';
//     db.query(sql, data, (err, results) => {
//         if (err) {
//             return res.status(500).json({ success: false, message: 'Error saat memperbarui stok', error: err.message });
//         }
//         res.json({ success: true, message: 'Stok berhasil diperbarui', results: results });
//     });
// });

// app.delete('/stok/:id', (req, res) => {
//     let sql = 'DELETE FROM stok WHERE id = ?';
//     db.query(sql, [req.params.id], (err, results) => {
//         if (err) {
//             return res.status(500).json({ success: false, message: 'Error saat menghapus stok', error: err.message });
//         }
//         res.json({ success: true, message: 'Stok berhasil dihapus', results: results });
//     });
// });

// Show makanan_minuman with stok

// app.get('/makanan_minuman_stok', (req, res) => {
//     let sql = `
//         SELECT m.id, m.jenis, m.nama, m.harga, IFNULL(s.stok, 'Tidak tersedia') AS stok
//         FROM makanan_minuman m
//         LEFT JOIN stok s ON m.id = s.id
//     `;
//     db.query(sql, (err, results) => {
//         if (err) {
//             return res.status(500).json({ success: false, message: 'Error saat mengambil data', error: err.message });
//         }
//         res.json({ success: true, data: results });
//     });
// });


// Transaksi

app.post('/transaksi', (req, res) => {
    // Start a database transaction
    db.beginTransaction((err) => {
        if (err) { throw err; }

        let itemsProcessed = [];
        const items = req.body.items; // Expected to be an array of { id_makanan_minuman, jumlah }
        let totalHarga = 0;

        // Prepare the statement for getting prices and names
        const priceAndNameSql = 'SELECT id, harga, nama, stok FROM makanan_minuman WHERE id = ?';

        // A helper function to process each item
        const processItem = (index) => {
            if (index >= items.length) {
                // All items have been processed, now insert the transaction
                const insertTransaksiSql = 'INSERT INTO transaksi (items, total) VALUES (?, ?)';
                db.query(insertTransaksiSql, [JSON.stringify(itemsProcessed), totalHarga], (err, results) => {
                    if (err) {
                        return db.rollback(() => { throw err; });
                    }

                    // Commit the transaction
                    db.commit((err) => {
                        if (err) {
                            return db.rollback(() => { throw err; });
                        }
                        res.json({ success: true, message: 'Transaksi berhasil ditambahkan', totalHarga: totalHarga });
                    });
                });
                return;
            }

            const item = items[index];
            db.query(priceAndNameSql, [item.id_makanan_minuman], (err, makananMinumanResults) => {
                if (err) {
                    return db.rollback(() => { throw err; });
                }

                if (makananMinumanResults.length === 0) {
                    return db.rollback(() => {
                        res.status(404).json({ success: false, message: `Item dengan ID: ${item.id_makanan_minuman} tidak ditemukan.` });
                    });
                }

                const { harga, nama, stok } = makananMinumanResults[0];
                if (stok < item.jumlah) {
                    return db.rollback(() => {
                        res.status(400).json({ success: false, message: `Stok tidak cukup untuk item ${nama}.` });
                    });
                }

                const subtotal = harga * item.jumlah;
                totalHarga += subtotal;

                // Update stock in makanan_minuman
                const updateStokSql = 'UPDATE makanan_minuman SET stok = stok - ? WHERE id = ?';
                db.query(updateStokSql, [item.jumlah, item.id_makanan_minuman], (err, updateStokResults) => {
                    if (err) {
                        return db.rollback(() => { throw err; });
                    }

                    // Add the item, including its name and subtotal, to the list of processed items
                    itemsProcessed.push({ ...item, nama, subtotal, harga });

                    // Process the next item
                    processItem(index + 1);
                });
            });
        };

        // Start processing items
        processItem(0);
    });
});

app.get('/transaksi', (req, res) => {
    let sql = 'SELECT * FROM transaksi ORDER BY tanggal DESC';
    db.query(sql, (err, results) => {
        if (err) {
            return res.status(500).send('Error saat melakukan query database: ' + err.message);
        }
        res.json({ data: results });
    });
});
app.get('/transaksi/:id', (req, res) => {
    const idTransaksi = req.params.id;

    let sql = 'SELECT * FROM transaksi WHERE id_transaksi = ?';
    db.query(sql, [idTransaksi], (err, result) => {
        if (err) {
            return res.status(500).send('Error saat melakukan query database');
        }

        if (result.length === 0) {
            return res.status(404).send('Transaksi tidak ditemukan');
        }

        // Mengurai kolom JSON untuk mendapatkan detail item
        const transaksi = result[0];
        try {
            transaksi.items = JSON.parse(transaksi.items);
        } catch (parseErr) {
            return res.status(500).send('Error saat mengurai data transaksi');
        }

        res.json({ data: result });
    });
});

app.post('/login', (req, res) => {
    const { username, password } = req.body;

    // Query to find the user by username
    const sql = 'SELECT * FROM user WHERE username = ?';
    db.query(sql, [username], async (err, results) => {
        if (err) {
            return res.status(500).json({ success: false, message: 'Database query failed', error: err.message });
        }

        if (results.length === 0) {
            return res.status(401).json({ success: false, message: 'Invalid username or password' });
        }

        const user = results[0];
        try {
            // Compare provided password with the hashed password in the database
            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) {
                return res.status(401).json({ success: false, message: 'Invalid username or password' });
            }

            // The password is correct, send success response
            res.json({ success: true, message: 'Login successful', user: { id: user.id, username: user.username } });
        } catch (compareError) {
            res.status(500).json({ success: false, message: 'Error while checking password', error: compareError.message });
        }
    });
});

app.post('/adduser', async (req, res) => {
    const { username, password } = req.body;

    try {
        // Hash password sebelum menyimpan ke database
        const hashedPassword = await bcrypt.hash(password, 10);

        // Query untuk menambahkan user
        const sql = 'INSERT INTO user (username, password) VALUES (?, ?)';
        db.query(sql, [username, hashedPassword], (err, results) => {
            if (err) {
                return res.status(500).json({ success: false, message: 'Gagal menambahkan user', error: err.message });
            }
            res.json({ success: true, message: 'User berhasil ditambahkan', userId: results.insertId });
        });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error saat hashing password', error: error.message });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server berjalan di port ${PORT}`);
});