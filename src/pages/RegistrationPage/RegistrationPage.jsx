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
    setEmailError("");
    return true;
  };

  const validateUsername = (username) => {
    const pattern = /^[a-zA-Z0-9]{3,}$/;
    if (!pattern.test(username)) {
      setUsernameError("Username must be at least 3 characters long and contain only letters and numbers.");
      return false;
    }
    setUsernameError("");
    return true;
  };

  const validatePassword = (password) => {
    const errors = [];
    if (password.length < 8) {
      errors.push("at least 8 characters long");
    }
    if (!/[A-Z]/.test(password)) {
      errors.push("at least one uppercase letter (A-Z)");
    }
    if (!/[a-z]/.test(password)) {
      errors.push("at least one lowercase letter (a-z)");
    }
    if (!/\d/.test(password)) {
      errors.push("at least one digit (0-9)");
    }
    if (!/[@$!%*?&]/.test(password)) {
      errors.push("at least one special character (@$!%*?&)");
    }
    if (errors.length > 0) {
      setPasswordError(`Password must be ${errors.join(', ')}.`);
      return false;
    }
    setPasswordError(""); // Clear any existing error message
    return true;
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    let hasErrors = false;

    if (!username.trim()) {
      setUsernameError("Username cannot be empty.");
      hasErrors = true;
    } else {
      setUsernameError("");
    }

    if (!email.trim() || !validateEmail(email)) {
      hasErrors = true;
    }

    if (!password) {
      setPasswordError("Password cannot be empty.");
      hasErrors = true;
    } else if (!validatePassword(password)) {
      hasErrors = true;
    }

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
            onChange={(e) => {
              setUsername(e.target.value);
              validateUsername(e.target.value);
            }}
          />
          {usernameError && <div className="error-message">{usernameError}</div>}
          <input
            type="email"
            placeholder="Email"
            className="input-field"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              validateEmail(e.target.value);
            }}
          />
          {emailError && <div className="error-message">{emailError}</div>}
          <input
            type="password"
            placeholder="Password"
            className="input-field"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              validatePassword(e.target.value);
            }}
          />
          {passwordError && <div className="error-message">{passwordError}</div>}
          <button type="submit" className="submit-button">
            Register
          </button>
        </form>
        <button className="submit-button" onClick={() => navigate("/login")}>
            Already have an account? Login!
          </button>
        <div className="password-requirements">
          <h3>Password Requirements:</h3>
          <ul>
            <li>At least 8 characters long</li>
            <li>Contains at least one uppercase letter (A-Z)</li>
            <li>Contains at least one lowercase letter (a-z)</li>
            <li>Contains at least one digit (0-9)</li>
            <li>Contains at least one special character (@$!%*?&)</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default RegistrationPage;
