import Header from "./Header"
import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom';
import Swal from 'sweetalert2'
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import apiBaseUrl from './endpoint.mjs'

function AddKaryawan() {
    const [nip, setNip] = useState('');
    const [nama, setNama] = useState('');
    const [jabatan, setJabatan] = useState('');
    const [gaji_pokok, setGaji] = useState('');
    const [karyawan, setKaryawan] = useState([]);

    const fetchKaryawanEndpoint = "/karyawan";
    const addKaryawanEndpoint = "/karyawan";
    const deleteKaryawanEndpoint = "/karyawan";

    const clearInputs = () => {
        setNip('');
        setNama('');
        setJabatan('');
        setGaji('');
    };

    useEffect(() => {
        fetchKaryawan();
    }, []);

    async function addKaryawan() {
        try {
            let item = { nama, nip, jabatan, gaji_pokok }

            let result = await fetch(`${apiBaseUrl}${addKaryawanEndpoint}`, {
                method: 'POST',
                headers: {
                    "Content-Type": 'application/json',
                    "Accept": 'application/json'
                },
                body: JSON.stringify(item)
            });
            result = await result.json();
            if (result.success) {
                fetchKaryawan();
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

    async function fetchKaryawan() {
        try {
            let result = await fetch(`${apiBaseUrl}${fetchKaryawanEndpoint}`, {
                headers: {
                    "Content-Type": 'application/json',
                    "Accept": 'application/json'
                }
            });
            result = await result.json();
            if (Array.isArray(result.data)) {
                setKaryawan(result.data);
            } else {
                console.warn('Data returned from API is not an array!');
            }
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    }

    async function deleteKaryawan(docId) {
        try {
            let result = await fetch(`${apiBaseUrl}${deleteKaryawanEndpoint}/${docId}`, {
                method: 'DELETE',
                headers: {
                    "Content-Type": 'application/json',
                    "Accept": 'application/json'
                },
            });
            result = await result.json();
            if (result.success) {
                fetchKaryawan();
                Swal.fire({
                    position: 'center',
                    icon: 'success',
                    title: 'Karyawan Berhasil Dihapus',
                    showConfirmButton: false,
                    timer: 1600
                })
            } else {
                console.error("Failed to delete karyawan", result);
            }
        } catch (error) {
            console.error("Failed to delete karyawan", error);
        }
    }

    return (
        <div>
            <Header />
            <br />
            <h1>Tambah Karyawan</h1>
            <div className="align-items-center" style={{
                display: 'flex', flexDirection: 'column',
                alignItems: 'center', justifyContent: 'center', alignItems: 'baseline'
            }}>
                <br />
                <div>
                    <input type="text" value={nama} onChange={(e) => setNama(e.target.value)}
                        placeholder="Nama" style={{ maxWidth: '900px', marginTop: "1rem" }} className="form-control" />
                    <input type="text" value={nip} onChange={(e) => setNip(e.target.value)}
                        placeholder="NIP" style={{ maxWidth: '900px', marginTop: "1rem" }} className="form-control" />
                    <input type="number" value={gaji_pokok} onChange={(e) => setGaji(e.target.value)}
                        placeholder="Gaji" style={{ maxWidth: '900px', marginTop: "1rem" }} className="form-control" />
                    <input
                        type="text"
                        value={jabatan}
                        onChange={(e) => setJabatan(e.target.value)}
                        placeholder="Jabatan"
                        style={{ maxWidth: '900px', marginTop: '1rem' }}
                        className="form-control"
                    />
                </div>
                <br />
                <button onClick={addKaryawan} className="btn btn-primary" style={{ marginTop: "1rem", width: "8rem" }}>Tambah</button>
                <button onClick={clearInputs} className="btn btn-secondary" style={{ marginTop: "1rem", width: "8rem" }}>Reset</button>

            </div>
            <div className="container mt-5">
                <table className="table">
                    <thead>
                        <tr>
                            <th>Nama</th>
                            <th>NIP</th>
                            <th>Jabatan</th>
                            <th>Gaji Pokok</th>
                            <th colSpan="2" style={{ textAlign: 'center' }}></th>
                        </tr>
                    </thead>
                    <tbody>
                        {karyawan.length > 0 ? (
                            karyawan.map((item) => (
                                <tr key={item.id}>
                                    <td>{item.nama}</td>
                                    <td>{item.NIP}</td>
                                    <td>{item.jabatan}</td>
                                    <td>{item.gaji_pokok.toLocaleString("id-ID")}</td>
                                    <td>
                                        <button
                                            className="btn btn-danger"
                                            onClick={() => deleteKaryawan(item.NIP)}
                                            style={{ width: '80px' }}>Hapus
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="5">Data Tidak Ditemukan</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    )
}
export default AddKaryawan