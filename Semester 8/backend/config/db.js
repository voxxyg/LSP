import mysql from "mysql";

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'data_karyawan'
});

db.connect((err) => {
    if (err) {
        throw err;
    }
    console.log('Connected to database');
});

export {
    db
}