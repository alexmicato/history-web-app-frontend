import React, { useState, useEffect } from 'react';
import './MainPage.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
// import headerImage from '../path-to/header-image.jpg'; // Replace with the path to the header image
import { useUser } from '../../contexts/UserContext'
import ArticleList from '../../components/Article/ArticleList';
import { CgProfile } from "react-icons/cg";
import { GiGreekTemple } from "react-icons/gi";
import { CiLogout } from "react-icons/ci";
import { MdOutlineArticle } from "react-icons/md";
import { RiMapPinTimeLine } from "react-icons/ri";
import { RiAdminLine } from "react-icons/ri";

function MainPage() {

  const navigate = useNavigate();
  const { user, logoutUser } = useUser();
  const isAdmin = user && user.roles && user.roles.includes('ADMIN');
  const [todayEvent, setTodayEvent] = useState(null);
  const [loadingEvent, setLoadingEvent] = useState(true);
  const [recentArticles, setRecentArticles] = useState([]);
  const [loadingArticles, setLoadingArticles] = useState(true);

  useEffect(() => {
    const fetchTodayEvent = async () => {
      try {
        const userTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
        const today = new Date();
        const dateStr = today.toLocaleDateString('en-CA', { timeZone: userTimezone }); // 'en-CA' format gives YYYY-MM-DD
        const token = localStorage.getItem('authToken');
        const response = await axios.get(`http://localhost:8080/articles/eventOfTheDay`, {
            params: { date: dateStr },
            headers: { Authorization: `Bearer ${token}` }
        });
        setTodayEvent(response.data || null);
        console.log('Today\'s event:', todayEvent);
        setLoadingEvent(false);
      } catch (error) {
        console.error('Failed to fetch today\'s event:', error);
        setLoadingEvent(false);
      }
    };

    const fetchRecentArticles = async () => {
      try {
        const token = localStorage.getItem('authToken');
        const response = await axios.get('http://localhost:8080/articles/recent', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        const firstTwoArticles = response.data.slice(0, 2);
        setRecentArticles(firstTwoArticles);
        setLoadingArticles(false);
      } catch (error) {
        console.error('Failed to fetch recent articles:', error);
        setLoadingArticles(false);
      }
    };

    fetchTodayEvent();
    fetchRecentArticles();
  }, []);

  const handleLogout = () => {
    logoutUser(); // Clears user data from context and localStorage
    navigate('/login');
  };

  const handleNavigation = (path) => {
    navigate(path);
};

  return (
    <div className="main-page">
      <header className="site-header">
        <h1 className="site-title">History Explorer</h1>
      </header>
      <nav className="nav-bar">
        <ul className="nav-items">
          <li className="nav-item" onClick={() => handleNavigation('/map')}><RiMapPinTimeLine /> Timeline</li>
          <li className="nav-item" onClick={() => handleNavigation('/articles')}><MdOutlineArticle /> Articles</li>
          <li className="nav-item" onClick={() => handleNavigation('/forum')}><GiGreekTemple /> Forum</li>
          <li className='nav-item' onClick={() => navigate(`/users/${user.username}`)}><CgProfile /> Profile</li>
          {isAdmin && <li className="nav-item" onClick={() => handleNavigation('/admin')}><RiAdminLine /> Admin</li>}
          <li className="nav-item" onClick={handleLogout}><CiLogout /> Logout</li>
        </ul>
      </nav>
      <div className="header-image">
        {/* You can place an <img> tag here or use a background image */}
      </div>
      <div className="main-content">
        <div className="date-event-section">
          <h2>Today in History</h2>
          {loadingEvent ? (
            <p>Loading...</p>
          ) : todayEvent ? (
            <ArticleList articles={[todayEvent]} />
          ) : (
            <p>No events found for today.</p>
          )}
        </div>
        <div className="recent-articles-section">
          <h2>Recent Articles</h2>
          {loadingArticles ? (
            <p>Loading...</p>
          ) : recentArticles.length > 0 ? (
            <ArticleList articles={recentArticles} />
          ) : (
            <p>No recent articles available.</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default MainPage;
