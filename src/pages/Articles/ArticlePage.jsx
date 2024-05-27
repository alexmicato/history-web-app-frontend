import React, { useEffect, useState } from 'react';
import axios from 'axios';
import ArticlesNavBar from '../../components/Article/ArticlesNavBar';
import ArticleList from '../../components/Article/ArticleList';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../../contexts/UserContext';
import { useParams } from 'react-router-dom'; 
import Article from '../../components/Article/Article';
import "./ArticlePage.css"
import ArticleSummary from '../../components/Article/ArticleSummary';

function ArticlePage() {
    const { articleId } = useParams();
    const [article, setArticle] = useState(null);
    const [chapters, setChapters] = useState([]);
    const navigate = useNavigate();

    const extractChapters = (content) => {
        const parser = new DOMParser();
        const doc = parser.parseFromString(`<div>${content}</div>`, 'text/html'); // Wrap content in a div
        const headings = doc.querySelectorAll('h3');
        const newChapters = Array.from(headings).map((heading, index) => {
            const id = `chapter-${index}`;
            heading.id = id; // Assign an id to each heading
            return { id, text: heading.textContent };
        });
        console.log('Extracted chapters:', newChapters); // Debug log
        return newChapters; // Return the chapters instead of setting state directly
    };

    useEffect(() => {
        const fetchArticle = async () => {
            try {
                const response = await axios.get(`http://localhost:8080/articles/${articleId}`, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('authToken')}`,
                    },
                });
                setArticle(response.data);
                const extractedChapters = extractChapters(response.data.content);
                setChapters(extractedChapters);
            } catch (error) {
                console.error('Failed to fetch article:', error);
            }
        };

        fetchArticle();
        
    }, [articleId]);

    if (!article) {
        return <div>Loading...</div>;
    }

    const handleUpdateArticle = (updatedArticle) => {
        console.log('Updated article:', updatedArticle); // Debug log
        setArticle(updatedArticle);
        const extractedChapters = extractChapters(updatedArticle.content);
        setChapters(extractedChapters);
    };

    return (
        <div className='article-page-container'>
            <div className='article-page-sidebar'>
                <button 
                    className='article-page-back-button' 
                    onClick={() => navigate('/articles')}
                >
                    Back to Articles
                </button>
                <ArticleSummary chapters={chapters} />
            </div>
            <Article article={article} onUpdateArticle={handleUpdateArticle} />
        </div>
    );
}

export default ArticlePage;
