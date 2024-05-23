import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import './ChatList.css'; 
import { useUser } from '../../../contexts/UserContext';
import { webSocketService } from '../../../services/WebSocketService'
import { NotificationContext } from '../../../contexts/NotificationContext';

function ChatList({ refreshKey }) {
    const [chats, setChats] = useState([]);
    const [loading, setLoading] = useState(true);
    const { user } = useUser();
    const { newMessageReceived, setNewMessageReceived } = useContext(NotificationContext);

    const fetchChats = async () => {
        if (!user || !user.username) {
            console.log("User or username is null, skipping fetch");
            return; // Exit the function if no user or no username
        }
        
        const token = localStorage.getItem('authToken');
        try {
            const response = await axios.get(`http://localhost:8080/messages/chats/${user.username}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            setChats(response.data);
            setLoading(false);
        } catch (error) {
            console.error('Failed to fetch chat list:', error);
            setLoading(false);
        }
    };

    useEffect(() => {
        const token = localStorage.getItem('authToken');
        if (user && token) {
            fetchChats();
            webSocketService.connect(token).then(() => {
                webSocketService.subscribeToChats('/topic/chats', (chatUpdate) => {
                    console.log('Chat update received:', chatUpdate);
                    setNewMessageReceived(true);
                    fetchChats();  // Refresh chat list on update
                });
            }).catch(error => console.log('WebSocket connection failed: ', error));
        }

        return () => {
            webSocketService.disconnect();
        };
    }, [user, refreshKey]);

    if (loading) {
        return <div>Loading chats...</div>;
    }

    return (
        <div className="chat-list">
            {chats.map((chat, index) => (
                <div key={index} className={`chat-item ${newMessageReceived && chat.username === user.username ? 'new-message' : ''}`}>
                    <Link to={`/messages/${chat.username}`} className="chat-link">
                        <div className="chat-name">{chat.username}</div>
                        <div className="chat-timestamp">{new Date(chat.lastMessageAt).toLocaleString()}</div>
                    </Link>
                </div>
            ))}
        </div>
    );
}

export default ChatList;
