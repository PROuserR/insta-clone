import React, { useState, useEffect } from "react";
import { ReactComponent as SearchIcon } from "../assets/search.svg";
import { Link } from "react-router-dom"
import "../pages_style/SearchPage.css";

const SearchPage = () => {
  const [users, setUsers] = useState([]);
  const [usersCopy, setUsersCopy] = useState([]);
  const [discover, setDiscover] = useState([]);
  let filtered_users = [];

  let getUsers = async () => {
    let response = await fetch(`http://prouserr.pythonanywhere.com/api/list_users/${localStorage.getItem('my_id')}`);
    let data = await response.json();
    setUsers(data);
    setUsersCopy(data)
  };

  let getAllPosts = async () => {
    let res = await fetch(`http://prouserr.pythonanywhere.com/api/discover_posts/`);
    let data = await res.json();
    setDiscover(data)
  }

  let filterUsers = () => {
    let search_text_box_query = document.getElementById('search_text_box').value
    let search_page_users_container = document.getElementById('search_page_users_container')
    let discover_grid_container = document.getElementById('discover_grid_container')
    if (search_text_box_query === ''){
      setUsers(usersCopy)
      search_page_users_container.style.visibility = 'hidden';
      discover_grid_container.style.visibility = ' visible';
    }
    else {
      for (let index = 0; index < users.length; index++) {
        if (users[index]['username'].includes(search_text_box_query))
          filtered_users = filtered_users.concat(users[index])
      }
      setUsers(filtered_users)
      search_page_users_container.style.visibility = 'visible';
      discover_grid_container.style.visibility = ' hidden';
    }
  }

  useEffect(() => {
    getUsers();
    getAllPosts();
  }, []);

  return (
    <div className="search_page">
      <div className="search_bar search_bar_discover_page">
        <SearchIcon className="search_bar_icon" />
        <input
          className="search_bar_textbox"
          type="text"
          placeholder="Search"
          id="search_text_box"
          onChange={filterUsers}
        />
      </div>

      <div id="discover_grid_container">
        {discover.map((post, index) => (
          <Link to={`/post/${post.id}`} key={index}>
            <img className="discover_grid" src={`http://prouserr.pythonanywhere.com/media/${post.photoes}`} />
          </Link>
            
        ))}
      </div>

      <div id="search_page_users_container">
        <div className="comment_container" style={{ borderColor: "inherit" }}>
          {users.map((user, index) => (
            <Link to={`/user/${user.id}`} key={index} className="username_link" >
              <div
                className="comment"
                style={{ borderColor: "inherit" }}
                key={index}
              >
                <div className="comment_modal_profile_picture_lg" >
                  <img
                    src={`http://prouserr.pythonanywhere.com${user.image}`}
                    className="comment_modal_profile_picture_img"
                  />
                </div>
                <div className="comment_modal_username">
                  {user.username}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

    </div>
  );
};

export default SearchPage;
