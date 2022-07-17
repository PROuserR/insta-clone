import React, { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import "../components_style/PostsGrid.css";

const PostsGrid = ({ myPosts, user_id }) => {
  const [posts, setPosts] = useState();
  let navigate = useNavigate();

  let getPosts = async () => {
    if (myPosts) {
      let res = await fetch(`https://prouserr.pythonanywhere.com/api/list_user_posts/${localStorage.getItem('my_id')}`);
      let data = await res.json();
      setPosts(data)
    }
    else {
      let res = await fetch(`https://prouserr.pythonanywhere.com/api/list_user_posts/${user_id}`);
      let data = await res.json();
      setPosts(data)
    }

  }

  useEffect(() => {
    getPosts()
  }, [])

  try {
    return (
      <div className="posts_grid">
        {posts.map((post, index) => (
            <div key={index} onClick={() => {navigate(`/post/${post.id}`)}}>
              <img
                src={`https://prouserr.pythonanywhere.com/media/${post.photoes}`}
                className="grid"
              />
            </div>
        ))}
      </div>
    );
  }
  catch (err) {
  }
};

export default PostsGrid;
