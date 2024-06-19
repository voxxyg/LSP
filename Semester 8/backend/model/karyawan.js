import { db } from "../config/db.js"

const Karyawan = {
    create: (data, callback) => {
        const sql = 'INSERT INTO Karyawan SET ?';
        db.query(sql, data, callback);
    },
    findAll: (callback) => {
        const sql = 'SELECT * FROM Karyawan';
        db.query(sql, callback);
    },
    findById: (id, callback) => {
        const sql = 'SELECT * FROM Karyawan WHERE id = ?';
        db.query(sql, [id], callback);
    },
    update: (id, data, callback) => {
        const sql = 'UPDATE Karyawan SET ? WHERE id = ?';
        db.query(sql, [data, id], callback);
    },
    delete: (id, callback) => {
        const sql = 'DELETE FROM Karyawan WHERE id = ?';
        db.query(sql, [id], callback);
    }
};

export {
    Karyawan
}