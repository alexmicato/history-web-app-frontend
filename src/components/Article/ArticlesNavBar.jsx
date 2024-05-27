// components/ArticlesNavBar.jsx

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaSearch, FaHome } from "react-icons/fa";
import "./ArticlesNavBar.css";

function ArticlesNavBar({ onSearch, onFilter }) {
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState('');
    const [showSearch, setShowSearch] = useState(false);
    const [selectedType, setSelectedType] = useState('');

    const handleSearch = () => {
        onSearch(searchTerm);
    };

    const handleFilter = (type) => {
        setSelectedType(type);
        onFilter(type);
    };

    const handleNavigation = (path) => {
        navigate(path);
    };

    const toggleSearch = () => {
        setShowSearch(!showSearch);
    };

    const handleReload = () => {
        window.location.reload(); // Reload the page
    };


    return (
        <nav className="articles-navbar">
            <button onClick={() => handleNavigation('/main')} title="Home" ><FaHome /></button>
            <div className='articles-navbar-buttons'>
                <button onClick={(handleReload)} className={selectedType === '' ? 'selected' : ''}>All</button>
                <button 
                    onClick={() => handleFilter('Event')} 
                    className={selectedType === 'Event' ? 'selected' : ''}
                >
                    Events
                </button>
                <button 
                    onClick={() => handleFilter('Country')} 
                    className={selectedType === 'Country' ? 'selected' : ''}
                >
                    Countries
                </button>
                <button 
                    onClick={() => handleFilter('Historical Figure')} 
                    className={selectedType === 'Historical Figure' ? 'selected' : ''}
                >
                    Historical Figures
                </button>
                <button 
                    onClick={() => handleFilter('Place')} 
                    className={selectedType === 'Place' ? 'selected' : ''}
                >
                    Places
                </button>
                <button 
                    onClick={() => handleFilter('Other')} 
                    className={selectedType === 'Other' ? 'selected' : ''}
                >
                    Other
                </button>
            </div>

            <button onClick={toggleSearch} className="articles-search-icon">
                <FaSearch />
            </button> 
            {showSearch && (
                <div className="articles-search-popup">
                    <input 
                        type="text" 
                        placeholder="Search articles..." 
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <button onClick={handleSearch}>Search</button>
                </div>
            )}

        </nav>
    );
}

export default ArticlesNavBar;
