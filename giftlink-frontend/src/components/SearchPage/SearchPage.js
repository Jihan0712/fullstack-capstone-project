import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { urlConfig } from '../../config';
import './SearchPage.css';

function SearchPage() {
    const [searchQuery, setSearchQuery] = useState('');
    const [ageRange, setAgeRange] = useState(6);
    const [searchResults, setSearchResults] = useState([]);
    const navigate = useNavigate();

    // Define categories and conditions for dropdowns
    const categories = ['Toys', 'Books', 'Electronics', 'Clothing', 'Games'];
    const conditions = ['New', 'Like New', 'Used', 'Poor'];

    // Navigate to Details Page
    const goToDetailsPage = (productId) => {
        navigate(`/app/product/${productId}`);
    };

    // Fetch search results
    const handleSearch = async () => {
        const baseUrl = `${urlConfig.backendUrl}/api/search?`;
        const queryParams = new URLSearchParams({
            name: searchQuery,
            age_years: ageRange,
            category: document.getElementById('categorySelect')?.value || '',
            condition: document.getElementById('conditionSelect')?.value || ''
        }).toString();

        try {
            const response = await fetch(`${baseUrl}${queryParams}`);
            if (!response.ok) {
                throw new Error('Search failed');
            }
            const data = await response.json();
            setSearchResults(data);
        } catch (error) {
            console.error('Failed to fetch search results:', error);
        }
    };

    return (
        <div className="container mt-5">
            <h2 className="mb-4 text-center">Gift Search</h2>

            {/* Search Input Fields */}
            <div className="row mb-4">
                <div className="col-md-6">
                    <input
                        type="text"
                        className="form-control"
                        placeholder="Search by gift name..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
                <div className="col-md-3">
                    <select id="categorySelect" className="form-control">
                        <option value="">All Categories</option>
                        {categories.map((category) => (
                            <option key={category} value={category}>
                                {category}
                            </option>
                        ))}
                    </select>
                </div>
                <div className="col-md-3">
                    <select id="conditionSelect" className="form-control">
                        <option value="">All Conditions</option>
                        {conditions.map((condition) => (
                            <option key={condition} value={condition}>
                                {condition}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Age Range Slider */}
            <div className="row mb-4 align-items-center">
                <div className="col-md-3">
                    <label htmlFor="ageRange">Max Age:</label>
                </div>
                <div className="col-md-6">
                    <input
                        type="range"
                        className="form-range"
                        id="ageRange"
                        min="1"
                        max="10"
                        value={ageRange}
                        onChange={(e) => setAgeRange(parseInt(e.target.value))}
                    />
                </div>
                <div className="col-md-3 text-center">
                    <strong>{ageRange} years</strong>
                </div>
            </div>

            {/* Search Button */}
            <div className="row mb-4">
                <div className="col-md-12 text-center">
                    <button className="btn btn-primary" onClick={handleSearch}>
                        Search Gifts
                    </button>
                </div>
            </div>

            {/* Search Results */}
            <div className="search-results mt-4">
                {searchResults.length > 0 ? (
                    searchResults.map((product) => (
                        <div key={product.id} className="card mb-4 shadow-sm">
                            <div className="row g-0">
                                <div className="col-md-4">
                                    {product.image ? (
                                        <img
                                            src={product.image}
                                            alt={product.name}
                                            className="img-fluid rounded-start card-img-top"
                                        />
                                    ) : (
                                        <div className="no-image-available p-4 bg-light border-end">
                                            No Image Available
                                        </div>
                                    )}
                                </div>
                                <div className="col-md-8">
                                    <div className="card-body">
                                        <h5 className="card-title">{product.name}</h5>
                                        <p className="card-text">
                                            {product.description.slice(0, 100)}...
                                        </p>
                                        <div className="card-footer bg-white border-0">
                                            <button
                                                onClick={() => goToDetailsPage(product.id)}
                                                className="btn btn-primary"
                                            >
                                                View More
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="alert alert-info text-center" role="alert">
                        No gifts found. Please adjust your filters.
                    </div>
                )}
            </div>
        </div>
    );
}

export default SearchPage;