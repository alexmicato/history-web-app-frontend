// In App.js
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import MapPage from "./pages/MapPage/MapPage";
import LoginPage from "./pages/LoginPage/LoginPage";
import RegistrationPage from "./pages/RegistrationPage/RegistrationPage";
import MainPage from "./pages/MainPage/MainPage";
import "./styles/Global.css";
import ForumMainPage from "./pages/forum/ForumMainPage";
import CreatePost from "./pages/forum/Posts/CreatePost";
import PostPage from "./pages/forum/Posts/PostPage";
import UserProfilePage from "./pages/forum/User/UserProfilePage";
import MessagePage from "./pages/forum/Messages/MessagePage";
import AdminPage from "./pages/Admin/AdminPage";
import { UserProvider } from "./contexts/UserContext";
import { NotificationProvider } from "./contexts/NotificationContext";
import UserSettingsPage from "./pages/forum/User/UserSettingsPage";
import SearchPostsPage from "./pages/forum/Search/SearchPostsPage";
import ArticlesPage from "./pages/Articles/ArticlesPage";
import CreateArticlePage from "./pages/Articles/CreateArticlePage";
import ArticlePage from "./pages/Articles/ArticlePage";

function App() {
  return (
    <NotificationProvider>
      <UserProvider>
        <Router>
          <div className="App">
            <Routes>
              <Route path="/" element={<LoginPage />} /> {/* Add this line */}
              <Route path="/map" element={<MapPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegistrationPage />} />
              <Route path="/main" element={<MainPage />} />
              <Route path="/forum" element={<ForumMainPage />} />
              <Route path="/post/:id" element={<PostPage />} />
              <Route path="/create-post" element={<CreatePost />} />
              <Route path="/users/:username" element={<UserProfilePage />} />
              <Route path="/messages/:username" element={<MessagePage />} />
              <Route path="/admin" element={<AdminPage />} />
              <Route path="/settings/:username" element={<UserSettingsPage />} />
              <Route path="/search/posts" element={<SearchPostsPage />} />
              <Route path="/articles" element={<ArticlesPage />} />
              <Route path="/create-article" element={<CreateArticlePage />} />
              <Route path="/article/:articleId" element={<ArticlePage />} />
              {/* Add more routes as needed */}
            </Routes>
          </div>
        </Router>
      </UserProvider>
    </NotificationProvider>
  );
}

export default App;
