import { useParams } from 'react-router-dom';
import React, { useState, useCallback, useEffect } from 'react';
import Footer from '../../../components/forum/ForumFooter';
import NavBar from '../../../components/forum/ForumNavBar';
import Header from '../../../components/forum/Banner';
import PrivateMessage from '../../../components/forum/Messages/PrivateMessage';
import ChatList from '../../../components/forum/Messages/ChatList';
import {useUser} from '../../../contexts/UserContext'
import useSwipeToggle from '../../../hooks/useSwipeToggle';
import "./MessagePage.css";



function MessagePage() {
    const { username } = useParams(); // Recipient username
    const { user } = useUser(); // Current logged in user
    const [isChatVisible, setChatVisibility] = useSwipeToggle(false);
    const [refreshKey, setRefreshKey] = useState(0);


    const refreshChats = useCallback(() => {
        console.log("Refreshing chats...");
        setRefreshKey(oldKey => oldKey + 1);  // Increment key to trigger re-render
    }, []);

    return (
        <div className="message-page-container">
            <Header />
            <NavBar />
            <div className="content-container"> {/* Adjust the div class */}
                <div className={`chat-list-container ${isChatVisible ? 'visible' : ''}`}>
                    <ChatList refreshKey={refreshKey} />
                </div>
                <div className="message-container">
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