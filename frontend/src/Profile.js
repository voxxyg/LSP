import React, { useState, useEffect } from 'react'
import Header from './Header'
import apiBaseUrl from './endpoint.mjs'

function Profile() {
    const [userData, setUserDetail] = useState({});
    const fetchDataUserEndpoint = "/user"

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
    return (
        <div>
            <Header />
            <br />
            <h1>Profile</h1>
            <div className="row align-items-start px-3" style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                <div className='col my-2'>
                    <div className='card mx-2 border-0'>
                        <div className='card-body' style={{ lineHeight: '2.3rem' }}>
                            <p>Nama: {userData.name}</p>
                            <p>Email: {userData.email}</p>
                            <p>Nomor Telepon: {userData.phone}</p>
                            <p>Alamat: {userData.alamat}</p>

                        </div>
                    </div>
                </div>
            </div>

        </div>

    )
}

export default Profile;