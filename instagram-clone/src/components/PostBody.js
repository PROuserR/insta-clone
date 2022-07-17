import React, { useContext, useEffect, useState } from "react";
import "../components_style/PostBody.css";
import { HeartTriggerContext } from "../HeartTriggerContext";

const PostBody = ({ carousel_id, post_body, heart_id }) => {
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
  const [photoes, setPhotoes] = useState([]);
  const [heartTrigger, setHeartTrigger] = useContext(HeartTriggerContext);

  useEffect(() => {setupPhotoes()}, [])

  let setupPhotoes = () => {
    let photoesTemp = []
    for (let index = 0; index < post_body.photoes.length; index++) {
      if (index == 0) {
        photoesTemp.push(
          <div className="carousel-item active" key={index}>
            <img src={`http://127.0.0.1:8000/media/${post_body.photoes[index]}`} className="post_img" alt="..." />
          </div>
        );
      } else {
        photoesTemp.push(
          <div className="carousel-item" key={index}>
            <img src={`http://127.0.0.1:8000/media/${post_body.photoes[index]}`} className="post_img" alt="..." />
          </div>
        );
      }
    }
    setPhotoes(photoesTemp)
  }

  let rescaleHeart = (heart) => {
    heart.style.transform = 'scale(1)'
  }


  const toggle_heart = async () => {
    fetch(`http://127.0.0.1:8000/api/add_like/${post_body.post_id}`, {
      method: 'POST',
      headers: {
        'Content-type': 'application/json',
        'X-CSRFToken': csrftoken,
      },
      body: JSON.stringify({ 'liker': localStorage.getItem('my_id'), })
    })
    let heart = document.getElementById(heart_id)
    heart.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" fill="red" class="bi bi-heart-fill" viewBox="0 0 16 16"><path fill-rule="evenodd" d="M8 1.314C12.438-3.248 23.534 4.735 8 15-7.534 4.736 3.562-3.248 8 1.314z"></path></svg>'
    heart.style.transform = 'scale(1.2)'
    setTimeout(rescaleHeart, 200, heart)
    setHeartTrigger(true)
  };

  try {
    return (
      <div id={"id" + carousel_id} className="carousel carousel-fade">
        <div className="carousel-inner" onClick={toggle_heart}>
          {photoes}
        </div>
        <button
          className="carousel-control-prev"
          type="button"
          data-bs-target={"#id" + carousel_id}
          data-bs-slide="prev"
        >
          <span className="carousel-control-prev-icon" aria-hidden="true"></span>
          <span className="visually-hidden">Previous</span>
        </button>
        <button
          className="carousel-control-next"
          type="button"
          data-bs-target={"#id" + carousel_id}
          data-bs-slide="next"
        >
          <span className="carousel-control-next-icon" aria-hidden="true"></span>
          <span className="visually-hidden">Next</span>
        </button>
      </div>
    );
  } catch (error) {
  }

};

export default PostBody;
