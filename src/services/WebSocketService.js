import SockJS from 'sockjs-client';
import { Stomp } from '@stomp/stompjs';

class WebSocketService {
    constructor() {
        this.stompClient = null;
    }

    connect = (token, destination = null, onMessageReceived = null) => {
        return new Promise((resolve, reject) => {
            if (this.stompClient && this.stompClient.connected) {
                if (destination && onMessageReceived) {
                    // Subscribe to the specified destination if not already connected
                    this.subscribe(destination, onMessageReceived);
                }
                resolve();
                return;
            }

            const socketUrl = `http://localhost:8080/ws`;
            this.stompClient = Stomp.over(() => new SockJS(socketUrl));

            this.stompClient.connect(
                {'Authorization': `Bearer ${token}`},
                () => {
                    console.log('WebSocket Connected');
                    if (destination && onMessageReceived) {
                        // Subscribe to the specified destination once connected
                        this.subscribe(destination, onMessageReceived);
                    }
                    resolve();
                },
                (error) => {
                    console.error('Could not connect to WebSocket:', error);
                    reject(error);
                }
            );
        });
    }

    subscribe = (destination, callback) => {
        if (this.stompClient && this.stompClient.connected) {
            this.stompClient.subscribe(destination, (message) => {
                console.log('Message received: ', message);
                callback(JSON.parse(message.body));
            });
        } else {
            console.log('WebSocket not connected, subscription failed');
        }
    }

    subscribeToChats = (destination, callback) => {
        if (!this.stompClient || !this.stompClient.connected) {
            throw new Error("WebSocket is not connected.");
        }
        this.stompClient.subscribe(destination, (message) => {
            console.log('Chat update received: ', message);
            callback(JSON.parse(message.body));
        });
    }

    sendMessage = (destination, message) => {
        if (this.stompClient && this.stompClient.connected) {
            this.stompClient.send(destination, {}, JSON.stringify(message));
        } else {
            console.error('WebSocket connection is not established.');
        }
    }

    disconnect = () => {
        if (this.stompClient) {
            this.stompClient.disconnect(() => {
                console.log('WebSocket Disconnected');
            });
            this.stompClient = null;
        }
    }

}

export const webSocketService = new WebSocketService();

