// pages/Articles/CreateArticle.jsx

import React from 'react';
import { useNavigate } from 'react-router-dom';
import ArticleForm from '../../components/Article/ArticleForm'; 
import './CreateArticlePage.css'; 

function CreateArticle() {
    const navigate = useNavigate();

    const handleArticleCreated = (data) => {
        console.log('Article created:', data);
        alert('Article created successfully');
        navigate('/articles');
    };

    return (
        <div className="create-article-container">
            <ArticleForm 
                initialTitle="" 
                initialContent="" 
                initialSummary="" 
                initialType=""
                initialEventDate=""
                initialTags=""
                initialReadingTime=""
                onSubmit={handleArticleCreated}
            />
        </div>
    );
}

export default CreateArticle;
