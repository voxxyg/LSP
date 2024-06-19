import Header from "./Header"
import React, { useState, useEffect } from 'react'
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { useNavigate, Link, useParams } from 'react-router-dom'
import Swal from 'sweetalert2'

import apiBaseUrl from './endpoint.mjs'

function SlipGaji() {
    const { nip } = useParams();
    const [slipGaji, setSlipGaji] = useState({});

    const fetchProductDetailEndpoint = "/slip_gaji";

    useEffect(() => {
        fetchProductDetail();
    }, []);

    async function fetchProductDetail() {
        try {
            let result = await fetch(`${apiBaseUrl}${fetchProductDetailEndpoint}/${nip}`, {
                headers: {
                    "Content-Type": 'application/json',
                    "Accept": 'application/json'
                }
            });
            result = await result.json();
            setSlipGaji(result.data[0]);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    }
    return (
        <div>
            <Header />
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'left' }}>
                <h1 style={{ marginBottom: '2rem' }}>Slip Gaji</h1>
                <div className="card" style={{ width: '18rem' }}>
                    <div className="card-body">
                        <h5 className="card-title" style={{ marginBottom: '30px' }}>{slipGaji.bulan} {slipGaji.tahun}</h5>
                        <p className="card-text">NIP: {slipGaji.NIP}</p>
                        <p className="card-text">Nama: {slipGaji.nama}</p>
                        <p className="card-text">Jabatan: {slipGaji.jabatan}</p>
                        <p className="card-text">Total Gaji: Rp {slipGaji.gaji_total}</p>
                    </div>
                </div>
            </div>
            <br />
            <br />
        </div>
    );
}

export default SlipGaji;
