// src/components/MainPage/MainPage.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './MainPage.css';
import urlConfig from '../../config/urlConfig';

export default function MainPage() {
    const [gifts, setGifts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    // Fetch gifts from backend API
    useEffect(() => {
        const fetchGifts = async () => {
            try {
                const url = `${urlConfig.backendUrl}/api/gifts`;
                const response = await fetch(url);

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                const data = await response.json();
                setGifts(data);
                setLoading(false);
            } catch (err) {
                console.error('Fetch error:', err.message);
                setError(err.message);
                setLoading(false);
            }
        };

        fetchGifts();
    }, []);

    // Navigate to gift details
    const goToDetailsPage = (productId) => {
        navigate(`/app/product/${productId}`);
    };

    // Format timestamp to readable date
    const formatDate = (timestamp) => {
        const date = new Date(timestamp * 1000); // Convert seconds to milliseconds
        return date.toLocaleDateString('default', {
            month: 'long',
            day: 'numeric',
            year: 'numeric',
        });
    };

    // Show loading state
    if (loading) {
        return (
            <div className="text-center mt-5">
                <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
                <p>Loading gifts...</p>
            </div>
        );
    }

    // Show error state
    if (error) {
        return (
            <div className="alert alert-danger text-center mt-5" role="alert">
                Failed to load gifts. Please try again later.
            </div>
        );
    }

    return (
        <div className="container mt-5">
            <h2 className="text-center mb-4">Available Gifts</h2>

            {/* Gifts Grid */}
            <div className="row g-4">
                {gifts.length > 0 ? (
                    gifts.map((gift) => (
                        <div
                            key={gift.id}
                            className="col-md-4"
                            role="button"
                            tabIndex="0"
                            onKeyDown={() => goToDetailsPage(gift.id)}
                            onClick={() => goToDetailsPage(gift.id)}
                        >
                            <div className="card h-100 shadow-sm border-0">
                                <div className="image-placeholder">
                                    {gift.image ? (
                                        <img
                                            src={gift.image}
                                            alt={gift.name}
                                            className="card-img-top"
                                            style={{ height: '200px', objectFit: 'cover' }}
                                        />
                                    ) : (
                                        <div className="no-image-available d-flex align-items-center justify-content-center"
                                             style={{ height: '200px', backgroundColor: '#f8f9fa' }}>
                                            No Image Available
                                        </div>
                                    )}
                                </div>
                                <div className="card-body d-flex flex-column">
                                    <h5 className="card-title">{gift.name}</h5>
                                    <p className="card-text text-muted mt-auto">
                                        Added: {formatDate(gift.date_added)}
                                    </p>
                                </div>
                                <div className="card-footer bg-white border-0">
                                    <button
                                        className="btn btn-primary w-100"
                                        onClick={(e) => {
                                            e.stopPropagation(); // Prevent card click
                                            goToDetailsPage(gift.id);
                                        }}
                                    >
                                        View Details
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="col-12 text-center">
                        <p>No gifts available at the moment.</p>
                    </div>
                )}
            </div>
        </div>
    );
}