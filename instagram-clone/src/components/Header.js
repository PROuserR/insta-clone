import React, { useState, useEffect } from "react";
import { ReactComponent as SearchIcon } from "../assets/search.svg";
import { ReactComponent as HomeIcon } from "../assets/home.svg";
import { ReactComponent as MessengerIcon } from "../assets/messenger.svg";
import { ReactComponent as AddIcon } from "../assets/plus.svg";
import { ReactComponent as CompassIcon } from "../assets/compass.svg";
import { ReactComponent as HeartIcon } from "../assets/heart.svg";
import { ReactComponent as ProfileIcon } from "../assets/profile.svg";
import { ReactComponent as HomeFillIcon } from "../assets/home-fill.svg";
import { ReactComponent as MessengerFillIcon } from "../assets/messenger-fill.svg";
import { ReactComponent as AddFillIcon } from "../assets/plus-fill.svg";
import { ReactComponent as CompassFillIcon } from "../assets/compass-fill.svg";
import { ReactComponent as HeartFillIcon } from "../assets/heart-fill.svg";
import { ReactComponent as ProfileFillIcon } from "../assets/profile-fill.svg";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Toast, ToastContainer } from "react-bootstrap";
import "../components_style/Header.css";

const Header = () => {
  let location = useLocation();
  const [homeIcon, setHomeIcon] = useState(<HomeIcon />);
  const [messengerIcon, setMessengerIcon] = useState(<MessengerIcon />);
  const [addIcon, setAddIcon] = useState(<AddIcon />);
  const [compassIcon, setCompassIcon] = useState(<CompassIcon />);
  const [heartIcon, setHeartIcon] = useState(<HeartIcon />);
  const [profileIcon, setProfileIcon] = useState(<ProfileIcon />);
  const [users, setUsers] = useState([]);
  const [usersCopy, setUsersCopy] = useState([]);
  const navigate = useNavigate()
  let filtered_users = [];


  let reset_icons = () => {
    setHomeIcon(<HomeIcon />)
    setMessengerIcon(<MessengerIcon />)
    setAddIcon(<AddIcon />)
    setCompassIcon(<CompassIcon />)
    setHeartIcon(<HeartIcon />)
    setProfileIcon(<ProfileIcon />)
  }

  let adjust_icon = () => {
    switch (location.pathname) {
      case "/":
        setHomeIcon(<HomeFillIcon />)
        break;
      case "/contacts":
        setMessengerIcon(<MessengerFillIcon />)
        break;
      case "/create-new-post":
        setAddIcon(<AddFillIcon />)
        break;
      case "/discover":
        setCompassIcon(<CompassFillIcon />)
        break;
      case "/activity":
        setHeartIcon(<HeartFillIcon />)
        break;
      case "/user":
        setProfileIcon(<ProfileFillIcon />)
        break;
      default:
        break;
    }
  }

  let getUsers = async () => {
    try {
      let response = await fetch(`http://prouserr.pythonanywhere.com/api/list_users/${localStorage.getItem('my_id')}`);
      let data = await response.json();
      setUsers(data);
      setUsersCopy(data)
    } catch (error) {
      if(!window.location.href.includes('login') && !window.location.href.includes('register'))
        navigate('/login')
    }

  };

  let filterUsers = () => {
    let search_text_box_query = document.getElementById('search_bar_textbox_header').value
    let header_search_results = document.getElementById('header_search_results')
    let none_found_text = document.getElementById('none_found_text')
    none_found_text.style.display = 'none';
    if (search_text_box_query === '') {
      setUsers(usersCopy)
      header_search_results.style.visibility = 'hidden';
    }
    else {
      for (let index = 0; index < users.length; index++) {
        if (users[index]['username'].includes(search_text_box_query))
          filtered_users = filtered_users.concat(users[index])
        else
          none_found_text.style.display = 'inherit';
      }
      setUsers(filtered_users)
      header_search_results.style.visibility = 'visible';
    }
  }

  useEffect(() => {
    getUsers();
    reset_icons();
    adjust_icon();
  }, [location.pathname])


  return (
    <nav className="header">
      <div className="insta_img_container">
        <Link to="/">
          <img
            className="insta_img_for_desktop"
            src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png"
            alt=" "
          />
        </Link>
      </div>

      <div className="search_bar">
        <SearchIcon className="search_bar_icon" />
        <input
          className="search_bar_textbox"
          type="text"
          id="search_bar_textbox_header"
          placeholder="Search"
          onChange={filterUsers}
        />
      </div>

      <div className="header_icons">
        <Link className="header_icon" to="/">{homeIcon}</Link>
        <Link className="header_icon" to="/contacts">{messengerIcon}</Link>
        <Link className="header_icon" to="/create-new-post">{addIcon}</Link>
        <Link className="header_icon" to="/search">{compassIcon}</Link>
        <Link className="header_icon" to="/activity">{heartIcon}</Link>
        <Link className="header_icon profile_icon_border" to="/my_profile">{profileIcon}</Link>
      </div>

      <ToastContainer id="header_search_results">
        <Toast>
          <Toast.Body>
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
            <div id="none_found_text">No results found.</div>
          </Toast.Body>
        </Toast>
      </ToastContainer>
    </nav>
  );
};

export default Header;