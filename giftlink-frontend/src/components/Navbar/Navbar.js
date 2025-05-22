import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { urlConfig } from '../../config';
import { useAppContext } from '../../context/AuthContext';

export default function Navbar() {
    const { isLoggedIn, setIsLoggedIn, userName, setUserName } = useAppContext();
    const navigate = useNavigate();

    console.log('isLoggedIn:', isLoggedIn);
    console.log('setIsLoggedIn:', setIsLoggedIn);
    console.log('userName:', userName);
    console.log('setUserName:', setUserName);

    if (typeof setUserName !== 'function') {
        console.error('setUserName is not a function');
    }

    // Load session storage data on component mount
    useEffect(() => {
        const authTokenFromSession = sessionStorage.getItem('auth-token');
        const nameFromSession = sessionStorage.getItem('name');

        if (authTokenFromSession && nameFromSession) {
            setIsLoggedIn(true);
            setUserName(nameFromSession);
        } else {
            setIsLoggedIn(false);
            setUserName(null);
        }
    }, [isLoggedIn, setIsLoggedIn, setUserName]);

    // Handle logout
    const handleLogout = () => {
        sessionStorage.removeItem('auth-token');
        sessionStorage.removeItem('name');
        sessionStorage.removeItem('email');
        setIsLoggedIn(false);
        setUserName(null);
        navigate('/app');
    };

    // Navigate to profile page (optional)
    const profileSection = () => {
        navigate('/app/profile');
    };

    return (
        <nav className="navbar navbar-expand-lg navbar-light bg-light">
            <Link className="navbar-brand" to="/app">GiftLink</Link>

            <button
                className="navbar-toggler"
                type="button"
                data-bs-toggle="collapse"
                data-bs-target="#navbarNav"
                aria-controls="navbarNav"
                aria-expanded="false"
                aria-label="Toggle navigation"
            >
                <span className="navbar-toggler-icon"></span>
            </button>

            <div className="collapse navbar-collapse justify-content-end" id="navbarNav">
                <ul className="navbar-nav">
                    <li className="nav-item">
                        <Link className="nav-link" to="/home.html">Home</Link>
                    </li>
                    <li className="nav-item">
                        <Link className="nav-link" to="/app">Gifts</Link>
                    </li>
                    <li className="nav-item">
                        <Link className="nav-link" to="/app/search">Search</Link>
                    </li>

                    <ul className="navbar-nav ms-auto d-flex">
                        {isLoggedIn ? (
                            <>
                                <li className="nav-item">
                                    <span
                                        className="nav-link"
                                        style={{ cursor: "pointer", color: "#007bff" }}
                                        onClick={profileSection}
                                    >
                                        Welcome, {userName}
                                    </span>
                                </li>
                                <li className="nav-item">
                                    <button
                                        className="btn nav-link login-btn"
                                        style={{ background: "none", border: "none", padding: 0 }}
                                        onClick={handleLogout}
                                    >
                                        Logout
                                    </button>
                                </li>
                            </>
                        ) : (
                            <>
                                <li className="nav-item">
                                    <Link className="nav-link login-btn" to="/app/login">Login</Link>
                                </li>
                                <li className="nav-item">
                                    <Link className="nav-link register-btn" to="/app/register">Register</Link>
                                </li>
                            </>
                        )}
                    </ul>
                </ul>
            </div>
        </nav>
    );
}