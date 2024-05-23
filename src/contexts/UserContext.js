import React, { createContext, useContext, useState, useEffect } from 'react';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
    const [user, setUser] = useState(null);

    useEffect(() => {
        const authToken = localStorage.getItem('authToken');
        const username = localStorage.getItem('username');
        let roles = [];  // Initialize roles as an empty array by default

        try {
            // Try to parse roles if they exist in localStorage
            const rolesData = localStorage.getItem('userRoles');
            if (rolesData) {
                roles = JSON.parse(rolesData);
            }
        } catch (e) {
            console.error("Failed to parse roles from localStorage:", e);
            // Optionally, handle this error by logging out the user or asking them to log in again
        }

        if (authToken && username) {
            setUser({ token: authToken, username: username, roles: roles });
        }
    }, []);

    const loginUser = (userData) => {
        setUser(userData);
        localStorage.setItem('authToken', userData.token);
        localStorage.setItem('username', userData.username);
        localStorage.setItem('userRoles', JSON.stringify(userData.roles || []));  // Safely stringify roles, ensuring it's an array
    };

    const logoutUser = () => {
        setUser(null);
        localStorage.removeItem('authToken');
        localStorage.removeItem('username');
        localStorage.removeItem('userRoles');
    };

    return (
        <UserContext.Provider value={{ user, loginUser, logoutUser }}>
            {children}
        </UserContext.Provider>
    );
};

export const useUser = () => useContext(UserContext);
