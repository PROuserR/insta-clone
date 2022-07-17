import React, { useEffect, useState, useContext } from "react";
import PostFooter from "./PostFooter";
import { ReactComponent as ArrowLeftIcon } from "../assets/arrow-left.svg";
import { Link } from "react-router-dom";
import { CommentsTriggerContext } from "../CommentsTriggerContext";
import "../components_style/CommentModal.css";

const CommentModal = ({ post, comment_modal_id, comment_box_id }) => {
  const [comments, setComments] = useState();
  const [commentsTriggerContext, setCommentsTriggerContext] = useContext(CommentsTriggerContext);

  let post_footer = {caption: post.caption, comments: post.comments
    , date_added: post.date_added, likes:post.likes, username:post.username, liker:post.liker,
  post_id:post.id, saved:post.saved, user_id: post.owner};
  let post_id = post.id

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

  let getComments = async () => {
    let res = await fetch(`https://prouserr.pythonanywhere.com/api/get_comments/${post_id}`, {
      method: 'GET',
      headers: {
        'Content-type': 'application/json',
        'X-CSRFToken': csrftoken,
      }
    })
    let data = await res.json();
    setComments(data)
  }

  useEffect(() => {
    getComments()
  }, [commentsTriggerContext])

  try {
    return (
      <div>
        <div
          className="modal fade "
          id={`comment_modal_${comment_modal_id}`}
          tabIndex="-1"
          aria-labelledby={`comment_modal_${comment_modal_id}Label`}
          aria-hidden="true"
        >
          <div className="modal-dialog modal-lg modal-fullscreen-lg-down">
            <div className="modal-content" style={{ borderColor: "inherit" }}>
              <div className="modal-header comment_modal_header">
                <ArrowLeftIcon className="comment_modal_arrow_left_icon" data-bs-toggle="modal" data-bs-target={`#comment_modal_${comment_modal_id}`} />
                <h5 style={{ textAlign: "center", width: "100%" }}>
                  Comments
                </h5>

              </div>
              <div className="comment_modal_body">
                <div className="comment_container" style={{ borderColor: "inherit" }}>
                  {comments.map((comment, index) => (
                    <div
                      className="comment"
                      style={{ borderColor: "inherit" }}
                      key={index}
                    >
                      <div className="comment_modal_profile_picture" >
                        <img
                          src={`http://prouserr.pythonanywhere.com${comment.image}`}
                          className="comment_modal_profile_picture_img"
                        />
                      </div>
                      <div className="comment_modal_username">
                        <Link to={`/user/${comment.user_id}`} className="username_link comment_modal_username_link" data-bs-dismiss="modal" >
                          {comment.username}
                        </Link>
                      </div>
                      <div className="comment_modal_content">
                        {comment.comment.content}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="modal-footer comment_modal_footer">
                <PostFooter post_footer={post_footer} comment_box_id={comment_box_id} comment_modal={true} />
              </div>
            </div>
          </div>
        </div>
      </div>

    );
  } catch (error) {
  }

};

export default CommentModal;
