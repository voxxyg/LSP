import Header from "./Header"
import React, { useEffect, useState } from 'react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import Swal from 'sweetalert2'
import { Link } from 'react-router-dom'
import apiBaseUrl from './endpoint.mjs'
import { type } from "@testing-library/user-event/dist/type";

function PaymentPages() {
    const [paymentData, setPaymentData] = useState([]);
    const fetchPaymentPageEndpoint = "/transaksi";

    useEffect(() => {
        fetchPayment();
    }, []);
    // const uid = JSON.parse(localStorage.getItem('user-info')).data.uid;
    async function fetchPayment() {
        try {
            let result = await fetch(`${apiBaseUrl}${fetchPaymentPageEndpoint}`, {
                headers: {
                    "Content-Type": 'application/json',
                    "Accept": 'application/json'
                }
            });
            result = await result.json();
            console.warn(typeof(result.data))
            if (result.data && Array.isArray(result.data)) {
                setPaymentData(result.data);
            } else {
                console.log('Data returned from API is not an array');
            }

        } catch (error) {
            console.error('Error fetching data:', error);
        }
    }

    function formatDate(isoString) {
        const date = new Date(isoString);
        const dateOptions = { year: 'numeric', month: 'long', day: 'numeric' };
        return date.toLocaleDateString('id-ID', dateOptions);
      }

    return (
        <div>
            <Header />
            <br />
            <h1>Dashboard Pemesanan</h1>
            <br />
            <div>
            <div className="container mt-5">
                <table className="table">
                    <thead>
                        <tr>
                            <th>Tanggal</th>
                            <th>Total Harga</th>
                            <th>Metode Pembayaran</th>
                        </tr>
                    </thead>
                    <tbody>
                        {paymentData.length > 0 ? (
                            paymentData.map((item) => (
                                <tr key={item.id}>
                                    <td>{formatDate(item.tanggal)}</td>
                                    <td>Rp {item.total.toLocaleString("id-ID")}</td>
                                    <td>{item.metode_transaksi}</td>
                                    <td>
                                        <Link
                                            to={`/payment/${item.id_transaksi}`}
                                            className="btn btn-primary"
                                            style={{ width: '80px' }}>Detail
                                        </Link>
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
            </div>
            </div>
        </div>
    );
}

export default PaymentPages;