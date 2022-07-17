import React, { useState, useEffect } from "react";
import { ReactComponent as SearchIcon } from "../assets/search.svg";
import { ReactComponent as HomeIcon } from "../assets/home.svg";
import { ReactComponent as AddIcon } from "../assets/plus.svg";
import { ReactComponent as HeartIcon } from "../assets/heart.svg";
import { ReactComponent as ProfileIcon } from "../assets/profile.svg";
import { ReactComponent as HomeFillIcon } from "../assets/home-fill.svg";
import { ReactComponent as AddFillIcon } from "../assets/plus-fill.svg";
import { ReactComponent as HeartFillIcon } from "../assets/heart-fill.svg";
import { ReactComponent as ProfileFillIcon } from "../assets/profile-fill.svg";
import { Link, useLocation } from "react-router-dom";
import "../components_style/Footer.css";

const Footer = () => {
  let location = useLocation();
  const [homeIcon, setHomeIcon] = useState(<HomeIcon />);
  const [addIcon, setAddIcon] = useState(<AddIcon />);
  const [heartIcon, setHeartIcon] = useState(<HeartIcon />);
  const [profileIcon, setProfileIcon] = useState(<ProfileIcon />);

  let reset_icons = () => {
    setHomeIcon(<HomeIcon />);
    setAddIcon(<AddIcon />);
    setHeartIcon(<HeartIcon />);
    setProfileIcon(<ProfileIcon />);
  };

  let adjust_icon = () => {
    switch (location.pathname) {
      case "/":
        setHomeIcon(<HomeFillIcon />);
        break;
      case "/create-new-post":
        setAddIcon(<AddFillIcon />);
        break;
      case "/activity":
        setHeartIcon(<HeartFillIcon />);
        break;
      case "/my_profile":
        setProfileIcon(<ProfileFillIcon />);
        break;
      default:
        break;
    }
  };

  useEffect(() => {
    reset_icons();
    adjust_icon();
  }, [location.pathname]);

  return (
    <nav id="footer">
      <div className="footer_icons">
        <Link className="footer_icon" to="/">
          {homeIcon}
        </Link>
        <Link className="footer_icon search_bar_icon" to="/search">
          {<SearchIcon />}
        </Link>
        <Link className="footer_icon" to="/create-new-post">
          {addIcon}
        </Link>
        <Link className="footer_icon" to="/activity">
          {heartIcon}
        </Link>
        <Link className="footer_icon profile_icon_border" to="/my_profile">
          {profileIcon}
        </Link>
      </div>
    </nav>
  );
};

export default Footer;
