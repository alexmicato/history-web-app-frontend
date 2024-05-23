// RegistrationPage.jsx

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./RegistrationPage.css";
import { register } from '../../services/AuthService/AuthService';

function RegistrationPage() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [usernameError, setUsernameError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const navigate = useNavigate();

  const validateEmail = (email) => {
    const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!pattern.test(email)) {
      setEmailError("Please enter a valid email address.");
      return false;
    }
    setEmailError(""); // Clear any existing error message
    return true;
  };

  const validatePassword = (password) => {
    const pattern =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!pattern.test(password)) {
      setPasswordError("Password does not meet the security requirements.");
      return false;
    }
    setPasswordError(""); // Clear any existing error message
    return true;
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    let hasErrors = false;

    setUsernameError(username.trim() ? "" : "Username cannot be empty.");
    setEmailError(!email.trim() ? "Email cannot be empty." : (!validateEmail(email) ? "Please enter a valid email address." : ""));
    setPasswordError(!password ? "Password cannot be empty." : (!validatePassword(password) ? "Password does not meet the security requirements." : ""));

    hasErrors = !username.trim() || !email.trim() || !validateEmail(email) || !password || !validatePassword(password);

    if (hasErrors) {
      return;
    }

    try {
      const response = await register(username, email, password);
      console.log(response.data);
      alert("Registration successful");
      navigate("/login");
    } catch (error) {
      console.log("Error response:", error.response);
      let errorMessage = error.response.data;

      console.log(errorMessage); 

      if (errorMessage.includes("Username")) {
        setUsernameError(errorMessage);
      } else if (errorMessage.includes("Email")) {
        setEmailError(errorMessage);
      } else {
        alert("An error occurred during registration.");
      }
    }
  };

  return (
    <div className="login-page-container">
      <div className="registration-container">
        <h2>Register</h2>
        <form onSubmit={handleRegister}>
          <input
            type="text"
            placeholder="Username"
            className="input-field"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          {usernameError && <div className="error-message">{usernameError}</div>}
          <input
            type="email"
            placeholder="Email"
            className="input-field"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          {emailError && <div className="error-message">{emailError}</div>}
          <input
            type="password"
            placeholder="Password"
            className="input-field"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {passwordError && <div className="error-message">{passwordError}</div>}
          <button type="submit" className="submit-button">
            Register
          </button>
        </form>
      </div>
    </div>
  );
}

export default RegistrationPage;
