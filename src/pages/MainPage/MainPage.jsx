import React from 'react';
import './MainPage.css';
import { useNavigate } from 'react-router-dom';
// import headerImage from '../path-to/header-image.jpg'; // Replace with the path to the header image
import { useUser } from '../../contexts/UserContext'

function MainPage() {

  const navigate = useNavigate();
  const { user, logoutUser } = useUser();
  const isAdmin = user && user.roles && user.roles.includes('ADMIN');

  const handleLogout = () => {
    logoutUser(); // Clears user data from context and localStorage
    navigate('/login');
  };

  const handleNavigation = (path) => {
    navigate(path);
};

  return (
    <div className="main-page">
      <div className="header-image">
        {/* You can place an <img> tag here or use a background image */}
      </div>
      <nav className="nav-bar">
        <span className="nav-brand">History Explorer</span>
        <ul className="nav-items">
          <li className="nav-item" onClick={() => handleNavigation('/map')} >Timeline</li>
          <li className="nav-item" onClick={() => handleNavigation('/articles')} >Articles</li>
          <li className="nav-item">Quizzes</li>
          <li className="nav-item" onClick={() => handleNavigation('/forum')} >Forum</li>
          {isAdmin && <li className="nav-item" onClick={() => handleNavigation('/admin')}>Admin</li>}
          <li className="nav-item" onClick={handleLogout}>Logout</li>
        </ul>
      </nav>
      <div className="user-profile">
      <button onClick={() => navigate(`/users/${user.username}`)}>Profile</button>
      </div>
      <div className="main-content">
        <div className="date-event-section">
          <h2>Today in History</h2>
          <div className="event-item">
            <h3>Event Name</h3>
            <img src="path_to_event_image.jpg" alt="Event" />
            <p>Click <a href="/link-to-full-article">here</a> for more details.</p>
          </div>
        </div>
      <div className="recent-articles-section">
        <h2>Recent Articles</h2>
        <ul>
          <li className="article-item">
            <h3>Article Title</h3>
            <img src="path_to_article_image.jpg" alt="Article" />
            <p>Click <a href="/link-to-article">here</a> to read.</p>
          </li>
          {/* Additional article items */}
        </ul>
    </div>
      </div>
    </div>
  );
}

export default MainPage;
