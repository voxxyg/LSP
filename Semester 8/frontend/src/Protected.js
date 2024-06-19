import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

function Protected(props) {
    const navigate = useNavigate();
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    let Cmp = props.Cmp;

    useEffect(() => {
        let isMounted = true; // tambahkan flag
        if (!localStorage.getItem('user-info')) {
            navigate("/login");
        } else {
            if (isMounted) setIsLoggedIn(true); 
        }
        return () => { isMounted = false }; 
    }, [navigate]); 
    return (
        <div>
            {isLoggedIn && <Cmp />}
        </div>
    )
}

export default Protected;