// components/ArticleList.jsx

import React from 'react';
import { useNavigate } from 'react-router-dom';
import "./ArticleList.css"

function ArticleList({ articles }) {

    const navigate = useNavigate();

    const handleNavigation = (path) => {
        navigate(path);
    };

    return (
        <div className="article-list">
            {articles.map(article => (
                <div key={article.id} className="article-container">
                    <div className="article-list-content">
                        <h2>{article.title}</h2>
                        {article.eventDate && <p>{new Date(article.eventDate).toLocaleDateString()}</p>}
                        <p>Type: {article.type}</p>
                        <p>{article.summary}</p>
                        <p>Reading Time: {article.readingTime} minutes</p>
                        <button onClick={() => handleNavigation(`/article/${article.id}`)}>
                            Read more
                        </button>
                    </div>
                    <div className="article-image">
                        {article.mainImageUrl ? (
                            <img src={article.mainImageUrl} alt={article.title} />
                        ) : (
                            <img src="/assets/images/backgrounds/articles-default.png" alt="Default" /> // Assuming this is the default image
                        )}
                    </div>
                </div>
            ))}
        </div>
    );
}

export default ArticleList;
