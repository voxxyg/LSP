import Header from "./Header"
import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Swal from 'sweetalert2'

import apiBaseUrl from './endpoint.mjs'

function Register() {
    useEffect(() => {
        if (localStorage.getItem('user-info')) {
            navigate("/listproducts")
        }
    }, [])
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [username, setUsername] = useState("")
    const [phone, setPhone] = useState("")
    const [alamat, setAlamat] = useState("")
    const registerEndpoint = "/register"
    const navigate = useNavigate()

    async function register() {
        try {
            let item = { email, password, username, phone, alamat }

            let result = await fetch(`${apiBaseUrl}${registerEndpoint}`, {
                method: 'POST',
                body: JSON.stringify(item),
                headers: {
                    "Content-Type": 'application/json',
                    "Accept": 'application/json'
                }
            })
            result = await result.json()
            if (result.success) {
                navigate("/login")
                Swal.fire({
                    position: 'center',
                    icon: 'success',
                    title: 'Berhasil register, silahkan login',
                    showConfirmButton: false,
                    timer: 1600
                })
            } else if (result.message == "That email is already taken") {
                Swal.fire({
                    position: 'center',
                    icon: 'error',
                    title: 'Alamat Email Sudah Terdaftar',
                    showConfirmButton: false,
                    timer: 1500
                })
            } else if (result.message == "\"email\" must be a valid email"
                || result.message == "\"email\" is not allowed to be empty") {
                Swal.fire({
                    position: 'center',
                    icon: 'error',
                    title: 'Email Tidak Valid',
                    showConfirmButton: false,
                    timer: 1500
                })
            } else if (result.message == "Password must be at least 6 characters long"
                || result.message == "\"password\" is not allowed to be empty") {
                Swal.fire({
                    position: 'center',
                    icon: 'error',
                    title: 'Password Minimal 6 Karakter',
                    showConfirmButton: false,
                    timer: 1500
                })
            } else if (result.message == "\"username\" must only contain alpha-numeric characters"
                || result.message == "\"username\" is not allowed to be empty"
                || result.message == "Username must be between 3 and 20 characters") {
                Swal.fire({
                    position: 'center',
                    icon: 'error',
                    title: 'Username Minimal 3 Karakter',
                    showConfirmButton: false,
                    timer: 1500
                })
            } else if (result.message == "\"phone\" is not allowed to be empty"
                || result.message == "\"phone\" must be a number"
                || result.message == "\"phone\" is required"
                || result.message == "\"phone\" must be greater than or equal to 70") {
                Swal.fire({
                    position: 'center',
                    icon: 'error',
                    title: 'Nomor Handphone Tidak Valid',
                    showConfirmButton: false,
                    timer: 1500
                })
            } else if (result.message === "\"alamat\" is not allowed to be empty") {
                Swal.fire({
                    position: 'center',
                    icon: 'error',
                    title: 'Alamat Tidak Boleh Kosong',
                    showConfirmButton: false,
                    timer: 1500
                })
            } else {
                Swal.fire({
                    position: 'center',
                    icon: 'error',
                    title: 'Terjadi Kesalahan, Coba Lagi Nanti',
                    showConfirmButton: false,
                    timer: 1500
                })
            }
        } catch (error) {
            console.error('Error during registration:', error);
        }
    }
    return (
        <div>
            <Header />
            <div className="col-sm-6 offset-sm-3 align-items-center mx-auto" >
                <div style={{ margin: '20px' }}>
                    <h1>Halaman Register</h1>
                    <br />
                    <input type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                        className="form-control" placeholder="Email" />
                    <br />
                    <input type="password" value={password} onChange={(e) => setPassword(e.target.value)}
                        className="form-control" placeholder="Password" />
                    <br />
                    <input type="text" value={username} onChange={(e) => setUsername(e.target.value)}
                        className="form-control" placeholder="Nama" />
                    <br />
                    <input type="phone" value={phone} onChange={(e) => setPhone(e.target.value)}
                        className="form-control" placeholder="Phone" />
                    <br />
                    <textarea style={{ height: '6rem' }} value={alamat} onChange={(e) => setAlamat(e.target.value)} className="form-control" placeholder="Alamat"  />

                    <br />
                    <button onClick={register} className="btn btn-primary" style={{ width: '6rem' }}>Register</button>
                </div>
            </div>
        </div>
    )
}
export default Register