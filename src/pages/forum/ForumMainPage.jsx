import React, { useState, useEffect } from 'react';
import './ForumMainPage.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Banner from '../../components/forum/Banner';
import NavBar from '../../components/forum/ForumNavBar';
import Footer from '../../components/forum/ForumFooter';
import UserLink from '../../components/forum/User/UserLink';
import { fetchCategories } from '../../services/CategoryService';
import ForumSidebar from '../../components/forum/ForumSidebar';

function ForumMainPage()
{
    const navigate = useNavigate();
    const [posts, setPosts] = useState([]);
    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [categories, setCategories] = useState([]);
    const pageSize = 10; 

    useEffect(() => {
        const loadInitialData = async () => {
            try {
                const fetchedCategories = await fetchCategories();
                setCategories(fetchedCategories);
                const response = await axios.get(`http://localhost:8080/posts?page=${page}&size=${pageSize}&sort=${encodeURIComponent('createdAt,desc')}`, {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('authToken')}`
                    }
                });
                setPosts(response.data.content);
                setTotalPages(response.data.totalPages);
            } catch (error) {
                console.error('Error initializing data', error);
                alert('Failed to fetch initial data');
            }
        };

        loadInitialData();
    }, [page]);

    const handleNavigation = (path) => {
        navigate(path);
    };

    const nextPage = () => {
        setPage(prev => (prev + 1 < totalPages ? prev + 1 : prev));
    };

    const previousPage = () => {
        setPage(prev => (prev > 0 ? prev - 1 : 0));
    };


    return(

        <div className='forum-container'>
            <Banner />
            <NavBar />
            <div className='forum-content'>
                <ForumSidebar />
                <main className='forum-main'>
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
                            <div>
                                <small>{post.commentCount} Comments | {post.likesCount} Likes</small>
                            </div>
                            </div>
                        </footer>
                    </article>
                    ))}
                <div className="pagination-controls">
                        <button onClick={previousPage} disabled={page === 0}>Previous</button>
                        <span>Page {page + 1} of {totalPages}</span>
                        <button onClick={nextPage} disabled={page + 1 >= totalPages}>Next</button>
                    </div>
                </main>
            </div>
            <Footer />
        </div>

    )
}

export default ForumMainPage;