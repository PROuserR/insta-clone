import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../components_style/PostHeader.css";
import { ReactComponent as DotsIcon } from "../assets/dots.svg";
import { ReactComponent as LinkIcon } from "../assets/link.svg";
import { ReactComponent as UnfollowIcon } from "../assets/unfollow.svg";
import { ReactComponent as XIcon } from "../assets/x.svg";

const PostHeader = ({ post_header }) => {
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
  const navigate = useNavigate();

  let triggerModal = () => {
    let my_modal = document.getElementById(`${post_header.post_id}`);
    let footer = document.getElementById('footer');
    if (footer.style.visibility === 'visible' || footer.style.visibility === '') {
      footer.style.visibility = 'hidden';
      footer.style.display = 'none';
    }
    else {
      footer.style.visibility = 'visible';
      footer.style.display = 'flex';
    }


    if (my_modal.style.visibility === 'visible') {
      my_modal.style.visibility = 'hidden';
      my_modal.style.display = 'none';
      document.body.style.overflow = 'visible';
    }
    else {
      my_modal.style.visibility = 'visible';
      my_modal.style.display = 'flex';
      document.body.style.overflow = 'hidden';
    }
  }

  let unfollowUser = async () => {
    fetch(`http://prouserr.pythonanywhere.com/api/unfollow_user/${post_header.user_id}`, {
      method: 'POST',
      headers: {
        'Content-type': 'application/json',
        'X-CSRFToken': csrftoken,
      }
    })
  }

  return (
    <div className="post_header">
      <div className="post__header_profile">
        <div className="post_header_profile_picture" >
          <img
            src={`http://prouserr.pythonanywhere.com/media/${post_header.image}`}
            className="post_header_profile_picture_img"
          />
        </div>
        <div>
          <Link to={`/user/${post_header.profile_id}`} className="username_link">
            {post_header.username}
          </Link>
        </div>
      </div>

      <div className="dots_icon_container">
        <DotsIcon className="icon dots_icon" onClick={triggerModal} />
      </div>

      <div className="my_modal" id={post_header.post_id}>
        <div className="dots_modal_col" onClick={() => { unfollowUser() }}>
          <div className="unfollow_container" >
            <UnfollowIcon className="unfollow_icon" />
          </div>
          Unfollow
        </div>

        <div className="dots_modal_col" onClick={() => { navigate(`post/${post_header.post_id}`); triggerModal(); }}>
          <LinkIcon className="dots_modal_icon" />
          Link
        </div>

        <div className="dots_modal_col" onClick={triggerModal}>
          <XIcon className="dots_modal_icon" />
          Cancel
        </div>
      </div>
    </div>
  );

};

export default PostHeader;
