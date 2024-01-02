import Header from "./Header"
import React, { useState, useEffect } from 'react'
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import apiBaseUrl from './endpoint.mjs'

function ListProducts() {
    const [foods, setFoods] = useState([]);
    const [order, setOrder] = useState({});
    const orderEndpoint = "/transaksi";
    const fetchFoodsEndpoint = "/makanan_minuman";

    useEffect(() => {
        fetchProducts();
    }, []);

    const clearInputs = () => {
        setOrder('');
    };

    async function fetchProducts() {
        try {
            let result = await fetch(`${apiBaseUrl}${fetchFoodsEndpoint}`, {
                headers: {
                    "Content-Type": 'application/json',
                    "Accept": 'application/json'
                }
            });
            result = await result.json();
            if (Array.isArray(result.data)) {
                setFoods(result.data);
            } else {
                console.warn('Data returned from API is not an array!');
            }
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    }

    function handleOrderChange(id, quantity) {
        setOrder((prevOrder) => ({
            ...prevOrder,
            [id]: quantity
        }));
    }

    // Submit Pesanan
    async function submitOrder() {
        try {
            const items = Object.keys(order).map(id => ({
                id_makanan_minuman: id,
                jumlah: order[id]
            })).filter(item => item.jumlah > 0);

            let result = await fetch(`${apiBaseUrl}${orderEndpoint}`, {
                method: 'POST',
                headers: {
                    "Content-Type": 'application/json',
                    "Accept": 'application/json'
                },
                body: JSON.stringify({ items })
            });
            result = await result.json();
            console.log('Order response:', result);
            alert('Pemesanan berhasil!');
            clearInputs()
        } catch (error) {
            console.error('Error submitting order:', error);
            alert('Terjadi kesalahan saat membuat pesanan.');
        }
    }

    return (
        <div>
            <Header />
            <br />
            <h1>Daftar Makanan dan Minuman</h1>
            <div>
                <div className="container mt-5">
                    <table className="table">
                        <thead>
                            <tr>
                                <th>Nama</th>
                                <th>Jenis</th>
                                <th>Harga</th>
                                <th>Stok</th>
                                <th>Total Pembelian</th>
                            </tr>
                        </thead>
                        <tbody>
                            {foods.length > 0 ? (
                                foods.map((item) => (
                                    <tr key={item.id}>
                                        <td>{item.nama}</td>
                                        <td>{item.jenis}</td>
                                        <td>Rp {item.harga.toLocaleString("id-ID")}</td>
                                        <td>{item.stok}</td>
                                        <td>
                                            <input
                                                type="number"
                                                min="0"
                                                value={order[item.id] || ""}
                                                onChange={(e) => handleOrderChange(item.id, parseInt(e.target.value))}
                                            />
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="5">Produk belum ditambahkan</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                    <br/>
                    <button onClick={submitOrder} className="btn btn-success">Submit</button>
                </div>
            </div>
        </div>
    );
}

export default ListProducts