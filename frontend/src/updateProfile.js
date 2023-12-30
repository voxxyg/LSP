import Header from "./Header"
import React, { useState, useEffect } from 'react'
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { useNavigate, Link, useParams } from 'react-router-dom'
import Swal from 'sweetalert2'
import { editableInputTypes } from "@testing-library/user-event/dist/utils";
import { DEFAULT_MIN_BREAKPOINT } from "react-bootstrap/esm/ThemeProvider";

import apiBaseUrl from './endpoint.mjs'

function UpdateUserData() {
    const uid = JSON.parse(localStorage.getItem('user-info')).data.uid;
    const [userData, setUserDetail] = useState({});
    const [username, setUsername] = useState('');
    const [phone, setPhone] = useState('');
    const [alamat, setAlamat] = useState('');
    const fetchDataUserEndpoint = "/user";
    const updateUserDataEndpoint = "/updateUser";

    useEffect(() => {
        fetchUserProfile();
    }, []);

    async function fetchUserProfile() {
        const uid = JSON.parse(localStorage.getItem('user-info')).data.uid;

        try {
            let result = await fetch(`${apiBaseUrl}${fetchDataUserEndpoint}/${uid}`, {
                headers: {
                    "Content-Type": 'application/json',
                    "Accept": 'application/json'
                }
            });
            result = await result.json();
            setUserDetail(result.data);

        } catch (error) {
            console.warn("Error fetching user data", error);

        }
    }

    async function updateUser() {
        try {
            let item = { username, phone, alamat };

            let result = await fetch(`${apiBaseUrl}${updateUserDataEndpoint}/${uid}`, {
                method: 'PUT',
                body: JSON.stringify(item),
                headers: {
                    "Content-Type": 'application/json',
                    "Accept": 'application/json'
                }
            })
            result = await result.json()
            if (result.success) {
                fetchUserProfile()
                Swal.fire({
                    position: 'center',
                    icon: 'success',
                    title: 'Berhasil update data',
                    showConfirmButton: false,
                    timer: 1600
                })
            } else {
                Swal.fire({
                    position: 'center',
                    icon: 'error',
                    title: 'That email is already taken ',
                    showConfirmButton: false,
                    timer: 1500
                })
            }
        } catch (error) {
            console.error('Error adding data:', error);
        }
    }

    return (
        <div>
            <Header />
            <br />
            <h1>Profile</h1>
            <div className="col-sm-6 offset-sm-3 align-items-center mx-auto" style={{ maxWidth: '122rem' }}>
                <div style={{ margin: '20px' }}>
                    <div className='card-body' style={{ lineHeight: '2.3rem' }}>
                        <label for='username'>Nama</label>
                        <input type="text" id='username' value={username} onChange={(e) => setUsername(e.target.value)} placeholder={userData.name} className="form-control" />
                        <button onClick={(e) => updateUser()} className="btn btn-primary" style={{ margin: "1rem auto" }}>Edit</button>
                    </div>
                </div>

            </div>

        </div>

    )
}

export default UpdateUserData;