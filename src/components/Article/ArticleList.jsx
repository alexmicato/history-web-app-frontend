// components/ArticleList.jsx

import React from 'react';
import { useNavigate } from 'react-router-dom';

function ArticleList({ articles }) {

    const navigate = useNavigate();

    const handleNavigation = (path) => {
        navigate(path);
    };

    return (
        <div className="article-list">
            {articles.map(article => (
                <div key={article.id} className="article-item">
                    {article.mainImageUrl && <img src={article.mainImageUrl} alt={article.title} />}
                    <h2>{article.title}</h2>
                    {article.eventDate && <p>{new Date(article.eventDate).toLocaleDateString()}</p>}
                    <p>Type: {article.type}</p>
                    <p>{article.summary}</p>
                    <p>Reading Time: {article.readingTime} minutes</p>
                    <button onClick={() => handleNavigation(`/article/${article.id}`)}>
                            Read more
                    </button>
                </div>
            ))}
        </div>
    );
}

export default ArticleList;
