import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Swal from 'sweetalert2'
import apiBaseUrl from './endpoint.mjs'

function Login() {
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    const loginEndpoint = "/login"

    async function login() {
        try {
            let item = { username, password }

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
                    title: 'Berhasil Login',
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
            <div className="col-sm-6 offset-sm-3 align-items-center mx-auto" >
                <div style={{ margin: '20px' }}>
                    <h1>Halaman Login</h1>
                        <br />
                        <input type="text" placeholder="Usename" onChange={(e) => setUsername(e.target.value)} className="form-control" />
                        <br />
                        <input type="password" placeholder="Password" onChange={(e) => setPassword(e.target.value)} className="form-control" />
                        <br />
                        <button onClick={login} className="btn btn-primary" style={{ width: '6rem' }}>Login</button>
                        <br />
                </div>
            </div>
        </div>
    )
}

export default Login