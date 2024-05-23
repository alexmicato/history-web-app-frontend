import { useParams } from 'react-router-dom';
import React, { useState, useCallback} from 'react';
import Footer from '../../../components/forum/ForumFooter';
import NavBar from '../../../components/forum/ForumNavBar';
import Header from '../../../components/forum/Banner';
import PrivateMessage from '../../../components/forum/Messages/PrivateMessage';
import ChatList from '../../../components/forum/Messages/ChatList';
import {useUser} from '../../../contexts/UserContext'



function MessagePage() {
    const { username } = useParams(); // Recipient username
    const { user } = useUser(); // Current logged in user

    const [refreshKey, setRefreshKey] = useState(0);

    const refreshChats = useCallback(() => {
        console.log("Refreshing chats...");
        setRefreshKey(oldKey => oldKey + 1);  // Increment key to trigger re-render
    }, []);

    return (
        <div>
            <Header />
            <NavBar />
            <div style={{ display: 'flex', padding: "20px" }}>
                <div style={{ width: '30%', borderRight: '1px solid #ccc' }}>
                    <ChatList refreshKey={refreshKey} />
                </div>
                <div style={{ width: '70%' }}>
                    {/* Check if the username in URL is the same as the logged-in user's username */}
                    {/* Conditional rendering to handle null user */}
                    {user && username === user?.username ? (
                        <div className="choose-someone-message">
                            Choose someone from the list to start a conversation.
                        </div>
                    ) : (
                        <PrivateMessage recipientUsername={username} refreshChats={refreshChats} />
                    )}
                </div>
            </div>
            <Footer />
        </div>
    );
}

export default MessagePage;