import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useUser } from "../../contexts/UserContext";
import "./Article.css";
import ArticleForm from "./ArticleForm"; 
import SimpleModal from "../Modal/SimpleModal"; // Import SimpleModal

function Article({ articleId }) {
    const navigate = useNavigate();
    const [article, setArticle] = useState(null);
    const { user } = useUser();
    const isModerator = user && user.roles && user.roles.includes("MODERATOR");
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);

    useEffect(() => {
        const fetchArticle = async () => {
            try {
                const response = await axios.get(`http://localhost:8080/articles/${articleId}`, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('authToken')}`,
                    },
                });
                setArticle(response.data);
            } catch (error) {
                console.error('Failed to fetch article:', error);
            }
        };

        fetchArticle();
    }, [articleId]);

    const handleDelete = async () => {
        const confirmed = window.confirm("Are you sure you want to delete this article?");
        if (confirmed) {
            try {
                await axios.delete(`http://localhost:8080/articles/${articleId}`, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('authToken')}`,
                    },
                });
                alert('Article deleted successfully');
                navigate('/articles'); // Navigate back to the articles list
            } catch (error) {
                console.error('Failed to delete article:', error);
                alert('Failed to delete article');
            }
        }
    };

    const handleEditSubmit = (updatedArticle) => {
        setArticle(updatedArticle);
        setIsEditModalOpen(false);
    };

    if (!article) {
        return <div>Loading...</div>;
    }

    return (
        <div className="article-page">
            <h1>{article.title}</h1>
            {article.eventDate && <p>{new Date(article.eventDate).toLocaleDateString()}</p>}
            <div className="article-content" dangerouslySetInnerHTML={{ __html: article.content }}></div>
            <div className="article-tags">
                <h4>Tags:</h4>
                <ul>
                    {article.tags.map((tag, index) => (
                        <li key={index}>{tag}</li>
                    ))}
                </ul>
            </div>
            <div className="article-references">
                <h4>References:</h4>
                <ul>
                    {article.references.map((reference, index) => (
                        <li key={index}>
                            {reference.url ? (
                                <a href={reference.url} target="_blank" rel="noopener noreferrer">
                                    {reference.referenceText}
                                </a>
                            ) : (
                                <span>{reference.referenceText}</span>
                            )}
                        </li>
                    ))}
                </ul>
            </div>
            {isModerator && (
                <>
                    <button onClick={() => setIsEditModalOpen(true)}>Edit Article</button>
                    <button onClick={handleDelete}>Delete Article</button>
                </>
            )}
            <SimpleModal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)}>
                <ArticleForm
                    initialTitle={article.title}
                    initialContent={article.content}
                    initialSummary={article.summary}
                    initialType={article.type}
                    initialEventDate={article.eventDate}
                    initialTags={article.tags}
                    initialReadingTime={article.readingTime}
                    initialReferences={article.references}
                    onSubmit={handleEditSubmit}
                    isUpdate={true}
                    articleId={articleId}
                />
            </SimpleModal>
            
        </div>
    );
}

export default Article;
