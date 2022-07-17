import React, { useEffect, useState, useContext } from "react";
import "../components_style/SendModal.css"

const SendModal = ({ post_id }) => {
  const [contacts, setContacts] = useState([]);

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

  let getContacts = async () => {
    let res_1 = await fetch(`http://127.0.0.1:8000/api/get_profile/${localStorage.getItem('my_id')}`);
    let data_1 = await res_1.json();
    let contactsTemp = [];
    for (let index = 0; index < data_1.following.length; index++) {
      let res_2 = await fetch(`http://127.0.0.1:8000/api/get_profile/${data_1.following[index]}`);
      let data_2 = await res_2.json();
      contactsTemp.push(data_2)
    }
    setContacts(contactsTemp)
  }

  let send_post = async () => {
    let checkboxes = document.getElementsByClassName('send_modal_checkbox')
    for (let index = 0; index < checkboxes.length; index++) {
      if (checkboxes[index].checked === true) {
        await fetch(`http://127.0.0.1:8000/api/add_message/`, {
          method: 'POST',
          headers: {
            'Content-type': 'application/json',
            'X-CSRFToken': csrftoken,
          },
          body: JSON.stringify({ 'content': `/post/${post_id}`, 'sender': localStorage.getItem('my_id'), 'receiver': checkboxes[index].value })
        }
        )
      }
    }
    for (let index = 0; index < checkboxes.length; index++) {
      checkboxes[index].checked = false
    }
  };

  useEffect(() => {
    getContacts();
  }, [])

  return (
    <div
      className="modal fade"
      id="SendModal"
      tabIndex="-1"
      aria-labelledby="SendModalLabel"
      aria-hidden="true"
    >
      <div className="modal-dialog">
        <div className="modal-content modal-lg modal-fullscreen-lg-down">
          <div className="modal-header">
            <h5
              style={{ textAlign: "center", width: "100%" }}
              id="SendModalLabel"
            >
              Share
            </h5>
            <button
              type="button"
              className="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>
          <div className="modal-body send_modal_body">
            {contacts.map((contact, index) => (
              <div className="send_modal_row" key={index}>
                <div
                  className="comment"
                  style={{ borderColor: "inherit" }}
                  key={index}
                >
                  <div className="comment_modal_profile_picture" >
                    <img
                      src={`http://127.0.0.1:8000${contact.image}`}
                      className="comment_modal_profile_picture_img"
                    />
                  </div>
                  <div className="send_modal_username">
                    {contact.username}
                  </div>
                </div>
                <input type="checkbox" className="send_modal_checkbox" value={contact.id} />
              </div>
            ))}
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-primary send_btn" onClick={send_post}>
              Send
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
export default SendModal;
