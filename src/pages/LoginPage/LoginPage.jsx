import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios'; // Import axios
import './LoginPage.css';
import {login} from '../../services/AuthService/AuthService'
import { useUser } from '../../contexts/UserContext';

function LoginPage() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const navigate = useNavigate();
    const { loginUser } = useUser();

    const handleLogin = async (e) => {
        e.preventDefault();

        try {
            const response = await login(username, password);
            loginUser({
                username: username,
                token: response.data.token,
                roles: response.data.roles
            }); 
            navigate('/main');
        } catch (error) {
            console.error("Login failed: ", error.response ? error.response.data : 'Login request failed');
            setErrorMessage(error.response.data|| 'Login request failed');
        }
    };

    const navigateToRegister = () => navigate('/register');

    return (
        <div className="login-page-container">
            <div className="login-container">
                <h2>Login</h2>
                <form onSubmit={handleLogin}>
                    <input type="text" placeholder="Username" className="input-field" value={username} onChange={(e) => setUsername(e.target.value)} />
                    <input type="password" placeholder="Password" className="input-field" value={password} onChange={(e) => setPassword(e.target.value)} />
                    {errorMessage && <div className="error-message">{errorMessage}</div>} {/* Display error message */}
                    <button type="submit" className="submit-button">Login</button>
                </form>
                <button onClick={navigateToRegister} className="submit-button">No account? Register</button>
            </div>
        </div>

    );
}

export default LoginPage;
