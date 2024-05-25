import React, {useContext, useState} from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../../contexts/UserContext';
import { NotificationContext } from '../../contexts/NotificationContext';
import { FaSearch, FaHome } from "react-icons/fa";
import { FiMessageSquare } from "react-icons/fi";
import './ForumNavBar.css';


function NavBar() {
    const navigate = useNavigate();
    const { user } = useUser();
    const { newMessageReceived, setNewMessageReceived } = useContext(NotificationContext);
    const [searchQuery, setSearchQuery] = useState('');
    const [showSearch, setShowSearch] = useState(false);

    const handleNavigation = (path) => {
        if (path.startsWith('/messages')) {
            setNewMessageReceived(false); 
        }
        navigate(path);
    };

    const handleSearch = () => {
        if (!searchQuery.trim()) {
            navigate('/forum');
        } else {
            navigate(`/search/posts?query=${encodeURIComponent(searchQuery)}`);
        }
    };

    const toggleSearch = () => {
        setShowSearch(!showSearch);
    };

    return (
        <nav className="forum-navbar">
            <div className="forum-nav-buttons">
                <button onClick={() => handleNavigation('/main')} title='Home'><FaHome /></button>
                <button onClick={() => handleNavigation('/forum')}>Forum</button>
                {user && user.username ? (
                    <button onClick={() => navigate(`/users/${user.username}`)}>Profile</button> // Profile button navigates directly
                ) : (
                    <button onClick={() => handleNavigation('/login')}>Login</button> // Optionally add a login button if not logged in
                )}
                <button onClick={() => handleNavigation(`/messages/${user.username}`)}>
                    Messages {newMessageReceived && " (You have new messages)"}
                </button>
            </div>
            <button onClick={toggleSearch} className="forum-search-icon">
                <FaSearch />
            </button>
            {showSearch && (
                <div className="search-popup">
                    <input 
                        type="text" 
                        placeholder="Search..." 
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    <button onClick={handleSearch}>Search</button>
                </div>
            )}
        </nav>
    );
}

export default NavBar;
