import React, { useEffect, useState } from 'react'
import Post from '../components/Post';

const SavedPostsPage = () => {
  const [savedPosts, setSavedPosts] = useState([]);

  let getSavedPosts = async () => {
    let res = await fetch(`http://prouserr.pythonanywhere.com/api/get_saved_posts/`);
    let data = await res.json();
    setSavedPosts(data);
  }

  useEffect(() => {
    getSavedPosts()
  }, [])

  return (
    <div>
      {savedPosts.map((post, index) => (
        <Post post={post} key={index} />
      ))}
    </div>
  )
}

export default SavedPostsPage