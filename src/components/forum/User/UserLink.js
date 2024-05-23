import React from 'react';
import { Link } from 'react-router-dom';

function UserLink({ username }) {
    return <Link to={`/users/${username}`}>{username}</Link>;
}

export default UserLink;
