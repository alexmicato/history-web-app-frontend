import React from 'react';
import Header from '../../../components/forum/Banner'; 
import NavBar from '../../../components/forum/ForumNavBar'; 
import Footer from '../../../components/forum/ForumFooter'; 
import Post from '../../../components/forum/Posts/Post';
import { useParams } from 'react-router-dom'; 

function PostPage() {
    const { id } = useParams(); // This hooks function to get URL parameters

    return (
        <div>
            <Header />
            <NavBar />
            <main>
                <Post postId={id} /> {/* Passing postId to the Post component */}
            </main>
            <Footer />
        </div>
    );
}

export default PostPage;
