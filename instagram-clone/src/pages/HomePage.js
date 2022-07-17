import React, { useContext, useEffect, useState } from "react";
import Post from "../components/Post";
import { ReactComponent as MoonIcon } from "../assets/moon.svg";
import { ReactComponent as MoonFillIcon } from "../assets/moon-fill.svg";
import { ReactComponent as MessengerIcon } from "../assets/messenger.svg";
import { DarkModeContext } from "../DarkModeContext";
import { Link } from "react-router-dom";
import StatusContainer from "../components/StatusContainer";
import "../pages_style/HomePage.css";


const HomePage = () => {
  function getCookie(name) {
    var cookieValue = null;
    if (document.cookie && document.cookie !== '') {
      var cookies = document.cookie.split(';');
      for (var i = 0; i < cookies.length; i++) {
        var cookie = cookies[i].trim();
        // Does this cookie string begin with the name we want?
        if (cookie.substring(0, name.length + 1) === (name + '=')) {
          cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
          break;
        }
      }
    }
    return cookieValue;
  }
  var csrftoken = getCookie('csrftoken');
  const [darkTheme, setDarkTheme] = useContext(DarkModeContext);
  const [posts, setPosts] = useState([])
  const [noFeed, setNoFeed] = useState()
  const [moonIcon, setMoonIcon] = useState(<MoonIcon />);

  function toggleDarkTheme() {
    if (darkTheme) {
      document.body.style.background = "black";
      document.body.style.color = "white";
      document.body.style.borderColor = "black";
      let header = document.getElementsByTagName("nav")[0];
      header.style.background = "black";
      let footer = document.getElementById("footer");
      footer.style.background = "black";
      footer.style.color = "white";
      let insta_img = document.getElementsByClassName(
        "insta_img_for_mobile"
      )[0];
      insta_img.src =
        "https://www.pngfind.com/pngs/b/57-571471_instagram-logo-png-transparent-background.png";
      setMoonIcon(<MoonFillIcon />);
    } else {
      document.body.style.background = "white";
      document.body.style.color = "black";
      document.body.style.borderColor = "white";
      let header = document.getElementsByTagName("nav")[0];
      header.style.background = "white";
      let footer = document.getElementById("footer");
      footer.style.background = "white";
      footer.style.color = "black";
      let insta_img = document.getElementsByClassName(
        "insta_img_for_mobile"
      )[0];
      insta_img.src =
        "https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png";
      setMoonIcon(<MoonIcon />);
    }
  }

  let getPosts = async () => {
    try {
      let response = await fetch(`http://127.0.0.1:8000/api/news_feed/${localStorage.getItem('my_id')}`, {
        method: 'GET',
        headers: {
          'X-CSRFToken': csrftoken,
        }
      });
      let data = await response.json();

      if(data.length === 0)
        setNoFeed(<div className="no_feed">
          <h1>Empty feed!</h1>
          <h5>Try to be more social :)</h5>
        </div>)
      else
        setPosts(data)
    } catch (error) {
      console.log(error)
    }

  }

  useEffect(() => {
    toggleDarkTheme()
  }, [darkTheme]);

  useEffect(() => {
    getPosts();
  }, []);

  return (
    <div>
      <div>
        <div className="dark_mode_container">
          <div className="insta_img_for_mobile_container">
            <img
              className="insta_img_for_mobile"
              src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png"
              alt=" "
            />
          </div>

          <div
            className="homepage_header_icon"
            onClick={() => {
              setDarkTheme(!darkTheme);
            }}
          >
            {moonIcon}
          </div>
          <Link
            className="homepage_header_icon homepage_header_messenger_icon"
            to="/contacts"
          >
            <MessengerIcon />
          </Link>
        </div>
      </div >
      <StatusContainer />
      {noFeed}
      {posts.map((post, index) => (
        <Post post={post} key={index} />
      ))}
    </div>
  );
};

export default HomePage;
