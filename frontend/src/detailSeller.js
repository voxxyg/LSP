import Header from "./Header"
import React, { useEffect, useState } from 'react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import Swal from 'sweetalert2'
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import { Dropdown } from 'react-bootstrap';
import { useParams } from "react-router-dom";

function DetailSellerPage() {
    return (
        <div>
            <Header />
            <h1 style={{ marginBottom: '2rem' }}>Leafhea Indonesia</h1>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                <p className="card-text">Nomor Whatsapp: 082112391401</p>
                <p className="card-text">Lokasi: JL.Nusantara Selatan III</p>
            </div>
        </div>
    );
}

export default DetailSellerPage
