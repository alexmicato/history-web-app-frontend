import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import UserLink from '../User/UserLink';

function useQuery() {
    return new URLSearchParams(useLocation().search);
}

function SearchPostsResults() {
    const navigate = useNavigate();
    const query = useQuery().get('query');
    const [posts, setPosts] = useState([]);
    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const pageSize = 10;

    useEffect(() => {
        const fetchSearchResults = async () => {
            try {
                const response = await axios.get(`http://localhost:8080/search/posts?query=${encodeURIComponent(query)}&page=${page}&size=${pageSize}`, {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('authToken')}`
                    }
                });
                setPosts(response.data.content);
                setTotalPages(response.data.totalPages);
            } catch (error) {
                console.error('Error fetching search results', error);
                alert('Failed to fetch search results');
            }
        };

        fetchSearchResults();
    }, [query, page]);

    const nextPage = () => {
        setPage(prev => (prev + 1 < totalPages ? prev + 1 : prev));
    };

    const previousPage = () => {
        setPage(prev => (prev > 0 ? prev - 1 : 0));
    };

    const handleNavigation = (path) => {
        navigate(path);
    };

    return (
        <div className="search-results-container">
            <h1>Search Results for "{query}"</h1>
            {posts.map(post => (
                <article key={post.id}>
                    <h2>{post.title}</h2>
                    <div
                            className="post-content"
                            dangerouslySetInnerHTML={{ __html: post.content.substring(0, 100)+"..." }}
                     ></div>
                    <button onClick={() => handleNavigation(`/post/${post.id}`)}>
                        Read more
                    </button>
                    <footer>
                        <div>
                            <small>Posted by <UserLink username={post.username || "Unknown"} /> on {new Date(post.createdAt).toLocaleDateString()}</small>
                        </div>
                        <div>
                            <small> Category: {post.category}</small>
                        </div>
                        <div>
                            <small>{post.commentCount} Comments | {post.likesCount} Likes</small>
                        </div>
                    </footer>
                </article>
            ))}
            <div className="pagination-controls">
                <button onClick={previousPage} disabled={page === 0}>Previous</button>
                <span>Page {page + 1} of {totalPages}</span>
                <button onClick={nextPage} disabled={page + 1 >= totalPages}>Next</button>
            </div>
        </div>
    );
}

export default SearchPostsResults;
