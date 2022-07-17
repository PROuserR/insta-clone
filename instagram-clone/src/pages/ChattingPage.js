import React, { useEffect, useState, useContext } from "react";
import "../pages_style/ChattingPage.css";
import { ReactComponent as EmojiIcon } from "../assets/emoji-smile.svg";
import { ReactComponent as HeartIcon } from "../assets/heart.svg";
import { ReactComponent as ImageIcon } from "../assets/image.svg";
import { ReactComponent as ArrowLeftIcon } from "../assets/arrow-left.svg";
import { ReactComponent as SendIcon } from "../assets/send.svg";
import { Toast, ToastContainer } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom"

let is_emoji_toast_shown = false;

const ChattingPage = () => {
  const [myMessages, setMyMessages] = useState([]);
  const [endUserMessages, setEndUserMessages] = useState([]);
  const [profile, setProfile] = useState();
  const navigate = useNavigate();

  let path = window.location.pathname;
  let sender_id = path.match(/(\d+)/)[0]

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

  let getMessages = async () => {
    let res = await fetch(`https://prouserr.pythonanywhere.com/api/list_messages/${localStorage.getItem('my_id')}/${sender_id}`)
    let data = await res.json();
    console.log(data)
    let myMessagesTemp = [];
    let endUserMessagesTemp = [];
    for (let index = 0; index < data.length; index++) {
      if (data[index].sender === localStorage.getItem('my_id')) {
        myMessagesTemp.push(data[index])
      }
      else {
        endUserMessagesTemp.push(data[index])
      }

    }
    setMyMessages(myMessagesTemp);
    setEndUserMessages(endUserMessagesTemp);
  }

  useEffect(() => {
    getMessages();
    getProfile();
  }, [])


  const toggleShowA = () => {
    if (is_emoji_toast_shown) {
      let toast_container =
        document.getElementsByClassName("toast_container")[0];
      toast_container.style.visibility = "hidden";
    } else {
      let toast_container =
        document.getElementsByClassName("toast_container")[0];
      toast_container.style.visibility = "visible";
    }
    is_emoji_toast_shown = !is_emoji_toast_shown;
  };


  let send_message = async () => {
    let message = document.getElementById("chat_textbox").value;
    await fetch(`https://prouserr.pythonanywhere.com/api/add_message/`, {
      method: 'POST',
      headers: {
        'Content-type': 'application/json',
        'X-CSRFToken': csrftoken,
      },
      body: JSON.stringify({ 'content': message, 'sender': localStorage.getItem('my_id'), 'receiver': sender_id })
    }
    )
    getMessages();
    let chat_textbox = document.getElementById("chat_textbox");
    chat_textbox.value = "";
    let not_send_icons = document.getElementsByClassName("not_send_icon");
    let send_icon = document.getElementById("send_icon");

    for (let index = 0; index < not_send_icons.length; index++) {
      not_send_icons[index].style.position = "initial";
      not_send_icons[index].style.visibility = "visible";
    }
    send_icon.style.position = "absolute";
    send_icon.style.visibility = "hidden";
  };

  let handle_send = (e) => {
    let not_send_icons = document.getElementsByClassName("not_send_icon");
    let send_icon = document.getElementById("send_icon");
    if (e.target.value === "") {
      for (let index = 0; index < not_send_icons.length; index++) {
        not_send_icons[index].style.position = "initial";
        not_send_icons[index].style.visibility = "visible";
      }
      send_icon.style.position = "absolute";
      send_icon.style.visibility = "hidden";
    } else {
      for (let index = 0; index < not_send_icons.length; index++) {
        not_send_icons[index].style.position = "absolute";
        not_send_icons[index].style.visibility = "hidden";
      }
      send_icon.style.position = "initial";
      send_icon.style.visibility = "visible";
    }
  };

  let send_heart = async () => {
    await fetch(`https://prouserr.pythonanywhere.com/api/add_message/`, {
      method: 'POST',
      headers: {
        'Content-type': 'application/json',
        'X-CSRFToken': csrftoken,
      },
      body: JSON.stringify({ 'content': "❤️", 'sender': localStorage.getItem('my_id'), 'receiver': sender_id })
    }
    )
    getMessages();
  };

  let getProfile = async () => {
    let res2 = await fetch(`https://prouserr.pythonanywhere.com/api/get_profile/${sender_id}`);
    let data2 = await res2.json();
    setProfile(data2);
  }

  try {
    return (
      <div className="chat_box">
        <div className="chat_box_header">
          <div className="contact_row">
            <div className="contact_image_col">
              <div onClick={() => { navigate("/contacts") }}>
                <ArrowLeftIcon className="icon arrow_left_icon" />
              </div>
              <img
                src={`https://prouserr.pythonanywhere.com${profile.image}`}
                className="contact_image_sm rounded-circle"
                alt=" "
              />
            </div>

            <div className="contact_info_col">
              <div className="contact_info_row">
                <p className="chat_contact_name_chat_box" >{profile.username}</p>
              </div>
              <div className="contact_info_row contact_info">
                <p>{endUserMessages.length > 0 ? endUserMessages[endUserMessages.length - 1].content : <span>None</span>}</p>
              </div>
            </div>
          </div>
        </div>
        <div className="chat_box_body">
          
          {endUserMessages.map((endUserMessage, index) => (
            <div className="message text-break" key={index}>
              {endUserMessage.content.includes('/') ? <Link to={endUserMessage.content}>Go to Post</Link> :endUserMessage.content}
            </div>
          ))}
          {myMessages.map((myMessage, index) => (
            <div className="message text-break text-wrap my_message" key={index}>
              {myMessage.content.includes('/') ? <Link to={myMessage.content}>Go to Post</Link> :myMessage.content}
            </div>
          ))}
        </div>
        <div className="chat_box_footer">
          <div className="chat_box_footer_bar">
            <EmojiIcon onClick={toggleShowA} className="icon emoji_icon" />
            <ToastContainer className="toast_container">
              <Toast>
                <Toast.Body>
                  😀 😁 😂 😃 😄 😅 😆 😇 😈 😉 😊 😋 😌 😍 😎 😏 😐 😑 😒 😓 😔
                  😕 😖 😗 😘 😙 😚 😛 😜 😝 😞 😟 😠 😡 😢 😣 😤 😥 😦 😧 😨 😩
                  😪 😫 😬 😭 😮 😯 😰 😱 😲 😳 😴 😵 😶 😷 🙁 🙂 🙃 🙄 🤐 🤑 🤒
                  🤓 🤔 🤕 🤠 🤡 🤢 🤣 🤤 🤥 🤧 🤨 🤩 🤪 🤫 🤬 🤭 🤮 🤯 🧐
                </Toast.Body>
              </Toast>
            </ToastContainer>
            <input
              type="text"
              placeholder="Message..."
              className="chat_textbox"
              id="chat_textbox"
              onChange={handle_send}
            />
            <ImageIcon className="icon not_send_icon" />
            <HeartIcon
              className="icon not_send_icon"
              onClick={send_heart}
              style={{ marginLeft: "20px" }}
            />
            <SendIcon id="send_icon" onClick={send_message} />
          </div>
        </div>
      </div>
    );
  } catch (error) {
  }

};

export default ChattingPage;
