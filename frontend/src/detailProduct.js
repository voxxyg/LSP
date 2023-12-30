import Header from "./Header"
import React, { useState, useEffect } from 'react'
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { useNavigate, Link, useParams } from 'react-router-dom'
import Swal from 'sweetalert2'

import apiBaseUrl from './endpoint.mjs'

function ProductPageDetail() {
    const { id } = useParams();
    const [productDetail, setProductDetail] = useState({});
    const navigate = useNavigate()
    // const [chart, seChart] = useState([]);

    const fetchProductDetailEndpoint = "/fetchProducts";
    const addShoppingChartEndpoint = "/addChart"

    useEffect(() => {
        fetchProductDetail();
    }, []);

    if (!productDetail || !productDetail.pictures) {
        return <div>Loading...</div>; // Atau tampilkan pesan lain jika data belum siap.
    }

    const settings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1
    };

    async function fetchProductDetail() {
        try {
            let result = await fetch(`${apiBaseUrl}${fetchProductDetailEndpoint}/${id}`, {
                headers: {
                    "Content-Type": 'application/json',
                    "Accept": 'application/json'
                }
            });
            result = await result.json();
            setProductDetail(result.data);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    }

    async function addShoppingCharts(productId) {
        if (localStorage.getItem('user-info')) {
            const userId = JSON.parse(localStorage.getItem('user-info')).data.uid;
            let result = await fetch(`${apiBaseUrl}${addShoppingChartEndpoint}/${userId}`, {
                method: 'POST',
                headers: {
                    "Content-Type": 'application/json',
                    "Accept": 'application/json'
                },
                body: JSON.stringify({
                    productId: productId,
                })
            })
            result = await result.json();
            console.log(result.message);
            if (result.success) {
                fetchProductDetail()
                Swal.fire({
                    position: 'center',
                    icon: 'success',
                    title: 'Berhasil Ditambahkan',
                    showConfirmButton: false,
                    timer: 1600
                })
                navigate("/keranjang")
            } else {
                Swal.fire({
                    position: 'center',
                    icon: 'error',
                    title: 'Kuota Sudah Habis',
                    showConfirmButton: false,
                    timer: 1600
                })
            }
        } else {
            Swal.fire({
                position: 'center',
                icon: 'info',
                title: 'Silahkan Login',
                showConfirmButton: true,
            })
        }

    }

    const sliderHeight = 100;
    return (
        <div>
            <Header />
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'left' }}>
                <h1 style={{ marginBottom: '2rem' }}>Detail Produk</h1>
                <div className="card" style={{ width: '18rem' }}>
                    <div >
                        <Slider {...settings} style={{ objectFitit: 'cover', marginBottom: '20px' }}>
                            {productDetail.pictures.map((picture, index) => (
                                <div key={index} style={{ overflow: 'hidden' }}>
                                    <img className="card-img-top" src={picture} alt={`Slide ${index + 1}`} style={{ objectFit: 'cover', width: '100%', height: '100%' }} />
                                </div>
                            ))}
                        </Slider>
                    </div>
                    <div className="card-body">
                        <h5 className="card-title" style={{ marginBottom: '30px' }}>{productDetail.judul}</h5>
                        <p className="card-text" style={{ marginBottom: '30px' }}>Deskripsi: {productDetail.desc}</p>
                        <p className="card-text">Harga: {productDetail.harga.toLocaleString()}</p>
                        <p className="card-text">Kontak Penjual: 082112391401</p>
                    </div>
                    <button onClick={(e) => addShoppingCharts(productDetail.id)} className='btn btn-success'>Masukan Keranjang</button>
                </div>
            </div>
            <br />
            <br />
        </div>
    );
}

export default ProductPageDetail;
