import React, { useState, useEffect } from "react";
import { ReactComponent as PlusIcon } from "../assets/plus-lg.svg";
import { useNavigate } from "react-router-dom"
import "../components_style/StatusContainer.css";

const StatusContainer = () => {
  const [usersStories, setUsersStories] = useState([]);
  const [myStory, setMyStory] = useState([]);
  const [myProfile, setMyProfile] = useState();
  const [plusIcon, setPlusIcon] = useState([]);
  const navigate = useNavigate();

  let getMyProfile = async () => {
    let res = await fetch(`http://prouserr.pythonanywhere.com/api/get_profile/${localStorage.getItem('my_id')}`);
    let data = await res.json();
    setMyProfile(data);
  };

  let getUsersStories = async () => {
    let response = await fetch(`http://prouserr.pythonanywhere.com/api/get_users_stories/${localStorage.getItem('my_id')}`);
    let data = await response.json();
    setUsersStories(data);
  };

  let getMyStory = async () => {
    let response = await fetch(`http://prouserr.pythonanywhere.com/api/get_my_story/${localStorage.getItem('my_id')}`);
    let data = await response.json();
    setMyStory(data);
    if (data.length === 0)
      setPlusIcon(<PlusIcon id="plus_icon" />);

  };

  let handleMyStory = () => {
    if (myStory.length === 0) {
      navigate('/add_story');
      window.location.reload();
    }
    else {
      init_slider('my_slider')
    }
  }

  let slide = (index, slider_id) => {
    if (index > 0) {
      let slider = document.getElementById(slider_id);
      slider.childNodes[index - 1].style.visibility = "hidden";
      slider.childNodes[index].style.visibility = "visible";
    }
  };

  let init_slider = (slider_id) => {
    let slider = document.getElementById(slider_id);
    for (let index = 0; index < slider.childNodes.length; index++) {
      if (index === 0)
        slider.childNodes[index].style.visibility = "visible";
      else
        slider.childNodes[index].style.visibility = "hidden";
    }
    for (let index = 0; index < slider.childNodes.length; index++) {
      setTimeout(slide, 3000 * index, index, slider_id);
    }

  };

  useEffect(() => {
    getMyStory();
    getMyProfile();
    getUsersStories();
  }, []);

  try {
    return (
      <div>
        <div className="status_container">
          <div className="profile_picture_my_story status_card" onClick={handleMyStory}
            data-bs-toggle="modal"
            data-bs-target="#myStoryModal">
            <img
              src={`http://prouserr.pythonanywhere.com${myProfile.image}`}
              className="profile_picture_img_lg"
            />
            {plusIcon}
            <p className="card_username">Your story</p>
          </div>
          <div className="modal fade" id="myStoryModal" tabIndex="-1" aria-labelledby="myStoryModalLabel" aria-hidden="true">
            <div className="modal-dialog modal-fullscreen">
              <div className="modal-content">
                <div className="profile_story">
                  <div className="profile_picture_story_container" >
                    <img
                      src={`http://prouserr.pythonanywhere.com${myProfile.image}`}
                      className="profile_picture_story"
                    />
                  </div>
                  <div>
                    <p>
                      {myProfile.username}
                    </p>
                  </div>
                </div>
                <button type="button" className="btn-close story_close" data-bs-dismiss="modal" aria-label="Close"></button>
                <div id="my_slider">
                  {myStory.map((photo, index) => (
                    <img src={`http://prouserr.pythonanywhere.com/media/${photo}`} key={index} className="story_item" />
                  ))}
                </div>
              </div>
            </div>
          </div>

          {usersStories.map((userStory, index) => (
            <span onClick={() => init_slider('slider')} key={index}>
              <div
                className="profile_picture_lg status_card"
                data-bs-toggle="modal"
                data-bs-target="#exampleModal"
              >
                <img
                  src={`http://prouserr.pythonanywhere.com${userStory.image}`}
                  className="profile_picture_img_lg"
                />
                <p className="card_username">{userStory.username}</p>
              </div>

              <div className="modal fade" id="exampleModal" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                <div className="modal-dialog modal-fullscreen">
                  <div className="modal-content">
                    <div className="profile_story">
                      <div className="profile_picture_story_container" >
                        <img
                          src={`http://prouserr.pythonanywhere.com${userStory.image}`}
                          className="profile_picture_story"
                        />
                      </div>
                      <div>
                        <p>
                          {userStory.username}
                        </p>
                      </div>
                    </div>
                    <button type="button" className="btn-close story_close" data-bs-dismiss="modal" aria-label="Close"></button>
                    <div id="slider">
                      {userStory.story_photoes.map((photo, index) => (
                        <img src={`http://prouserr.pythonanywhere.com/media/${photo}`} key={index} className="story_item" />
                      ))}
                    </div>
                  </div>
                </div>
              </div>


            </span>
          ))}
        </div>
      </div>
    );
  } catch (error) { }
};

export default StatusContainer;
