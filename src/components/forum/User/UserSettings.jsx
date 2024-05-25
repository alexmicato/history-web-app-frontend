import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import predefinedProfileImages from "../../../utils/images/PredefinedProfileImage";
import './UserSettings.css';

function UserSettings({ username }) {
  const [newUsername, setNewUsername] = useState(username);
  const [profilePic, setProfilePic] = useState(null);
  const [selectedPredefinedPic, setSelectedPredefinedPic] = useState('');
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [usernameError, setUsernameError] = useState("");
  const navigate = useNavigate();

  const handleNavigation = (path) => {
    navigate(path);
  };

  const handleUsernameChange = (e) => {
    setNewUsername(e.target.value);
  };

  const handleProfilePicChange = (e) => {
    setProfilePic(e.target.files[0]);
  };

  const handleOldPasswordChange = (e) => {
    setOldPassword(e.target.value);
  };

  const handleNewPasswordChange = (e) => {
    //if (!validatePassword(e.target.value)) return;
    setNewPassword(e.target.value);
  };

  const validatePassword = (password) => {
    const pattern =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!pattern.test(password)) {
      setPasswordError("Password does not meet the security requirements.");
      return false;
    }
    setPasswordError("");
    return true;
  };

  const handleUsernameUpdate = async (e) => {
    e.preventDefault();
    if (!newUsername) return; // Ensure there is a new username to update

    // Define the data object for updating the username
    const updateData = {
      currentUsername: username, // This is the existing username from props or state
      newUsername: newUsername, // This is the new username to be set
    };
    console.log("Updating from:", username, "to:", newUsername);

    // Retrieve the authToken from localStorage
    const authToken = localStorage.getItem("authToken");

    try {
      const response = await axios.put(
        "http://localhost:8080/user/update/profile",
        updateData,
        {
          headers: {
            "Content-Type": "application/json", // Set Content-Type to application/json
            Authorization: `Bearer ${authToken}`, // Include the authToken in the Authorization header
          },
        }
      );
      console.log("Update successful:", response.data); // Log or use the response data
      alert(
        "Username updated successfully! Please log in again to see the changes."
      );
      handleNavigation("/login");
    } catch (error) {
      if (
        error.response &&
        typeof error.response.data === "string" &&
        error.response.data.includes("Username")
      ) {
        setUsernameError(error.response.data);
      } else if (error.response) {
        // If the data is not a string, you may want to handle it differently
        alert(
          `Failed to update username: ${
            error.response.data?.message || "Unknown error"
          }`
        );
      } else {
        alert(
          "Failed to update username: Network error or server is unreachable."
        );
      }
    }
  };

  const handleProfilePicUpdate = async (e) => {
    e.preventDefault();

    if (!selectedPredefinedPic) {
        return;
    }

    const updateData = {
        username: username,
        profilePicUrl: selectedPredefinedPic // Use the URL of the predefined image
    };

    const authToken = localStorage.getItem('authToken');

    try {
        await axios.put('http://localhost:8080/user/update/picture', updateData, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${authToken}` // Include the authToken in the Authorization header
            }
        });
        alert('Profile picture updated successfully!');
        setSelectedPredefinedPic('');
    } catch (error) {
        alert('Failed to update profile picture: ' + (error.response?.data?.message || 'Network error'));
    }
};


  const handlePasswordUpdate = async (e) => {
    e.preventDefault();
    if (!newPassword || !oldPassword) return;

    const updateData = {
      username: username,
      oldPassword: oldPassword,
      newPassword: newPassword,
    };

    // Retrieve the authToken from localStorage
    const authToken = localStorage.getItem("authToken");

    try {
      const response = await axios.put(
        "http://localhost:8080/user/update/password",
        updateData,
        {
          headers: {
            "Content-Type": "application/json", // Set Content-Type to application/json
            Authorization: `Bearer ${authToken}`, // Include the authToken in the Authorization header
          },
        }
      );
      console.log("Update successful:", response.data); // Log or use the response data
      alert(
        "Password updated successfully! Please log in again to see the changes."
      );
      handleNavigation("/login");
    } catch (error) {
      if (
        error.response &&
        typeof error.response.data === "string" &&
        error.response.data.includes("Username")
      ) {
        setPasswordError(error.response.data);
      } else if (error.response) {
        // If the data is not a string, you may want to handle it differently
        alert(
          `Failed to update password: ${
            error.response.data?.message || "Unknown error"
          }`
        );
      } else {
        alert(
          "Failed to update password: Network error or server is unreachable."
        );
      }
    }
  };

  return (
    <div className="settings-container">
      <div className="settings-section">
        <h2>Update Your Profile</h2>
        <form onSubmit={handleUsernameUpdate} className="settings-form-group">
          <label className="settings-label">Username:</label>
          <input className="settings-input" type="text" value={newUsername} onChange={handleUsernameChange} />
          {usernameError && <p className="error">{usernameError}</p>}
          <button className="settings-submit-button" type="submit">Save Username</button>
        </form>
        <br />
        <form onSubmit={handleProfilePicUpdate} className="settings-form-group">
          <label className="settings-label">Profile Picture:</label>
          <input className="settings-input" type="file" onChange={handleProfilePicChange} />
          <div className="predefined-pics-container">
            {predefinedProfileImages.map((img, index) => (
              <img key={index} src={img.url} alt={`Predefined ${index}`}
                className={`predefined-pic ${selectedPredefinedPic === img.url ? 'selected' : ''}`}
                onClick={() => setSelectedPredefinedPic(img.url)}
              />
            ))}
          </div>
          <button className="settings-submit-button" type="submit">Save Profile Picture</button>
        </form>
      </div>
      <div className="settings-section">
        <h2>Change Password</h2>
        <form onSubmit={handlePasswordUpdate} className="settings-form-group">
          <label className="settings-label">Old Password:</label>
          <input className="settings-input" type="password" value={oldPassword} onChange={handleOldPasswordChange} />
          <br />
          <label className="settings-label">New Password:</label>
          <input className="settings-input" type="password" value={newPassword} onChange={handleNewPasswordChange} />
          <br />
          {passwordError && <p className="error">{passwordError}</p>}
          <button className="settings-submit-button" type="submit">Save New Password</button>
        </form>
      </div>
    </div>
  );
}

export default UserSettings;
