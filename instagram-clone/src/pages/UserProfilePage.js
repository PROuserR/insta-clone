import React, {useContext} from 'react'
import Profile from "../components/Profile";
import PostsGrid from "../components/PostsGrid";
import "../pages_style/UserProfilePage.css";

const UserProfilePage = () => {
  let path = window.location.pathname;
  let user_id = path.match(/(\d+)/)[0];
  return (
    <div className="user_profile_page">
      <div>
        <Profile myProfile={false} user_id={user_id}  />
      </div>
      <hr />
      <div>
        <PostsGrid myProfile={false} user_id={user_id} />
      </div>
    </div>
  );
};

export default UserProfilePage;