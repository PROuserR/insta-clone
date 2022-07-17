import "./App.css";
import Header from "./components/Header";
import Footer from "./components/Footer";
import HomePage from "./pages/HomePage";
import UserProfilePage from "./pages/UserProfilePage";
import MyProfilePage from "./pages/MyProfilePage";
import ContactsPage from "./pages/ContactsPage";
import ChattingPage from "./pages/ChattingPage";
import DiscoverPage from "./pages/DiscoverPage";
import ActivityPage from "./pages/ActivityPage";
import CreateNewPostPage from "./pages/CreateNewPostPage";
import SearchPage from "./pages/SearchPage";
import RegisterPage from "./pages/RegisterPage";
import LoginPage from "./pages/LoginPage";
import EditProfilePage from "./pages/EditProfilePage";
import SavedPostsPage from "./pages/SavedPostsPage";
import PostPage from "./pages/PostPage";
import AddStoryPage from "./pages/AddStoryPage";
import { Navigate, Route, Routes } from "react-router-dom";
import { DarkModeContext } from "./DarkModeContext";
import { PostsContext } from "./PostsContext";
import { HeartTriggerContext } from "./HeartTriggerContext";
import { CommentsTriggerContext } from "./CommentsTriggerContext";
import { useState } from "react";

function App() {
  const [darkModeContext, setDarkModeContext] = useState(false);
  const [heartTriggerContext, setHeartTriggerContext] = useState(false)
  const [commentsTriggerContext, setCommentsTriggerContext] = useState(false);
  const [postsContext, setPostsContext] = useState([]);

  return (
    <div>
      <Header />
      <div id="app_body">
        <PostsContext.Provider value={[postsContext, setPostsContext]}>
          <DarkModeContext.Provider value={[darkModeContext, setDarkModeContext]}>
            <HeartTriggerContext.Provider value={[heartTriggerContext, setHeartTriggerContext]}>
              <CommentsTriggerContext.Provider value={[commentsTriggerContext, setCommentsTriggerContext]}>
                  <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/search" element={<SearchPage />} />
                    <Route path="/contacts" element={<ContactsPage />} />
                    <Route path="/create-new-post" element={<CreateNewPostPage />} />
                    <Route path="/discover" element={<DiscoverPage />} />
                    <Route path="/activity" element={<ActivityPage />} />
                    <Route path="/my_profile" element={<MyProfilePage />} />
                    <Route path="/user/:id" element={<UserProfilePage />} />
                    <Route path="/post/:post_id" element={<PostPage />} />
                    <Route path="/chat/:sender_id" element={<ChattingPage />} />
                    <Route path="/register" element={<RegisterPage />} />
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/edit_profile" element={<EditProfilePage />} />
                    <Route path="/saved_posts" element={<SavedPostsPage />} />
                    <Route path="/add_story" element={<AddStoryPage />} />
                  </Routes>
              </CommentsTriggerContext.Provider>
            </HeartTriggerContext.Provider>
          </DarkModeContext.Provider>
        </PostsContext.Provider>
      </div>
      <Footer />
    </div>
  );
}

export default App;