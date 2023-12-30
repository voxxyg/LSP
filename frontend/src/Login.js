import Header from "./Header"
import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Swal from 'sweetalert2'
import apiBaseUrl from './endpoint.mjs'

function Login() {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const navigate = useNavigate()
    const loginEndpoint = "/login"

    useEffect(() => {
        if (localStorage.getItem('user-info')) {
            navigate("/listproducts")
        }
    }, [])
    async function login() {
        try {
            let item = { email, password }

            let result = await fetch(`${apiBaseUrl}${loginEndpoint}`, {
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
                    title: 'Berhasil login',
                    showConfirmButton: false,
                    timer: 1500
                })
                localStorage.setItem("user-info", JSON.stringify(result))
                navigate("/listproducts")
                Swal.fire({
                    position: 'center',
                    icon: 'success',
                    title: 'Berhasil login',
                    showConfirmButton: false,
                    timer: 1500
                })

            } else if (result.message == "\"email\" must be a valid email"
                || result.message == "\"email\" is not allowed to be empty") {
                Swal.fire({
                    position: 'center',
                    icon: 'warning',
                    title: 'Tolong masukan alamat email yang valid',
                    showConfirmButton: false,
                    timer: 1500
                })
            } else if (result.message == "User not found") {
                Swal.fire({
                    position: 'center',
                    icon: 'warning',
                    title: 'Email belum terdaftar',
                    showConfirmButton: false,
                    timer: 1500
                })
            } else if (result.message == "\"password\" length must be at least 6 characters long"
                || result.message == "\"password\" is not allowed to be empty") {
                Swal.fire({
                    position: 'center',
                    icon: 'warning',
                    title: 'Password tidak valid',
                    showConfirmButton: false,
                    timer: 1500
                })
            } else if (result.message == "Email and password does not match") {
                Swal.fire({
                    position: 'center',
                    icon: 'warning',
                    title: 'Email dan password tidak cocok',
                    showConfirmButton: false,
                    timer: 1500
                })
            } else if (result.message == "Too many request, try again later") {
                Swal.fire({
                    position: 'center',
                    icon: 'warning',
                    title: 'Terlalu banyak kesalahan login, coba lagi nanti',
                    showConfirmButton: false,
                    timer: 1500
                })
            } else if (result.message === "Terjadi kesalahan") {
                Swal.fire({
                    position: 'center',
                    icon: 'warning',
                    title: 'Terjadi Kesalahan, Silahkan Periksa Email dan Password',
                    showConfirmButton: false,
                    timer: 1500
                })
            } else {
                Swal.fire({
                    position: 'center',
                    icon: 'warning',
                    title: 'Terjadi Kesalahan, Silahkan Coba Lagi!',
                    showConfirmButton: false,
                    timer: 1500
                })
            }
        } catch (error) {
            console.error('Error logging in user:', error);
        }

    }
    return (
        <div>
            <Header />
            <div className="col-sm-6 offset-sm-3 align-items-center mx-auto" >

                <div style={{ margin: '20px' }}>
                    <h1>Halaman Login</h1>
                    <br />
                    <input type="email" placeholder="Email" onChange={(e) => setEmail(e.target.value)} className="form-control" />
                    <br />
                    <input type="password" placeholder="Password" onChange={(e) => setPassword(e.target.value)} className="form-control" />
                    <br />
                    <button onClick={login} className="btn btn-primary" style={{ width: '6rem' }}>Login</button>
                    <br />
                    <br />
                    <Link to="/register"><button className="btn btn-warning" style={{ width: '6rem' }}>Register</button></Link>
                </div>

               
            </div>
        </div>
    )
}

export default Login