import React from 'react';
import "./ForumFooter.css"
import { FaGithub } from "react-icons/fa";

function Footer() {
    const githubLink = "https://github.com/alexmicato/history-web-app-frontend";  // Replace this with your actual GitHub repository URL

    return (
        <footer className="forum-footer">
            Contact | About | <a href={githubLink} target="_blank" rel="noopener noreferrer"><FaGithub /></a> | Social Media
        </footer>
    );
}

export default Footer;
