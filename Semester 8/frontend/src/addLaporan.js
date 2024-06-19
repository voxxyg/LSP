import Header from "./Header"
import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom';
import Swal from 'sweetalert2'
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import apiBaseUrl from './endpoint.mjs'

function AddLaporan() {
    const [nip, setNip] = useState('');
    const [bulan, setBulan] = useState('');
    const [tahun, setTahun] = useState('');
    const [karyawan, setKaryawan] = useState([]);

    const addGajiEndpoint = "/laporan_gaji";

    const clearInputs = () => {
        setNip('');
        setBulan('');
        setTahun('');
    };

    async function add() {
        try {
            let item = { bulan, nip, tahun }
            let result = await fetch(`${apiBaseUrl}${addGajiEndpoint}`, {
                method: 'POST',
                headers: {
                    "Content-Type": 'application/json',
                    "Accept": 'application/json'
                },
                body: JSON.stringify(item)
            });
            result = await result.json();
            if (result.success) {
                Swal.fire({
                    position: 'center',
                    icon: 'success',
                    title: 'Karyawan Berhasil Ditambahkan',
                    showConfirmButton: false,
                    timer: 1600
                })
                clearInputs();

            } else {
                console.error("Failed to add karyawan", result);
            }
        } catch (error) {
            console.error('Error adding data:', error);
        }
    }

    return (
        <div>
            <Header />
            <br />
            <h1>Buat Laporan Gaji</h1>
            <div className="align-items-center" style={{
                display: 'flex', flexDirection: 'column',
                alignItems: 'center', justifyContent: 'center', alignItems: 'baseline'
            }}>
                <br />
                <div>
                    <input type="text" value={nip} onChange={(e) => setNip(e.target.value)}
                        placeholder="NIP" style={{ maxWidth: '900px', marginTop: "1rem" }} className="form-control" />
                    <input type="text" value={bulan} onChange={(e) => setBulan(e.target.value)}
                        placeholder="Bulan" style={{ maxWidth: '900px', marginTop: "1rem" }} className="form-control" />
                    <input type="number" value={tahun} onChange={(e) => setTahun(e.target.value)}
                        placeholder="Tahun" style={{ maxWidth: '900px', marginTop: "1rem" }} className="form-control" />
                </div>
                <br />
                <button onClick={add} className="btn btn-primary" style={{ marginTop: "1rem", width: "8rem" }}>Tambah</button>
                <button onClick={clearInputs} className="btn btn-secondary" style={{ marginTop: "1rem", width: "8rem" }}>Reset</button>

            </div>
            <div className="container mt-5">
                <table className="table">
                </table>
            </div>
        </div>
    )
}
export default AddLaporan