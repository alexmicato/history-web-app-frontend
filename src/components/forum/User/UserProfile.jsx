import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useUser } from "../../../contexts/UserContext";
import './UserProfile.css';
import PostPreview from '../Posts/PostPreview';
import { FiMoreVertical } from "react-icons/fi";
import { IoMdSettings } from "react-icons/io";
import { SiGooglemessages } from "react-icons/si";

function UserProfile({ username }) {
    const [userData, setUserData] = useState({
        username: '',
        profileImageUrl: '/assets/images/profile/default.jpg' // Default image
    });

    const { user, logoutUser } = useUser();
    const isLoggedUser = user && user.username === username;
    const navigate = useNavigate(); 
    const [showOptions, setShowOptions] = useState(false);
    const [userPosts, setUserPosts] = useState([]);
    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [categories, setCategories] = useState([]);
    const pageSize = 10; 

    useEffect(() => {
        const loadInitialData = async () => {
            try {
                const response = await axios.get(`http://localhost:8080/users/posts/${username}?page=${page}&size=${pageSize}&sort=${encodeURIComponent('createdAt,desc')}`, {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('authToken')}`
                    }
                });
                setUserPosts(response.data.content);
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

    useEffect(() => {

        const fetchUserData = async () => {
            try {
                const token = localStorage.getItem('authToken'); // Retrieve the stored authentication token
                const response = await axios.get(`http://localhost:8080/users/${username}`, {
                    headers: {
                        'Authorization': `Bearer ${token}` // Include the token in the Authorization header
                    }
                });
                console.log('Received user data:', response.data);
                setUserData({
                    username: response.data.username,
                    profileImageUrl: response.data.profileImageUrl || '/assets/images/profile/default.jpg'
                });
            } catch (error) {
                console.error('Failed to fetch user data:', error);
            }
        };
    
        fetchUserData();
    }, [username]);

    return (
        <div className="profile-info">
            <div className="profile-header">
                <div className="profile-image">
                    <h2>{userData.username}</h2>
                    <img src={userData.profileImageUrl} alt={`${userData.username}'s profile`} style={{ width: 100, height: 100 }} />
                </div>
                <div className="user-profile-options">
                    <button onClick={() => setShowOptions(!showOptions)} className="options-button">
                        <FiMoreVertical />
                    </button>
                    {showOptions && (
                        <div className="user-profile-options-menu">
                            {isLoggedUser ? (
                            <>
                                <button onClick={() => handleNavigation(`/messages/${user.username}`)}><SiGooglemessages /> See chats</button>
                                <button onClick={() => handleNavigation(`/settings/${user.username}`)}><IoMdSettings /> Settings</button>
                            </>
                            ) : (
                                <button onClick={() => handleNavigation(`/messages/${userData.username}`)}><SiGooglemessages /> Send PM</button>
                            )}
                        </div>
                    )}
                </div>
            </div>
            <main className='forum-main'>
                <h1> User Posts</h1>
                {userPosts.map(post => <PostPreview key={post.id} post={post} />)}
                <div className="pagination-controls">
                        <button onClick={previousPage} disabled={page === 0}>Previous</button>
                        <span>Page {page + 1} of {totalPages}</span>
                        <button onClick={nextPage} disabled={page + 1 >= totalPages}>Next</button>
                </div>
            </main>
        </div>
    );
}

export default UserProfile;
