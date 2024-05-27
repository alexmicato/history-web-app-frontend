import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useUser } from "../../contexts/UserContext";
import "./Article.css";
import ArticleForm from "./ArticleForm"; 
import SimpleModal from "../Modal/SimpleModal"; 
import { FiMoreVertical } from "react-icons/fi";
import { MdEdit } from "react-icons/md";
import { MdDelete } from "react-icons/md";
import ArticleSummary from "./ArticleSummary";
import useOutsideClick from "../../hooks/useOutsideClick";

function Article({ article, onUpdateArticle }) {
    const navigate = useNavigate();
    const { user } = useUser();
    const isModerator = user && user.roles && user.roles.includes("MODERATOR");
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const optionsRef = useRef(null);

    useOutsideClick(optionsRef, () => {
        if (isDropdownOpen) setIsDropdownOpen(false);
      });
    

    const handleDelete = async () => {
        const confirmed = window.confirm("Are you sure you want to delete this article?");
        if (confirmed) {
            try {
                await axios.delete(`http://localhost:8080/articles/${article.id}`, {
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
        onUpdateArticle(updatedArticle);
        setIsEditModalOpen(false);
    };

    if (!article) {
        return <div>Loading...</div>;
    }

    return (
        <div className="article-page">
            <div className="article-header">
                <h1>{article.title}</h1>
                {isModerator && (
                    <div className="dropdown">
                        <button onClick={() => setIsDropdownOpen(!isDropdownOpen)} className="dropdown-toggle" ref={optionsRef}>
                            <FiMoreVertical />
                        </button>
                        {isDropdownOpen && (
                            <div className="dropdown-menu">
                                <button onClick={() => setIsEditModalOpen(true)}><MdEdit/> Edit</button>
                                <button onClick={handleDelete}><MdDelete/> Delete</button>
                            </div>
                        )}
                    </div>
                )}
            </div>
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
                    articleId={article.id}
                />
            </SimpleModal>
        </div>
    );
}

export default Article;
