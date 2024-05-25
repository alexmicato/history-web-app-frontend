import React from 'react';
import { useParams } from 'react-router-dom';
import Header from '../../../components/forum/Banner'; // Import your Header component
import NavBar from '../../../components/forum/ForumNavBar'; // Import your NavBar component
import Footer from '../../../components/forum/ForumFooter'; // Import your Footer component
import UserProfile from '../../../components/forum/User/UserProfile';
import "./UserProfilePage.css"

function UserProfilePage() {
    const { username } = useParams();

    return (
        <div className='user-profile-page-container'>
            <Header />
            <NavBar />
            <main style={{ padding: "20px" }}>
                <UserProfile username={username} />
            </main>
            <Footer />
        </div>
    );
}

export default UserProfilePage;
