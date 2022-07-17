import React, { useEffect, useState, useContext } from "react";
import { ReactComponent as ChatIcon } from "../assets/chat.svg";
import { ReactComponent as SendIcon } from "../assets/send.svg";
import { ReactComponent as BookmarkIcon } from "../assets/bookmark.svg";
import { ReactComponent as BookmarkFillIcon } from "../assets/bookmark-fill.svg";
import { ReactComponent as EmojiIcon } from "../assets/emoji-smile.svg";
import { Toast, ToastContainer } from "react-bootstrap";
import "../components_style/PostFooter.css";
import { HeartTriggerContext } from "../HeartTriggerContext";
import { CommentsTriggerContext } from "../CommentsTriggerContext"

let is_emoji_toast_shown = false;


let PostFooter = ({ post_footer, comment_modal_id, heart_id, comment_box_id, comment_modal }) => {
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
  const csrftoken = getCookie('csrftoken');

  let is_bookmark_icon_filled = post_footer.saved;
  const post_btn_id = Math.round(Math.random() * 100);
  const emoji_toast_id = Math.round(Math.random() * 100);
  const [heartTrigger, setHeartTrigger] = useContext(HeartTriggerContext);
  const [likes, setLikes] = useState('No likes so far :(');
  const [commentsLen, setCommentsLen] = useState(post_footer.comments.length);
  const [bookmarkIcon, setbookmarkIcon] = useState(post_footer.saved ? <BookmarkFillIcon /> : <BookmarkIcon />);
  const [commentsTriggerContext, setCommentsTriggerContext] = useContext(CommentsTriggerContext);

  useEffect(() => {
    let post_button = document.getElementById(post_btn_id);
    post_button.disabled = true;
    if (post_footer.likes.length === 1) {
      setLikes(<span>Liked By <strong>{post_footer.liker}</strong></span>)
    }
    if (post_footer.likes.length > 1) {
      setLikes(<span>Liked By <strong>{post_footer.liker}</strong> and <strong>others</strong></span>)
    }
  }, []);

  useEffect(() => {
    updateLikes()
  }, [heartTrigger])

  // useEffect(() => {

  // }, [commentsContext])

  // const getLikes = async () => {
  //   try{
  //     let res = await fetch(`http://127.0.0.1:8000/api/get_likes/${post_footer.post_id}`);
  //     let data = await res.json();
  //     if(data.length === 1)
  //       setLikes(<span>Liked by {data[0]}</span>)
  //     if(data.length > 1)
  //       setLikes(<span>Liked by {data[0]} and others</span>)
  //   }
  //   catch(err){
  //     console.log(err)
  //   }
  // }

  const addActivity = async (action) => {
    if (action === 'like') {
      if(heartTrigger){
        console.log("Addd like activity")
        await fetch(`http://127.0.0.1:8000/api/add_activity/`, {
          method: 'POST',
          headers: {
            'Content-type': 'application/json',
            'X-CSRFToken': csrftoken,
          },
          body: JSON.stringify({ 'action': 'Just liked your post', 'influncer': post_footer.user_id, 'influnced': localStorage.getItem('my_id') })
        })
      }
      else{
        console.log("Addd dislike activity")
        await fetch(`http://127.0.0.1:8000/api/delete_activity/`, {
          method: 'DELETE',
          headers: {
            'Content-type': 'application/json',
            'X-CSRFToken': csrftoken,
          },
          body: JSON.stringify({ 'action': 'Just liked your post', 'influncer': post_footer.user_id, 'influnced': localStorage.getItem('my_id') })
        })
      }
    }
    else if (action === 'comment') {
      console.log("Addd comment activity")
      await fetch(`http://127.0.0.1:8000/api/add_activity/`, {
        method: 'POST',
        headers: {
          'Content-type': 'application/json',
          'X-CSRFToken': csrftoken,
        },
        body: JSON.stringify({ 'action': 'Just commented on your post', 'influncer': post_footer.user_id, 'influnced': localStorage.getItem('my_id') })
      })
    }
  }

  const addComment = async () => {
    let comment_box = document.getElementById(comment_box_id)
    await fetch(`http://127.0.0.1:8000/api/add_comment/${post_footer.post_id}`, {
      method: 'POST',
      headers: {
        'Content-type': 'application/json',
        'X-CSRFToken': csrftoken,
      },
      body: JSON.stringify({ 'content': comment_box.value, 'commenter': localStorage.getItem('my_id') })
    })
    comment_box.value = '';
    setCommentsLen(commentsLen + 1);
    setCommentsTriggerContext(!commentsTriggerContext);
  };

  const toggle_post = (e) => {
    let post_button = document.getElementById(post_btn_id);

    if (e.target.value === "") post_button.disabled = true;
    else post_button.disabled = false;
  };

  const toggleShowA = () => {
    if (is_emoji_toast_shown) {
      let toast_container = document.getElementById(emoji_toast_id);
      toast_container.style.visibility = "hidden";
    } else {
      let toast_container = document.getElementById(emoji_toast_id);
      toast_container.style.visibility = "visible";
    }
    is_emoji_toast_shown = !is_emoji_toast_shown;
  };

  const toggle_heart = async () => {
    let heart = document.getElementById(heart_id)

    if (heartTrigger) {
      heart.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" fill="currentColor" class="bi bi-heart" viewBox="0 0 16 16"><path d="m8 2.748-.717-.737C5.6.281 2.514.878 1.4 3.053c-.523 1.023-.641 2.5.314 4.385.92 1.815 2.834 3.989 6.286 6.357 3.452-2.368 5.365-4.542 6.286-6.357.955-1.886.838-3.362.314-4.385C13.486.878 10.4.28 8.717 2.01L8 2.748zM8 15C-7.333 4.868 3.279-3.04 7.824 1.143c.06.055.119.112.176.171a3.12 3.12 0 0 1 .176-.17C12.72-3.042 23.333 4.867 8 15z"></path></svg>'
      await fetch(`http://127.0.0.1:8000/api/delete_like/`, {
        method: 'DELETE',
        headers: {
          'Content-type': 'application/json',
          'X-CSRFToken': csrftoken,
        },
      })
    }
    else {
      heart.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" fill="red" class="bi bi-heart-fill" viewBox="0 0 16 16"><path fill-rule="evenodd" d="M8 1.314C12.438-3.248 23.534 4.735 8 15-7.534 4.736 3.562-3.248 8 1.314z"></path></svg>'
      await fetch(`http://127.0.0.1:8000/api/add_like/${post_footer.post_id}`, {
        method: 'POST',
        headers: {
          'Content-type': 'application/json',
          'X-CSRFToken': csrftoken,
        },
        body: JSON.stringify({ 'liker': localStorage.getItem('my_id'), })
      })
    }
    setHeartTrigger(!heartTrigger)
  };

  const updateLikes = async () => {
    let res2 = await fetch(`http://localhost:8000/api/get_likers/${post_footer.post_id}`);
    let data2 = await res2.json();
    if (data2.length === 0) {
      setLikes(<span>No likes so far :(</span>)
    }
    else if (data2.length === 1) {
      setLikes(<span>Liked By <strong>{data2[0]}</strong></span>)
    }
    else if (data2.length > 1) {
      setLikes(<span>Liked By <strong>{data2[0]}</strong> and <strong>others</strong></span>)
    }
  }

  const toggle_bookmark = async () => {
    if (is_bookmark_icon_filled === true) {
      setbookmarkIcon(<BookmarkIcon />);
      await fetch(`http://127.0.0.1:8000/api/unsave_post/${localStorage.getItem('my_id')}/${post_footer.post_id}`, {
        method: 'POST',
        headers: {
          'Content-type': 'application/json',
          'X-CSRFToken': csrftoken,
        }
      })
    }
    else {
      setbookmarkIcon(<BookmarkFillIcon />);
      await fetch(`http://127.0.0.1:8000/api/save_post/${localStorage.getItem('my_id')}/${post_footer.post_id}`, {
        method: 'POST',
        headers: {
          'Content-type': 'application/json',
          'X-CSRFToken': csrftoken,
        }
      })
    }

    is_bookmark_icon_filled = !is_bookmark_icon_filled;
  };

  const time_delta = (string_date) => {
    let date = new Date(string_date)
    let now = new Date();
    let delta = (now - date) / 1000;
    let ago = " secs ago";
    if (delta > 60) {
      delta /= 60;
      ago = " mins ago";
      if (delta > 60) {
        delta /= 60;
        ago = " hours ago";
        if (delta > 24) {
          delta /= 24;
          ago = " days ago";
        }
      }
    }
    delta = Math.round(delta, 2)
    return delta + ago;
  }


  if (comment_modal) {
    return (
      <div className="post_footer">
        <ToastContainer className="post_toast_container" id={emoji_toast_id}>
          <Toast>
            <Toast.Body>
              😀 😁 😂 😃 😄 😅 😆 😇 😈 😉 😊 😋 😌 😍 😎 😏 😐 😑 😒 😓 😔 😕 😖
              😗 😘 😙 😚 😛 😜 😝 😞 😟 😠 😡 😢 😣 😤 😥 😦 😧 😨 😩 😪 😫 😬 😭
              😮 😯 😰 😱 😲 😳 😴 😵 😶 😷 🙁 🙂 🙃 🙄 🤐 🤑 🤒 🤓 🤔 🤕 🤠 🤡 🤢
              🤣 🤤 🤥 🤧 🤨 🤩 🤪 🤫 🤬 🤭 🤮 🤯 🧐
            </Toast.Body>
          </Toast>
        </ToastContainer>
        <div className="comment_box">
          <EmojiIcon onClick={toggleShowA} className="icon emoji_icon" />
          <input
            type="text"
            placeholder="Add a comment..."
            className="comment_textbox"
            id={comment_box_id}
            onChange={toggle_post}
          />
          <button
            type="button"
            className="post_button"
            id={post_btn_id}
            onClick={() => {addComment(); addActivity('comment');}}
            data-bs-dismiss="modal" aria-label="Close"
          >
            Post
          </button>
        </div>
      </div>
    );
  }
  else {
    return (
      <div className="post_footer">
        <div className="icons">
          <div className="left_icons">
            <div className="icon heart_icon post_footer_icon" id={heart_id} onClick={() => { addActivity('like'); toggle_heart(); }}>
              <svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" fill="currentColor" className="bi bi-heart" viewBox="0 0 16 16"><path d="m8 2.748-.717-.737C5.6.281 2.514.878 1.4 3.053c-.523 1.023-.641 2.5.314 4.385.92 1.815 2.834 3.989 6.286 6.357 3.452-2.368 5.365-4.542 6.286-6.357.955-1.886.838-3.362.314-4.385C13.486.878 10.4.28 8.717 2.01L8 2.748zM8 15C-7.333 4.868 3.279-3.04 7.824 1.143c.06.055.119.112.176.171a3.12 3.12 0 0 1 .176-.17C12.72-3.042 23.333 4.867 8 15z"></path></svg>
            </div>
            <ChatIcon
              className="icon post_footer_icon"
              data-bs-toggle="modal"
              data-bs-target={`#comment_modal_${comment_modal_id}`}
            />
            <SendIcon
              className="icon post_footer_icon"
              data-bs-toggle="modal"
              data-bs-target="#SendModal"
            />
          </div>
          <div className="icon post_footer_bookmark_icon" onClick={() => { toggle_bookmark(); }}>
            {bookmarkIcon}
          </div>
        </div>
        <ToastContainer className="post_toast_container" id={emoji_toast_id}>
          <Toast>
            <Toast.Body>
              😀 😁 😂 😃 😄 😅 😆 😇 😈 😉 😊 😋 😌 😍 😎 😏 😐 😑 😒 😓 😔 😕 😖
              😗 😘 😙 😚 😛 😜 😝 😞 😟 😠 😡 😢 😣 😤 😥 😦 😧 😨 😩 😪 😫 😬 😭
              😮 😯 😰 😱 😲 😳 😴 😵 😶 😷 🙁 🙂 🙃 🙄 🤐 🤑 🤒 🤓 🤔 🤕 🤠 🤡 🤢
              🤣 🤤 🤥 🤧 🤨 🤩 🤪 🤫 🤬 🤭 🤮 🤯 🧐
            </Toast.Body>
          </Toast>
        </ToastContainer>
        <p>
          {likes}
        </p>
        <p>
          <strong>{post_footer.username}</strong> {post_footer.caption}
        </p>
        <p className="text-muted" data-bs-toggle="modal" data-bs-target={`#comment_modal_${comment_modal_id}`}>View all {commentsLen} comments</p>
        <p className="text-muted hours_ago">{time_delta(post_footer.date_added)}</p>
        <hr />
        <div className="comment_box">
          <EmojiIcon onClick={toggleShowA} className="icon emoji_icon" />
          <input
            type="text"
            placeholder="Add a comment..."
            className="comment_textbox"
            id={comment_box_id}
            onChange={toggle_post}
          />
          <button
            type="button"
            className="post_button"
            id={post_btn_id}
            onClick={() => {addComment(); addActivity('comment');}}
          >
            Post
          </button>
        </div>
      </div>
    );
  }

};

export default PostFooter;
