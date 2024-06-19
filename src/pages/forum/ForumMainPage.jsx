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
import PostPreview from '../../components/forum/Posts/PostPreview';
import { TbArrowsSort } from "react-icons/tb";
import useSwipeToggle from '../../hooks/useSwipeToggle';

function ForumMainPage()
{
    const navigate = useNavigate();
    const [isSidebarVisible, setSidebarVisibility] = useSwipeToggle(false);
    const [posts, setPosts] = useState([]);
    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [categories, setCategories] = useState([]);
    const [sortDirection, setSortDirection] = useState('desc');
    const [isSticky, setIsSticky] = useState(false);
    const pageSize = 10; 

    useEffect(() => {
        const loadInitialData = async () => {
            try {
                const fetchedCategories = await fetchCategories();
                setCategories(fetchedCategories);
                const response = await axios.get(`http://localhost:8080/posts?page=${page}&size=${pageSize}&sort=${encodeURIComponent('createdAt,' + sortDirection)}`, {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('authToken')}`
                    }
                });
                setPosts(response.data.content);
                //console.log("Posts received:" + response.data.content);
                setTotalPages(response.data.totalPages);
            } catch (error) {
                console.error('Error initializing data', error);
                alert('Failed to fetch initial data');
            }
        };

        loadInitialData();
    }, [page, sortDirection]);


    const toggleSortDirection = () => {
        setSortDirection(prevDirection => prevDirection === 'desc' ? 'asc' : 'desc');
    };

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
                <div className={`forum-page-filter ${isSidebarVisible ? 'visible' : ''}`}>
                    <ForumSidebar />
                </div>
                <main className='forum-main'>
                    <button onClick={toggleSortDirection}>
                        Sort <TbArrowsSort />
                    </button>
                    {posts.map(post => <PostPreview key={post.id} post={post} />)}
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