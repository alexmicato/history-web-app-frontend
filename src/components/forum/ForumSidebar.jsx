import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchCategories } from '../../services/CategoryService';
import axios from "axios";

function ForumSidebar() {
    const navigate = useNavigate();
    const [categories, setCategories] = useState([]);
    const [popularPosts, setPopularPosts] = useState([]);

    useEffect(() => {
        const loadCategories = async () => {
            try {
                const fetchedCategories = await fetchCategories();
                setCategories(fetchedCategories);
            } catch (error) {
                console.error('Error fetching categories', error);
                alert('Failed to fetch categories');
            }
        };

        const loadPopularPosts = async () => {
            try {
                const response = await axios.get('http://localhost:8080/search/popular-posts', {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('authToken')}`
                    }
                });
                setPopularPosts(response.data);
            } catch (error) {
                console.error('Error fetching popular posts', error);
                alert('Failed to fetch popular posts');
            }
        };

        loadCategories();
        loadPopularPosts();
    }, []);

    const handleNavigation = (path) => {
        navigate(path);
    };

    return (
        <aside className="forum-sidebar">
            <h4>Categories</h4>
            <ul>
                {categories.map((category) => (
                    <li key={category} onClick={() => handleNavigation(`/search/posts?query=${category}`)}>
                        {category}
                    </li>
                ))}
            </ul>
            <h4>Popular Posts</h4>
            <ul>
                {popularPosts.map((post) => (
                    <li key={post.id} onClick={() => handleNavigation(`/post/${post.id}`)}>
                        {post.title}
                    </li>
                ))}
            </ul>
            <button onClick={() => handleNavigation('/create-post')} className="create-post-btn">
                Create Post
            </button>
        </aside>
    );
}

export default ForumSidebar;
