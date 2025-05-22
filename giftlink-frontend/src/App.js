import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MainPage from './components/MainPage/MainPage';
import LoginPage from './components/LoginPage/LoginPage';
import RegisterPage from './components/RegisterPage/RegisterPage';
import DetailsPage from './components/DetailsPage/DetailsPage';
import SearchPage from './components/SearchPage/SearchPage';
import Navbar from './components/Navbar/Navbar';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

function App() {
    return (
        <Router>
            <>
                <Navbar />
                <div className="container mt-4">
                    <Routes>
                        <Route path="/" element={<MainPage />} />
                        <Route path="/app" element={<MainPage />} />
                        <Route path="/app/login" element={<LoginPage />} />
                        <Route path="/app/register" element={<RegisterPage />} />
                        <Route path="/app/product/:productId" element={<DetailsPage />} />
                        <Route path="/app/details" element={<DetailsPage />} />
                        <Route path="/app/search" element={<SearchPage />} />
                    </Routes>
                </div>
            </>
        </Router>
    );
}

export default App;