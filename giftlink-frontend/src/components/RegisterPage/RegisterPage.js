import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

// Task 1: Import urlConfig
import { urlConfig } from '../../config';

// Task 2: Import useAppContext
import { useAppContext } from '../../context/AuthContext';
import './RegisterPage.css';

function RegisterPage() {
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    // Task 4: Include a state for error message
    const [showerr, setShowerr] = useState('');

    // Task 5: Create local variables for navigate and setIsLoggedIn
    const navigate = useNavigate();
    const { setIsLoggedIn } = useAppContext();

    const handleRegister = async () => {
        try {
            const response = await fetch(`${urlConfig.backendUrl}/api/auth/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    firstName,
                    lastName,
                    email,
                    password
                })
            });

            // Task 1: Access data coming from fetch API
            const json = await response.json();

            if (!response.ok) {
                // Task 5: Set an error message if registration fails
                const errorMessage = json.error || "Registration failed. Please try again.";
                setShowerr(errorMessage);
                return;
            }

            // Task 2: Set user details in sessionStorage
            if (json.authtoken) {
                sessionStorage.setItem('auth-token', json.authtoken);
                sessionStorage.setItem('name', `${firstName} ${lastName}`);
                sessionStorage.setItem('email', json.email);
            }

            // Task 3: Set the state of user to logged in
            setIsLoggedIn(true);

            // Task 4: Navigate to MainPage after logging in
            navigate('/app');

        } catch (e) {
            console.log("Error fetching details: " + e.message);
            setShowerr("Something went wrong. Please try again.");
        }
    };

    return (
        <div className="container mt-5">
            <div className="row justify-content-center">
                <div className="col-md-6 col-lg-4">
                    <div className="register-card p-4 border rounded shadow-sm">
                        <h2 className="text-center mb-4 font-weight-bold">Register</h2>

                        {/* Task 6: Display error message to end user */}
                        {showerr && (
                            <div className="alert alert-danger" role="alert">
                                {showerr}
                            </div>
                        )}

                        <form onSubmit={(e) => e.preventDefault()}>
                            {/* First Name */}
                            <div className="mb-3">
                                <label htmlFor="firstName" className="form-label">First Name</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    id="firstName"
                                    value={firstName}
                                    onChange={(e) => setFirstName(e.target.value)}
                                />
                            </div>

                            {/* Last Name */}
                            <div className="mb-3">
                                <label htmlFor="lastName" className="form-label">Last Name</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    id="lastName"
                                    value={lastName}
                                    onChange={(e) => setLastName(e.target.value)}
                                />
                            </div>

                            {/* Email */}
                            <div className="mb-3">
                                <label htmlFor="email" className="form-label">Email address</label>
                                <input
                                    type="email"
                                    className="form-control"
                                    id="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </div>

                            {/* Password */}
                            <div className="mb-3">
                                <label htmlFor="password" className="form-label">Password</label>
                                <input
                                    type="password"
                                    className="form-control"
                                    id="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                            </div>

                            {/* Register Button */}
                            <button
                                className="btn btn-primary w-100 mb-3"
                                onClick={handleRegister}
                                type="button"
                            >
                                Register
                            </button>
                        </form>

                        {/* Already registered? */}
                        <p className="mt-4 text-center">
                            Already a member? <a href="/app/login" className="text-primary">Login</a>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default RegisterPage;