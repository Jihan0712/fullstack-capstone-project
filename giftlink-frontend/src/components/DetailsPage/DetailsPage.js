import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { urlConfig } from '../../config';
import './DetailsPage.css';

function DetailsPage() {
    const [gift, setGift] = useState(null);
    const [comments, setComments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const { productId } = useParams();
    const navigate = useNavigate();

    // Task 1: Check for authentication
    useEffect(() => {
        const token = sessionStorage.getItem('token');
        if (!token) {
            navigate('/app/login');
        }
    }, [navigate]);

    // Task 2 & 8: Fetch gift details using product ID
    useEffect(() => {
        const fetchGiftDetails = async () => {
            try {
                const response = await fetch(`${urlConfig.backendUrl}/api/gifts/${productId}`);
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const data = await response.json();
                setGift(data);
                setComments(data.comments || []);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchGiftDetails();

        // Task 3: Scroll to top on mount
        window.scrollTo(0, 0);
    }, [productId]);

    // Task 4: Navigate back
    const handleGoBack = () => {
        navigate(-1);
    };

    if (loading) {
        return (
            <div className="container mt-5 text-center">
                <h3>Loading gift details...</h3>
            </div>
        );
    }

    if (error) {
        return (
            <div className="container mt-5 text-center">
                <h3>Error fetching gift: {error}</h3>
                <button className="btn btn-secondary" onClick={handleGoBack}>Go Back</button>
            </div>
        );
    }

    if (!gift) {
        return (
            <div className="container mt-5 text-center">
                <h3>Gift not found.</h3>
                <button className="btn btn-secondary" onClick={handleGoBack}>Go Back</button>
            </div>
        );
    }

    return (
        <div className="container mt-5">
            <div className="row">
                <div className="col-md-8 offset-md-2">
                    <button className="btn btn-link mb-3" onClick={handleGoBack}>
                        ← Back
                    </button>

                    <div className="card shadow-sm">
                        <div className="card-body">
                            {/* Task 5: Display Gift Image */}
                            <div className="text-center mb-4">
                                {gift.image ? (
                                    <img
                                        src={gift.image}
                                        alt={gift.name}
                                        className="product-image-large img-fluid"
                                    />
                                ) : (
                                    <div className="no-image-available p-4 bg-light border rounded">
                                        No Image Available
                                    </div>
                                )}
                            </div>

                            {/* Task 6: Display Gift Details */}
                            <h3 className="card-title">{gift.name}</h3>
                            <p><strong>Category:</strong> {gift.category}</p>
                            <p><strong>Condition:</strong> {gift.condition}</p>
                            <p><strong>Age:</strong> {gift.age}</p>
                            <p><strong>Date Added:</strong> {new Date(gift.date_added * 1000).toLocaleDateString()}</p>
                            <p><strong>Description:</strong> {gift.description}</p>

                            {/* Task 7: Render Comments Section */}
                            <div className="mt-4">
                                <h5>Comments</h5>
                                {comments.length > 0 ? (
                                    <ul className="list-group">
                                        {comments.map((comment, index) => (
                                            <li key={index} className="list-group-item">
                                                <strong>{comment.user || "Anonymous"}:</strong> {comment.text}
                                            </li>
                                        ))}
                                    </ul>
                                ) : (
                                    <p>No comments yet.</p>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default DetailsPage;