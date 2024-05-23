import React, { useEffect, useState } from 'react';
import axios from 'axios';
import ArticlesNavBar from '../../components/Article/ArticlesNavBar';
import ArticleList from '../../components/Article/ArticleList';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../../contexts/UserContext';
import { useParams } from 'react-router-dom'; 
import Article from '../../components/Article/Article';

function ArticlePage() {
    const { articleId } = useParams();

    return (
        <div>
            <main>
                <Article articleId={articleId} /> {/* Passing postId to the Post component */}
            </main>
        </div>
    );
}

export default ArticlePage;
