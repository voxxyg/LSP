import { Karyawan } from "../model/karyawan.js"

exports.getAllKaryawan = (req, res) => {
    Karyawan.findAll((err, results) => {
        if (err) {
            return res.status(500).send(err);
        }
        res.json(results);
    });
};

exports.createKaryawan = (req, res) => {
    const data = req.body;
    Karyawan.create(data, (err, results) => {
        if (err) {
            return res.status(500).send(err);
        }
        res.status(201).json({ id: results.insertId, ...data });
    });
};