// pages/ArticlesPage.jsx

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import ArticlesNavBar from '../../components/Article/ArticlesNavBar';
import ArticleList from '../../components/Article/ArticleList';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../../contexts/UserContext';

function ArticlesPage() {
    const { user } = useUser();
    const isModerator = user && user.roles && user.roles.includes('MODERATOR');
    const navigate = useNavigate();
    const [articles, setArticles] = useState([]);
    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const pageSize = 10;

    const handleNavigation = (path) => {
        navigate(path);
    };

    useEffect(() => {
        fetchArticles();
    }, []);

    const fetchArticles = async () => {
        try {
            const response = await axios.get(`http://localhost:8080/articles?page=${page}&size=${pageSize}`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('authToken')}`,
                },
            });
            setArticles(response.data.content);
            setTotalPages(response.data.totalPages);
        } catch (error) {
            console.error('Failed to fetch articles:', error);
        }
    };

    const handleSearch = async (searchTerm) => {
        try {
            const response = await axios.get(`http://localhost:8080/articles/search?query=${searchTerm}&page=${page}&size=${pageSize}`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('authToken')}`,
                },
            });
            setArticles(response.data.content);
            setTotalPages(response.data.totalPages);
        } catch (error) {
            console.error('Failed to search articles:', error);
        }
    };

    const handleFilter = async (type) => {
        try {
            const response = await axios.get(`http://localhost:8080/articles/type/${type.toUpperCase().replace(' ', '_')}?page=${page}&size=${pageSize}`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('authToken')}`,
                },
            });
            setArticles(response.data.content);
            setTotalPages(response.data.totalPages);
        } catch (error) {
            console.error('Failed to filter articles:', error);
        }
    };

    const nextPage = () => {
        if (page < totalPages - 1) {
            setPage(prevPage => prevPage + 1);
        }
    };

    const previousPage = () => {
        if (page > 0) {
            setPage(prevPage => prevPage - 1);
        }
    };

    return (
        <div className="articles-page">
            <ArticlesNavBar onSearch={handleSearch} onFilter={handleFilter} />
            {isModerator && <button onClick={() => handleNavigation('/create-article')}>Create article</button>}
            <ArticleList articles={articles} />
            <div className="pagination-controls">
                <button onClick={previousPage} disabled={page === 0}>Previous</button>
                <span>Page {page + 1} of {totalPages}</span>
                <button onClick={nextPage} disabled={page === totalPages - 1}>Next</button>
            </div>
        </div>
    );
}

export default ArticlesPage;
