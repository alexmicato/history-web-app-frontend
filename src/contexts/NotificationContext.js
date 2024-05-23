import React, { createContext, useState, useContext } from 'react';

export const NotificationContext = createContext(null);

export const NotificationProvider = ({ children }) => {
    const [newMessageReceived, setNewMessageReceived] = useState(false);

    return (
        <NotificationContext.Provider value={{ newMessageReceived, setNewMessageReceived }}>
            {children}
        </NotificationContext.Provider>
    );
};
