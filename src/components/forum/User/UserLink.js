import React from 'react';
import { Link } from 'react-router-dom';
import './UserLink.css';

function UserLink({ username }) {
    return <Link to={`/users/${username}`} className="user-link" >{username}</Link>;
}

export default UserLink;
