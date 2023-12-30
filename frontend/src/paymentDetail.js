import Header from "./Header"
import React, { useEffect, useState } from 'react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import Swal from 'sweetalert2'
import { Dropdown } from 'react-bootstrap';
import { useParams } from "react-router-dom";
import apiBaseUrl from './endpoint.mjs'

function PaymentDetails(paymentId) {
    const { id } = useParams();
    const [paymentDetail, setpaymentDetail] = useState([]);
    const fetchPaymentDetailEndpoint = "/transaksi";

    useEffect(() => {
        fetchPaymentDetail();
    }, []);

    async function fetchPaymentDetail() {
        try {
            let result = await fetch(`${apiBaseUrl}${fetchPaymentDetailEndpoint}/${id}`, {
                headers: {
                    "Content-Type": 'application/json',
                    "Accept": 'application/json'
                }
            });
            result = await result.json();
            setpaymentDetail(result.data);
            console.log(result.data)
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
            <h1 style={{ marginBottom: '2rem' }}>Invoice Pemesanan</h1>
            <div className="container mt-5">
                {paymentDetail.length > 0 ? (
                    paymentDetail.map((payment) => (
                        <div key={payment.id_transaksi}>
                            <h2>Transaksi ID: {payment.id_transaksi}</h2>
                            <table className="table">
                                <thead>
                                    <tr>
                                        <th>Nama Produk</th>
                                        <th>Jumlah</th>
                                        <th>Harga Satuan</th>
                                        <th>Subtotal</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {payment.items.map((item, index) => (
                                        <tr key={index}>
                                            <td>{item.nama}</td>
                                            <td>{item.jumlah}</td>
                                            <td>Rp {item.harga.toLocaleString("id-ID")}</td>
                                            <td>Rp {item.subtotal.toLocaleString("id-ID")}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            <p>Total Transaksi: Rp {payment.total.toLocaleString("id-ID")}</p>
                            <p>Metode Transaksi: {payment.metode_transaksi}</p>
                            <p>Tanggal: {formatDate(payment.tanggal)}</p>
                        </div>
                    ))
                ) : (
                    <p>Produk belum ditambahkan</p>
                )}
            </div>
        </div>
    );


}

export default PaymentDetails