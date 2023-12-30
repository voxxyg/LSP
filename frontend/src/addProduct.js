import Header from "./Header"
import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom';
import Swal from 'sweetalert2'
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { clear } from "@testing-library/user-event/dist/clear";
import apiBaseUrl from './endpoint.mjs'

function AddProducts() {
    // useEffect(() => {
    //     if (JSON.parse(localStorage.getItem('user-info')).data.status === "admin") {
    //         navigate("/addProduct")
    //     } else {
    //         navigate("/listproducts")
    //     }
    // }, [])

    const navigate = useNavigate()
    const [jenis, setJenis] = useState('');
    const [nama, setNama] = useState('');
    const [harga, setHarga] = useState('');
    const [stok, setStok] = useState('');
    const [foods, setFoods] = useState([]);

    const fetchFoodsEndpoint = "/makanan_minuman";
    const addFoodsEndpoint = "/makanan_minuman";
    const deleteFoodsEndpoint = "/makanan_minuman";

    const clearInputs = () => {
        setJenis('');
        setNama('');
        setHarga('');
        setStok('');
    };

    useEffect(() => {
        fetchProducts();
    }, []);



    async function addProduct() {
        try {
            let item = {nama, jenis, harga, stok}

            let result = await fetch(`${apiBaseUrl}${addFoodsEndpoint}`, {
                method: 'POST',
                headers: {
                    "Content-Type": 'application/json',
                    "Accept": 'application/json'
                },
                body: JSON.stringify(item)
            });
            result = await result.json();
            if (result.success) {
                // Refresh list of products after successful deletion
                fetchProducts();

                Swal.fire({
                    position: 'center',
                    icon: 'success',
                    title: 'Produk Berhasil Ditambahkan',
                    showConfirmButton: false,
                    timer: 1600
                })
                clearInputs();

            } else if (result.message === "\"judul\" is not allowed to be empty") {
                Swal.fire({
                    position: 'center',
                    icon: 'info',
                    title: 'Nama Tidak Boleh Kosong',
                    showConfirmButton: false,
                    timer: 1600
                })
            } else if (result.message === "\"files\" is required") {
                Swal.fire({
                    position: 'center',
                    icon: 'info',
                    title: 'Gambar Tidak Boleh Kosong',
                    showConfirmButton: false,
                    timer: 1600
                })
            } else if (result.message === "Payload content length greater than maximum allowed: 10485760") {
                Swal.fire({
                    position: 'center',
                    icon: 'info',
                    title: 'Size Gambar Terlalu Besar',
                    showConfirmButton: false,
                    timer: 1600
                })
            } else if (result.message === "\"desc\" is not allowed to be empty") {
                Swal.fire({
                    position: 'center',
                    icon: 'info',
                    title: 'Deskripsi Tidak Boleh Kosong',
                    showConfirmButton: false,
                    timer: 1600
                })
            } else if (result.message === "\"harga\" must be a number") {
                Swal.fire({
                    position: 'center',
                    icon: 'info',
                    title: 'Data Harga Tidak Valid',
                    showConfirmButton: false,
                    timer: 1600
                })
            }
            else {
                console.error("Failed to add product", result);
            }
        } catch (error) {
            console.error('Error adding data:', error);
        }
    }

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

    async function deleteProduct(docId) {
        try {
            let result = await fetch(`${apiBaseUrl}${deleteFoodsEndpoint}/${docId}`, {
                method: 'DELETE',
                headers: {
                    "Content-Type": 'application/json',
                    "Accept": 'application/json'
                },
            });
            result = await result.json();
            if (result.success) {
                // Refresh list of products after successful deletion
                fetchProducts();
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
        } catch (error) {
            console.error("Failed to delete product", error);
        }
    }

    return (
        <div>
            <Header />
            <br />
            <h1>Tambah Produk</h1>
            <div className="align-items-center" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', alignItems: 'baseline' }}>
                <br />
                <div>
                    <input type="text" value={nama} onChange={(e) => setNama(e.target.value)} placeholder="Nama" style={{ maxWidth: '900px', marginTop: "1rem" }} className="form-control" />
                    <input type="text" value={jenis} onChange={(e) => setJenis(e.target.value)} placeholder="Jenis" style={{ maxWidth: '900px', marginTop: "1rem" }} className="form-control" />
                    <input type="number" value={stok} onChange={(e) => setStok(e.target.value)} placeholder="Stok" style={{ maxWidth: '900px', marginTop: "1rem" }} className="form-control" />
                    <input
                        type="text"
                        value={harga}
                        onChange={(e) => setHarga(e.target.value)}
                        placeholder="Harga (Rp)"
                        style={{ maxWidth: '900px', marginTop: '1rem' }}
                        className="form-control"
                    />
                </div>
                <br />
                <button onClick={addProduct} className="btn btn-primary" style={{ marginTop: "1rem" }}>Tambah Produk</button>
                <button onClick={clearInputs} className="btn btn-secondary" style={{ marginTop: "1rem" }}>Reset</button>

            </div>
            <div className="container mt-5">
                <table className="table">
                    <thead>
                        <tr>
                            <th>Nama</th>
                            <th>Jenis</th>
                            <th>Harga</th>
                            <th>Stok</th>
                            <th colSpan="2" style={{ textAlign: 'center' }}></th>
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
                                        <Link
                                            to={`/editProduct/${item.id}`}
                                            className="btn btn-primary"
                                            style={{ width: '80px' }}>Edit
                                        </Link>
                                    </td>
                                    <td>
                                        <button
                                            className="btn btn-danger"
                                            onClick={() => deleteProduct(item.id)}
                                            style={{ width: '80px' }}>Hapus
                                        </button>
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
    )
}
export default AddProducts