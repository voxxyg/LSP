import Header from "./Header"
import React, { useEffect, useState } from 'react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import Swal from 'sweetalert2'
import { useNavigate, Link } from 'react-router-dom'
import apiBaseUrl from './endpoint.mjs'

function ShoppingCharts() {
    useEffect(() => {
        if (JSON.parse(localStorage.getItem('user-info')).data.status === "admin") {
            navigate("/addProduct")
        } else {
            navigate("/keranjang")
        }
    }, [])
    const navigate = useNavigate()
    const [chartsData, setChartsData] = useState([]);
    const fetchChartsEndpoint = "/fetchCharts"
    const createPaymentEndpoint = "/payment"
    const deleteChartEndpoint = "/deleteChart"

    const expeditions = {
        'JNE express': {
            jabodetabek: 12000,
            luarJabodetabek: 20000,
        },
        'JNT express': {
            jabodetabek: 9000,
            luarJabodetabek: 15000,
        },
    };

    const [selectedExpedition, setSelectedExpedition] = useState('JNE express');
    const [luarJabodetabek, setLuarJabodetabek] = useState(false);
    // const [totalHarga, setTotalHarga] = useState(0);

    const subTotal = chartsData.reduce((total, product) => total + product.harga, 0)
    const expedisiBiaya = expeditions[selectedExpedition];
    const biayaEkspedisi = luarJabodetabek ? expedisiBiaya.luarJabodetabek : expedisiBiaya.jabodetabek || 0;
    const totalHargaWithExpedition = subTotal + biayaEkspedisi;

    const settings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
    };

    useEffect(() => {
        fetchCharts();
    }, []);
    const uid = JSON.parse(localStorage.getItem('user-info')).data.uid;
    async function fetchCharts() {
        // const uid = JSON.parse(localStorage.getItem('user-info')).data.uid;
        try {
            let result = await fetch(`${apiBaseUrl}${fetchChartsEndpoint}/${uid}`, {
                headers: {
                    "Content-Type": 'application/json',
                    "Accept": 'application/json'
                }
            });
            result = await result.json();
            if (result.success && Array.isArray(result.data)) {
                setChartsData(result.data);
            } else {
                console.log('Data returned from API is not an array');
            }

        } catch (error) {
            console.error('Error fetching data:', error);
        }
    }

    async function deleteChart(docId) {

        let item = { productId: docId }
        let result = await fetch(`${apiBaseUrl}${deleteChartEndpoint}/${uid}`, {
            method: 'DELETE',
            headers: {
                "Content-Type": 'application/json',
                "Accept": 'application/json'
            },
            body: JSON.stringify(item)
        });
        result = await result.json();
        if (result.success) {
            // Refresh list of products after successful deletion
            fetchCharts();
            Swal.fire({
                position: 'center',
                icon: 'success',
                title: 'Produk Berhasil Dihapus',
                showConfirmButton: false,
                timer: 1600
            })
        } else {
            console.error("Failed to delete product", result);
        }
    }

    async function createPayment() {
        try {
            const uid = JSON.parse(localStorage.getItem('user-info')).data.uid;
            let ekspedisi = selectedExpedition
            let totalHarga = totalHargaWithExpedition
            let item = { totalHarga, ekspedisi }

            let result = await fetch(`${apiBaseUrl}${createPaymentEndpoint}/${uid}`, {
                method: 'POST',
                headers: {
                    "Content-Type": 'application/json',
                    "Accept": 'application/json'
                },
                body: JSON.stringify(item)
            })
            result = await result.json();
            if (result.success) {
                Swal.fire({
                    position: 'center',
                    icon: 'success',
                    title: 'Berhasil checkout',
                    showConfirmButton: false,
                    timer: 1500
                })
                navigate(`/payment/${result.uniqueId}`)
            } else {
                Swal.fire({
                    position: 'center',
                    icon: 'warning',
                    title: 'Coba lagi',
                    showConfirmButton: false,
                    timer: 1500
                })
            }
        } catch (error) {
            console.error('Error logging in user:', error);
        }
    }

    const handleExpeditionChange = (event) => {
        setSelectedExpedition(event.target.value);
    };

    const handleLuarJabodetabekChange = (event) => {
        setLuarJabodetabek(event.target.checked);
    };

    return (
        <div>
            <Header />
            <br />
            <h1>Keranjang</h1>
            <br />
            <div className="row align-items-center" style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }} >
                {chartsData.length > 0 ? (
                    chartsData.map((product, index) => (
                        <div key={index} className="col-12 col-sm-6 col-md-4 col-lg-3 my-4" style={{ display: 'flex', flexDirection: 'row' }}>
                            <div className="card mx-auto" style={{ width: '18rem' }}>
                                <Slider {...settings} >
                                    <div>
                                        <img className="card-img-top" src={product.pictures[0]} alt={`Slide 1`} style={{ objectFit: 'contain', width: '100%', height: '200px' }} />
                                    </div>
                                </Slider>
                                <div className="card-body">
                                    <h5 className="card-title">{product.judul}</h5>
                                    <p className="card-text">Harga: {product.harga.toLocaleString()}</p>
                                    <button className="btn btn-danger" onClick={() => deleteChart(product.id)}>Hapus</button>
                                </div>
                            </div>
                        </div>

                    ))

                ) : (
                    <p>Keranjang Kosong</p>
                )}

                {chartsData.length > 0 && (
                    <div className="hasil">
                        <div style={{ margin: '20px' }}>
                            <label htmlFor="expedition">Pilih Ekspedisi:</label>
                            <select id="expedition" value={selectedExpedition} onChange={handleExpeditionChange}>
                                <option value="JNE express">JNE express</option>
                                <option value="JNT express">JNT express</option>
                            </select>
                        </div>
                        <div style={{ marginBottom: '20px' }}>
                            <input
                                type="checkbox"
                                id="luarJabodetabek"
                                checked={luarJabodetabek}
                                onChange={handleLuarJabodetabekChange}
                            />
                            <label htmlFor="luarJabodetabek">Luar Jabodetabek</label>
                        </div>
                        <div style={{ marginTop: '20px' }}>
                            <p>Biaya Ekspedisi: {biayaEkspedisi.toLocaleString()}</p>
                        </div>
                        <div style={{ marginTop: '20px' }}>
                            <p>Total Harga: {totalHargaWithExpedition.toLocaleString()}</p>
                            <button onClick={createPayment} className="btn btn-primary" style={{ width: '6rem' }}>Checkout</button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default ShoppingCharts;