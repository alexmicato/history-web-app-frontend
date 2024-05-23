import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Banner from '../../../components/forum/Banner';
import NavBar from '../../../components/forum/ForumNavBar';
import Footer from '../../../components/forum/ForumFooter';
import './CreatePost.css'; 
import PostForm from '../../../components/forum/Posts/PostForm';

function CreatePost() {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState('');

    const navigate = useNavigate();

    const handlePostCreated = (data) => {
        console.log('Post created:', data);
        alert('Post created successfully');
        navigate('/forum');
    };

    return (
        <div className="create-post-container">
            <Banner />
            <NavBar />
            <PostForm 
                initialTitle="" 
                initialContent="" 
                initialCategory=""
                onSubmit={handlePostCreated}
            />
            <Footer />
        </div>
    );
}

export default CreatePost;
