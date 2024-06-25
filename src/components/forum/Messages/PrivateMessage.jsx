import React, { useState, useEffect, useRef, useCallback, useContext } from 'react';
import axios from 'axios';
import { useUser } from '../../../contexts/UserContext';
import './PrivateMessage.css';
import { webSocketService } from '../../../services/WebSocketService';  // Import the WebSocket service
import { NotificationContext } from '../../../contexts/NotificationContext';
import { BiSolidConversation } from "react-icons/bi";
import { useWebSocket } from '../../../hooks/useWebSocket';

function PrivateMessage({ recipientUsername, refreshChats }) {
    const { user } = useUser();
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const messagesEndRef = useRef(null); // Ref for automatic scrolling
    //const { setNewMessageReceived } = useContext(NotificationContext);

    const scrollToBottom = () => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    };

    useEffect(() => {
        const token = localStorage.getItem('authToken');
        if (!token || !user) {
            console.log('No token available or user not logged in');
            return;
        }
    
        webSocketService.connect(token, '/user/queue/messages', (newMessage) => {
            setMessages(prevMessages => [...prevMessages, newMessage]);
            if (newMessage.receiver === user.username) {
                //setNewMessageReceived(true);
            }
            refreshChats();
            
        }).catch(error => console.error('WebSocket connection failed: ', error));
    
        return () => webSocketService.disconnect();
    }, [user, refreshChats]);

    const sendMessage = () => {
        if (!newMessage.trim()) return;

        const messageData = {
            sender: user.username,
            receiver: recipientUsername,
            content: newMessage
        };

        webSocketService.sendMessage("/app/messages/send", messageData);
        setNewMessage('');
        setMessages([...messages, messageData]); // Optimistically update UI
        refreshChats();
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const fetchMessages = useCallback(async () => {
        if (!user) {
            console.log("User data not available");
            return;
        }

        const token = localStorage.getItem('authToken');
        const senderUsername = user.username;
        const receiverUsername = recipientUsername;

        try {
            const response = await axios.get(`http://localhost:8080/messages/conversation`, {
                headers: { 'Authorization': `Bearer ${token}` },
                params: { senderUsername, receiverUsername } 
            });
            setMessages(response.data);
        } catch (error) {
            console.error('Failed to fetch messages:', error);
        }
    }, [user, recipientUsername]);

    useEffect(() => {
        if (user) {
            fetchMessages();
        }
    }, [user, recipientUsername, fetchMessages]);

    return (
        <div className="private-message-container">
            <h1> Chat with {recipientUsername}</h1>
            <div className="messages">
                {messages.map((msg, index) => (
                    <div key={index} className={`message ${msg.sender === user.username ? 'message-sent' : 'message-received'}`}>
                        <p>{msg.content}</p>
                    </div>
                ))}
                <div ref={messages.length ? messagesEndRef : null} />
            </div>
            <input
                type="text"
                className="message-input-field"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Type a message..."
            />
            <button className="send-message-button" onClick={sendMessage}>Send</button>
        </div>
    );
}

export default PrivateMessage;
