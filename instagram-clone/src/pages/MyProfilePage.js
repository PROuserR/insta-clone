import React from 'react';
import Profile from "../components/Profile";
import PostsGrid from "../components/PostsGrid";

const MyProfile = () => {
    return (
        <div className="user_profile_page">
            <div>
                <Profile myProfile={true} />
            </div>
            <hr />
            <div>
                <PostsGrid myPosts={true} />
            </div>
        </div>
    )
}

export default MyProfile