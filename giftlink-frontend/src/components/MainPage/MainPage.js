import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { urlConfig } from '../../config';

function MainPage() {
    const [gifts, setGifts] = useState([]);
    const navigate = useNavigate();

    // Fetch gifts from API
    useEffect(() => {
        const fetchGifts = async () => {
            try {
                let url = `${urlConfig.backendUrl}/api/gifts`;
                const response = await fetch(url);
                if (!response.ok) {
                    throw new Error(`HTTP error; ${response.status}`);
                }
                const data = await response.json();
                setGifts(data);
            } catch (error) {
                console.log('Fetch error: ' + error.message);
            }
        };

        fetchGifts();
    }, []);

    // Navigate to product details page
    const goToDetailsPage = (productId) => {
        navigate(`/app/product/${productId}`); // Ensure productId is the _id field
    };

    // Format timestamp to readable date
    const formatDate = (timestamp) => {
        const date = new Date(timestamp * 1000); // Convert seconds to milliseconds
        return date.toLocaleDateString('default', {
            month: 'long',
            day: 'numeric',
            year: 'numeric'
        });
    };

    // Get class based on gift condition
    const getConditionClass = (condition) => {
        return condition === "New" ? "list-group-item-success" : "list-group-item-warning";
    };

    return (
        <div className="container mt-5">
            <h2 className="mb-4">Available Gifts</h2>
            <div className="row">
                {gifts.map((gift) => (
                    <div key={gift._id} className="col-md-4 mb-4">
                        <div className="card product-card shadow-sm">
                            <div className="image-placeholder">
                                {gift.image ? (
                                    <img src={gift.image} alt={gift.name} className="card-img-top" />
                                ) : (
                                    <div className="no-image-available p-4 text-center bg-light">
                                        No Image Available
                                    </div>
                                )}
                            </div>
                            <div className="card-body">
                                <h5 className="card-title">{gift.name}</h5>
                                <p className={`card-text ${getConditionClass(gift.condition)}`}>
                                    Condition: {gift.condition}
                                </p>
                                <p className="card-text text-muted">
                                    Added: {formatDate(gift.date_added)}
                                </p>
                            </div>
                            <div className="card-footer">
                                <button
                                    onClick={() => goToDetailsPage(gift._id)} // Use _id instead of id
                                    className="btn btn-primary w-100"
                                >
                                    View Details
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default MainPage;