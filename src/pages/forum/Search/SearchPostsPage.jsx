import React, { useState, useEffect } from "react";
import "../ForumMainPage.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Banner from "../../../components/forum/Banner";
import NavBar from "../../../components/forum/ForumNavBar";
import Footer from "../../../components/forum/ForumFooter";
import UserLink from "../../../components/forum/User/UserLink";
import { fetchCategories } from "../../../services/CategoryService";
import SearchPostsResults from "../../../components/forum/Search/SearchPostsResults";
import ForumSidebar from "../../../components/forum/ForumSidebar";

function SearchPostsPage() {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const loadInitialData = async () => {
      try {
        const fetchedCategories = await fetchCategories();
        setCategories(fetchedCategories);
      } catch (error) {
        console.error("Error initializing data", error);
        alert("Failed to fetch initial data");
      }
    };

    loadInitialData();
  }, []);

  const handleNavigation = (path) => {
    navigate(path);
  };

  return (
    <div className="forum-container">
      <Banner />
      <NavBar />
      <div className="forum-content">
        <ForumSidebar />
        <main className="forum-main">
          <SearchPostsResults />
        </main>
      </div>
      <Footer />
    </div>
  );
}

export default SearchPostsPage;
