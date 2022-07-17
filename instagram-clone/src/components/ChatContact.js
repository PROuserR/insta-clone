import React from "react";
import ChattingPage from "../pages/ChattingPage";
import { useNavigate } from "react-router-dom";
import "../components_style/ChatContact.css";

const ChatContact = ({ image, username, sender_id, last_seen }) => {
  const navigate = useNavigate();

  const time_delta = (string_date) => {
    let date = new Date(string_date)
    let now = new Date();
    let delta = (now - date) / 1000;
    let ago = " secs ago";
    if (delta > 60) {
      delta /= 60;
      ago = " mins ago";
    }
    if (delta > 60) {
      delta /= 60;
      ago = " hours ago";
    }
    if (delta > 24) {
      delta /= 24;
      ago = " days ago";
    }
    delta = Math.round(delta, 2)
    return delta + ago;
  }

  return (
    <div className="chat_contact" onClick={() => { navigate(`/chat/${sender_id}`) }}>
      <div className="contact_row">
        <div className="contact_image_col">
          <img
            src={`https://prouserr.pythonanywhere.com${image}`}
            className="contact_image"
          />
        </div>
        <div className="contact_info_col">
          <div className="contact_info_row">
            <h5>{username}</h5>
          </div>
          <div className="contact_info_row contact_info">
            <h5>Last Seen {time_delta(last_seen)}</h5>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatContact;
