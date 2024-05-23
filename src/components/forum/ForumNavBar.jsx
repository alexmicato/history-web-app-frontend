import React, {useContext, useState} from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../../contexts/UserContext';
import { NotificationContext } from '../../contexts/NotificationContext';


function NavBar() {
    const navigate = useNavigate();
    const { user } = useUser();
    const { newMessageReceived, setNewMessageReceived } = useContext(NotificationContext);
    const [searchQuery, setSearchQuery] = useState('');

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

    return (
        <nav className="forum-navbar">
            <button onClick={() => handleNavigation('/main')}>Home</button>
            <button onClick={() => handleNavigation('/forum')}>Forum</button>
            <input 
                type="text" 
                placeholder="Search..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button onClick={handleSearch}>Search</button>
            {user && user.username ? (
                <button onClick={() => navigate(`/users/${user.username}`)}>Profile</button> // Profile button navigates directly
            ) : (
                <button onClick={() => handleNavigation('/login')}>Login</button> // Optionally add a login button if not logged in
            )}
            <button onClick={() => handleNavigation(`/messages/${user.username}`)}>
                Messages {newMessageReceived && " (You have messages)"}
            </button>
        </nav>
    );
}

export default NavBar;
