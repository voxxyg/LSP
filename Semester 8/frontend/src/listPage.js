import Header from "./Header"
import React, { useState, useEffect } from 'react'
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import Swal from 'sweetalert2'
import apiBaseUrl from './endpoint.mjs'
import { useParams } from "react-router-dom";

function ListLaporan() {
    const { bulan } = useParams();
    const [karyawan, setKaryawan] = useState([]);
    const orderEndpoint = "/transaksi";
    const fetchGajiEndpoint = "/laporan_gaji";

    useEffect(() => {
        fetchLaporan();
    }, []);

    async function fetchLaporan() {
        try {
            let result = await fetch(`${apiBaseUrl}${fetchGajiEndpoint}/${bulan}`, {
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

    return (
        <div>
            <br />
            <h1>Daftar Laporan Gaji Karyawan</h1>
            <div>
                <div className="container mt-5">
                    <table className="table">
                        <thead>
                            <tr>
                                <th>NIP</th>
                                <th>Nama</th>
                                <th>Gaji Pokok</th>
                                <th>Bonus</th>
                                <th>PPH</th>
                                <th>Total Gaji</th>
                                <th>Bulan</th>
                            </tr>
                        </thead>
                        <tbody>
                            {karyawan.length > 0 ? (
                                karyawan.map((item) => (
                                    <tr key={item.NIP}>
                                        <td>{item.NIP}</td>
                                        <td>{item.nama}</td>
                                        <td>Rp {item.gaji_pokok.toLocaleString("id-ID")}</td>
                                        <td>{item.bonus}</td>
                                        <td>{item.PPH}</td>
                                        <td>{item.gaji_total.toLocaleString("id-ID")}</td>
                                        <td>{item.bulan}</td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="5">Tidak Ada Data</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                    <br/>
                </div>
            </div>
        </div>
    );
}

export default ListLaporan