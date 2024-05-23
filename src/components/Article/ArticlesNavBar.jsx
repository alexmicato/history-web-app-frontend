// components/ArticlesNavBar.jsx

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function ArticlesNavBar({ onSearch, onFilter }) {
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState('');

    const handleSearch = () => {
        onSearch(searchTerm);
    };

    const handleFilter = (type) => {
        onFilter(type);
    };

    const handleNavigation = (path) => {
        navigate(path);
    };

    return (
        <nav className="articles-navbar">
         <button onClick={() => handleNavigation('/main')}>Home</button>
            <input 
                type="text" 
                placeholder="Search articles..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button onClick={handleSearch}>Search</button>
            <button onClick={() => handleFilter('Event')}>Events</button>
            <button onClick={() => handleFilter('Country')}>Countries</button>
            <button onClick={() => handleFilter('Historical Figure')}>Historical Figures</button>
            <button onClick={() => handleFilter('Place')}>Places</button>
            <button onClick={() => handleFilter('Other')}>Other</button>
        </nav>
    );
}

export default ArticlesNavBar;
