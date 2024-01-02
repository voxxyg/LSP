import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import { Link, useNavigate } from 'react-router-dom'
import Swal from 'sweetalert2'
import logo from './img/logo_leafhea_web.png'

function Header() {
    let user = JSON.parse(localStorage.getItem('user-info'))
    const navigate = useNavigate();
    function logOut() {
        localStorage.clear()
        navigate("/login")
        Swal.fire({
            position: 'center',
            icon: 'success',
            title: 'Berhasil Logout',
            showConfirmButton: false,
            timer: 1600
        })
    }
    return (
        <div style={{ backgroundColor: 'magenta' }}>
            <Navbar expand="lg" className="bg-body-tertiary">
                <Container fluid>
                    <Navbar.Brand href="#">Restoran</Navbar.Brand>
                    <Navbar.Toggle aria-controls="navbarScroll" />
                    <Navbar.Collapse id="navbarScroll">
                        <Nav
                            className="me-auto my-2 my-lg-0"
                            style={{ maxHeight: '100px' }}
                            navbarScroll
                        >
                            {
                                localStorage.getItem('user-info') ?
                                    (
                                        <>
                                            <Link to="/addProduct" class='navv'>Tambah Produk</Link>
                                            <Link to="/payment" class='navv'>Dashboard Pemesanan</Link>
                                            <Link to="/listproducts" class='navv'>Daftar Makanan</Link>
                                            <Link to="/payment" class='navv'>Daftar Pesanan</Link>
                                        </>
                                    )
                                    :
                                    (
                                        <>
                                            <Link to="/login" class='navv'>Login</Link>
                                            <Link to="/listproducts" class='navv'>Daftar Makanan</Link>
                                        </>
                                    )
                            }
                        </Nav>

                        {localStorage.getItem('user-info') ?

                            <Nav style={{ marginRight: '1.5rem' }}>
                                <NavDropdown title={user && user.user.username}>
                                    <NavDropdown.Item onClick={logOut}>Logout</NavDropdown.Item>
                                </NavDropdown>
                            </Nav>
                            : null
                        }
                    </Navbar.Collapse>
                </Container>
            </Navbar>
        </div>
    )
}

// module.exports = {Header}
export default Header