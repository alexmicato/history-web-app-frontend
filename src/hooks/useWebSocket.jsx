// Create a new file: useWebSocket.js
import { useState, useEffect } from 'react';
import { webSocketService } from '../services/WebSocketService';

export function useWebSocket(user) {
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (token && user) {
      webSocketService.connect(token)
        .then(() => {
          setIsConnected(true);
          console.log('WebSocket connected');
        })
        .catch(error => console.error('WebSocket connection failed:', error));
    }

    return () => {
      webSocketService.disconnect();
      setIsConnected(false);
    };
  }, [user]);

  return isConnected;
}