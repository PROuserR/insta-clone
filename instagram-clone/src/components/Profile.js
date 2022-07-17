import React, { useEffect, useState, useContext } from "react";
import { ReactComponent as PersonCheckIcon } from "../assets/person_check.svg";
import { useNavigate } from "react-router-dom";
import "../components_style/Profile.css";

const Profile = ({ myProfile, user_id }) => {
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
  const [buttons, setButtons] = useState();
  const [profile, setProfile] = useState();
  const [deleteStoryButton, setDeleteStoryButton] = useState();
  const navigate = useNavigate();
  useEffect(() => {
    getProfile();
    my_story_existed();
  }, []);

  let getProfile = async () => {
    if(myProfile)
    {
      let res2 = await fetch(`https://prouserr.pythonanywhere.com/api/get_profile/${localStorage.getItem('my_id')}`);
      let data2 = await res2.json();
      setProfile(data2);
      setButtons(<button className="profile_button w-100" onClick={editProfile}>Edit Profile</button>);
    }
    else{
      if(parseInt(user_id) === parseInt(localStorage.getItem('my_id'))){
        let res2 = await fetch(`https://prouserr.pythonanywhere.com/api/get_profile/${localStorage.getItem('my_id')}`);
        let data2 = await res2.json();
        setProfile(data2);
        setButtons(<button className="profile_button w-100" onClick={editProfile}>Edit Profile</button>);  
      }
      else{
        let res = await fetch(`https://prouserr.pythonanywhere.com/api/get_profile/${user_id}`);
        let data = await res.json();
        setProfile(data);
        setButtons(<><button className="profile_button w-100">Message</button><button className="profile_button person_check" onClick={followUser}><PersonCheckIcon /></button></>);  
      }
    }
  };

  let logout = async () => {
    fetch(`https://prouserr.pythonanywhere.com/api/logout_user/`, {
      method: 'GET',
      headers: {
        'X-CSRFToken': csrftoken,
      }
    })
    window.location.replace('/login');
  }

  let editProfile = () => {
    navigate("/edit_profile")
  }

  let followUser = async () => {
    await fetch(`https://prouserr.pythonanywhere.com/api/follow_user/${localStorage.getItem('my_id')}/${user_id}`, {
        method:'POST', 
        headers:{
            'Content-type':'application/json',
            'X-CSRFToken':csrftoken,
        }
    })
  }

  let delete_story = async () => {
    fetch(`https://prouserr.pythonanywhere.com/api/delete_story/${localStorage.getItem('my_id')}`, {
      method: 'DELETE',
      headers: {
        'X-CSRFToken': csrftoken,
      }
    })
    window.location.replace('/')
  }

  let my_story_existed = async () => {
    let res = await fetch(`https://prouserr.pythonanywhere.com/api/get_my_story/${localStorage.getItem('my_id')}`);
    let data = await res.json();
    if(data.length != 0)
      setDeleteStoryButton(<li><div className="dropdown-item" onClick={delete_story}>Delete Story</div></li>)
  }

  try {
    return (
      <div className="profile">
        <div className="dropdown username_dropdown">
          <p className="user_profile_username dropdown-toggle" type="button" id="dropdownMenuButton1" data-bs-toggle="dropdown" aria-expanded="false">{profile.username}</p>
          <ul className="dropdown-menu" aria-labelledby="dropdownMenuButton1">
            <li><div className="dropdown-item" onClick={logout}>Logout</div></li>
            <li><div className="dropdown-item" onClick={() => {navigate('/saved_posts')}}>Saved Posts</div></li>
            {deleteStoryButton}
          </ul>
        </div>
        <div className="profile_row_flex">
          <img
            className="profile_picture_img"
            src={`https://prouserr.pythonanywhere.com${profile.image}`}
            alt="..."
          />
          <p className="user_info">
            <strong>{profile.posts.length}</strong><br />posts
          </p>
          <p className="user_info">
            <strong>{profile.followers.length}</strong><br />Followers
          </p>
          <p className="user_info">
            <strong>{profile.following.length}</strong><br />Following
          </p>
        </div>
        <div>
          <p className="bio">{profile.bio}</p>
        </div>
        <div className="profile_row_flex">
          {buttons}
        </div>
      </div>
    );
  }
  catch (err) {
  }

};

export default Profile;
