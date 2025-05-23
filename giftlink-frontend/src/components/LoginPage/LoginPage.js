import React, { useState, useEffect } from 'react';
import { urlConfig } from '../../config'; // Import backend URL configuration
import { useAppContext } from '../../context/AuthContext'; // Import AuthContext
import { useNavigate } from 'react-router-dom'; // For navigation
import './LoginPage.css'; // Import CSS file

function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [incorrect, setIncorrect] = useState(''); // State for error messages

    const navigate = useNavigate(); // For programmatic navigation
    const bearerToken = sessionStorage.getItem('auth-token'); // Check if user is already logged in
    const { setIsLoggedIn, setUserName } = useAppContext(); // Global state management

    // Redirect if user is already logged in
    useEffect(() => {
        if (bearerToken) {
            navigate('/app');
        }
    }, [navigate, bearerToken]);

    const handleLogin = async () => {
        try {
            console.log("Inside handleLogin");
            console.log({
                email,
                password
            });
    
            // Task 1: Access data coming from fetch API
            const response = await fetch(`${urlConfig.backendUrl}/api/auth/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: bearerToken ? `Bearer ${bearerToken}` : '',
                },
                body: JSON.stringify({
                    email,
                    password,
                }),
            });
    
            const json = await response.json(); // Parse JSON response
    
            if (response.ok) {
                // Task 2: Set user details in session storage
                sessionStorage.setItem('auth-token', json.authtoken);
                sessionStorage.setItem('name', json.userName);
                sessionStorage.setItem('email', json.userEmail);
    
                // Task 3: Set the user's state to log in using the useAppContext
                setIsLoggedIn(true);
                setUserName(json.userName);
    
                // Task 4: Navigate to the MainPage after logging in
                navigate('/app');
            } else {
                // Task 5: Clear input and set an error message if the password is incorrect
                setEmail('');
                setPassword('');
                setIncorrect("Wrong password. Try again.");
    
                // Optional: Clear out error message after 2 seconds
                setTimeout(() => {
                    setIncorrect("");
                }, 2000);
            }
        } catch (e) {
            console.error('Error during login:', e.message);
            setIncorrect('An unexpected error occurred. Please try again.');
        }
    };

    return (
        <div className="container mt-5">
            <div className="row justify-content-center">
                <div className="col-md-6 col-lg-4">
                    <div className="login-card p-4 border rounded shadow-sm">
                        <h2 className="text-center mb-4 font-weight-bold">Login</h2>

                        {/* Error Message */}
                        {incorrect && <p className="text-danger text-center">{incorrect}</p>}

                        <form onSubmit={(e) => e.preventDefault()}>
                            <div className="mb-3">
                                <label htmlFor="email" className="form-label">Email address</label>
                                <input
                                    id="email"
                                    type="email"
                                    className="form-control"
                                    placeholder="Enter your email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                            </div>

                            <div className="mb-3">
                                <label htmlFor="password" className="form-label">Password</label>
                                <input
                                    id="password"
                                    type="password"
                                    className="form-control"
                                    placeholder="Enter your password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                            </div>

                            <button
                                className="btn btn-primary w-100 mb-3"
                                onClick={handleLogin}
                                type="button"
                            >
                                Login
                            </button>
                        </form>

                        <p className="mt-4 text-center">
                            New here? <a href="/app/register" className="text-primary">Register Here</a>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default LoginPage;