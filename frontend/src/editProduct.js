import Header from "./Header"
import React, { useState, useEffect } from 'react'
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { useNavigate, Link, useParams } from 'react-router-dom'
import Swal from 'sweetalert2'
import { editableInputTypes } from "@testing-library/user-event/dist/utils";

import apiBaseUrl from './endpoint.mjs'

function EditProduct() {
    const { id } = useParams();
    const [productDetail, setProductDetail] = useState([]);
    const navigate = useNavigate()
    const [judul, setJudul] = useState('');
    const [desc, setDesc] = useState('');
    const [harga, setHarga] = useState('');
    const [files, setFiles] = useState('');

    const fetchProductDetailEndpoint = "/fetchProducts";
    const EditProductEndpoint = "/updateProduct";

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

    const clearInputs = () => {
        setJudul('');
        setDesc('');
        setHarga('');
        document.getElementById('file-input').value = null;
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

    async function updateProduct(productId) {
        try {
            const formData = new FormData();
            formData.append('judul', judul);
            formData.append('desc', desc);
            formData.append('harga', harga);

            if (files && files.length > 0) {
                for (let i = 0; i < files.length; i++) {
                    formData.append('files', files[i]);
                }
            }

            let result = await fetch(`${apiBaseUrl}${EditProductEndpoint}/${productId}`, {
                method: 'PUT',
                body: formData,
            });
            result = await result.json();
            if (result.success) {
                // Refresh list of products after successful deletion
                fetchProductDetail();
                Swal.fire({
                    position: 'center',
                    icon: 'success',
                    title: 'Berhasil Merubah Data Produk',
                    showConfirmButton: false,
                    timer: 1600
                })
                clearInputs();

            } else {
                console.error("Failed to add product", result);
            }
        } catch (error) {
            console.error('Error adding data:', error);
        }
    }

    return (
        <div>
            <Header />
            <br />
            <h1 style={{ marginBottom: "1rem" }}>Edit Produk</h1>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'left' }}>
                <div className="card text-center" style={{ width: '18rem' }}>
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
                        <h5 className="card-title" style={{ marginBottom: '30px' }}>Nama: {productDetail.judul}</h5>
                        <p className="card-text" style={{ marginBottom: '30px' }}>Deskripsi: {productDetail.desc}</p>
                        <p className="card-text">Harga: {productDetail.harga.toLocaleString()}</p>
                    </div>
                </div>
            </div>
            <div className="align-items-center" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', alignItems: 'baseline' }}>
                <br />
                <div>
                    <input type="text" value={judul} onChange={(e) => setJudul(e.target.value)} placeholder="Nama" style={{ maxWidth: '900px', marginTop: "1rem" }} className="form-control" />
                    <input type="text" value={desc} onChange={(e) => setDesc(e.target.value)} placeholder="Deskripsi" style={{ maxWidth: '900px', marginTop: "1rem" }} className="form-control" />
                    {/* <input type="number" onChange={(e) => setHarga(e.target.value)} placeholder="Harga (Rp)" style={{ maxWidth: '900px', marginTop: "1rem" }} className="form-control" /> */}
                    <input
                        type="text"
                        value={harga}
                        onChange={(e) => setHarga(e.target.value)}
                        placeholder="Harga (Rp)"
                        style={{ maxWidth: '900px', marginTop: '1rem' }}
                        className="form-control"
                    />
                    <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                            const files = e.target.files;
                            console.log(`Jumlah file yang dipilih: ${files.length}`);
                            setFiles(files); // Set inputan files dengan file yang dipilih
                        }}
                        style={{ maxWidth: '900px', marginTop: "1rem" }}
                        className="form-control"
                        multiple
                        id="file-input" // Berikan ID pada input file
                    />
                </div>
                <br />
                <button onClick={(e) => updateProduct(productDetail.id)} className="btn btn-primary" style={{width: "5rem", margin: "1rem auto" }}>Edit</button>
                <button onClick={clearInputs} className="btn btn-secondary" style={{ width: "5rem", marginBottom: "1rem" }}>Reset</button>
            </div>
        </div>
    )
}

export default EditProduct;