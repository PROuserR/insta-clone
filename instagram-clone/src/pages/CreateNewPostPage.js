import React, { useState, useEffect } from "react";
import "../pages_style/CreateNewPostPage.css";
import { ReactComponent as ImagesIcon } from "../assets/images.svg";
import { useNavigate } from "react-router-dom";

const CreateNewPostPage = () => {
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

  const [sliderValue, setSliderValue] = useState(50);
  const [photoes, setPhotoes] = useState([]);
  const [filter, setFilter] = useState('');
  const navigate = useNavigate();
  let files = [];

  useEffect(() => { applyFilter() }, [filter, sliderValue])


  let applyFilter = () => {
    try {
      let uploadedFiles = document.getElementById("uploadImage").files;
      for (let index = 0; index < uploadedFiles.length; index++) {
        let image = document.getElementById(`uploadPreview_${index}`)

        if (filter === 'original') {
          image.style.filter = ``;
          image.style.filter += ` `;
        }
        else if (filter === 'blur')
          image.style.filter = `blur(${sliderValue}px)`;
        else if (filter === 'hue-rotate')
          image.style.filter = `hue-rotate(${sliderValue}deg)`;
        else
          image.style.filter = `${filter}(${sliderValue}%)`;
      }

    } catch (error) { }
  }

  let setupPhotoes = () => {
    let photoesTemp = []
    let uploadedFiles = document.getElementById("uploadImage").files
    for (let index = 0; index < uploadedFiles.length; index++) {
      if (index == 0) {
        photoesTemp.push(
          <div className="carousel-item active" key={index}>
            <img className="post_img" id={`uploadPreview_${index}`} src="#" />
          </div>
        );
      } else {
        photoesTemp.push(
          <div className="carousel-item" key={index}>
            <img className="post_img" id={`uploadPreview_${index}`} src="#" />
          </div>
        );
      }
    }
    setPhotoes(photoesTemp)
  }

  let srcToFile = (src, fileName, mimeType) => {
    return (fetch(src)
      .then(function (res) { return res.arrayBuffer(); })
      .then(function (buf) { return new File([buf], fileName, { type: mimeType }); })
    );
  }

  let PreviewImages = () => {
    let uploadedFiles = document.getElementById("uploadImage").files
    for (let index = 0; index < uploadedFiles.length; index++) {
      let oFReader = new FileReader();
      oFReader.readAsDataURL(uploadedFiles[index]);

      oFReader.onload = function (oFREvent) {
        document.getElementById(`uploadPreview_${index}`).src = oFREvent.target.result;
      };
    }

    let create_new_post_upload = document.getElementById('create_new_post_upload');
    create_new_post_upload.style.visibility = 'hidden';
    let create_new_post_filter = document.getElementById('create_new_post_filter');
    create_new_post_filter.style.visibility = 'visible';
  };

  let showCaption = () => {
    let uploadedFiles = document.getElementById("uploadImage").files
    for (let index = 0; index < uploadedFiles.length; index++) {
      var c = document.getElementById("myCanvas");
      var ctx = c.getContext("2d");
      var img = document.getElementById(`uploadPreview_${index}`);
      ctx.canvas.width = img.width;
      ctx.canvas.height = img.height;
      if (filter === 'original') {
        ctx.filter = ``;
        ctx.filter += ` `;
      }
      else if (filter === 'blur')
        ctx.filter = `blur(${sliderValue}px)`;
      else if (filter === 'hue-rotate')
        ctx.filter = `hue-rotate(${sliderValue}deg)`;
      else
        ctx.filter = `${filter}(${sliderValue}%)`;

      ctx.drawImage(img, 0, 0, img.width, img.height);
      var imageURI = c.toDataURL("image/jpg");

      srcToFile(imageURI, `file_${Math.round(Math.random() * 1000)}.jpg`, 'image/jpg').then(function (file) {
        files.push(file);
      });

    }


    window.scrollTo(0, 0)
    let create_new_post_filter = document.getElementById('create_new_post_filter');
    create_new_post_filter.style.visibility = 'hidden';
    let create_new_post_caption = document.getElementById('create_new_post_caption');
    create_new_post_caption.style.visibility = 'visible';
  }

  let savePost = async () => {
    let caption = document.getElementById('caption').value
    const formData = new FormData();
    formData.append('caption', caption)
    formData.append('owner', localStorage.getItem('my_id'))
    for (let index = 0; index < files.length; index++) {
      formData.append('images', files[index])
    }
    await fetch(`https://prouserr.pythonanywhere.com/api/create_post/`, {
      method: 'POST',
      headers: {
        'X-CSRFToken': csrftoken,
      },
      body: formData
    })
    navigate('/')

  }


  return (
    <div>
      <h1 className="create_new_post_header">Create New Post</h1>
      <div id="create_new_post_upload">
        <ImagesIcon className="images_icon" />
        <input type="file" id="uploadImage" className="select_from_storage_button" onChange={() => { setupPhotoes(); PreviewImages(); }} multiple />
      </div>
      <div id="create_new_post_filter">
        <canvas id="myCanvas"></canvas>
        <div id="uploadPreviews" className="carousel carousel-fade">
          <div className="carousel-inner">
            {photoes}
          </div>
          <button
            className="carousel-control-prev"
            type="button"
            data-bs-target="#uploadPreviews"
            data-bs-slide="prev"
          >
            <span className="carousel-control-prev-icon" aria-hidden="true"></span>
            <span className="visually-hidden">Previous</span>
          </button>
          <button
            className="carousel-control-next"
            type="button"
            data-bs-target="#uploadPreviews"
            data-bs-slide="next"
          >
            <span className="carousel-control-next-icon" aria-hidden="true"></span>
            <span className="visually-hidden">Next</span>
          </button>
        </div>
        <br />
        <div className="create_new_post_filters_container">
          <img className="create_new_post_filter_img" src="https://media.gettyimages.com/photos/hot-air-balloons-at-sunrise-cappadocia-turkey-picture-id1310560429?s=2048x2048" onClick={() => { setFilter('original') }} />
          <img className="create_new_post_filter_img" style={{ 'filter': 'blur(5px)' }} src="https://media.gettyimages.com/photos/hot-air-balloons-at-sunrise-cappadocia-turkey-picture-id1310560429?s=2048x2048" onClick={() => { setFilter('blur') }} />
          <img className="create_new_post_filter_img" style={{ 'filter': 'opacity(50%)' }} src="https://media.gettyimages.com/photos/hot-air-balloons-at-sunrise-cappadocia-turkey-picture-id1310560429?s=2048x2048" onClick={() => { setFilter('opacity') }} />
          <img className="create_new_post_filter_img" style={{ 'filter': 'brightness(50%)' }} src="https://media.gettyimages.com/photos/hot-air-balloons-at-sunrise-cappadocia-turkey-picture-id1310560429?s=2048x2048" onClick={() => { setFilter('brightness') }} />
          <img className="create_new_post_filter_img" style={{ 'filter': 'contrast(50%)' }} src="https://media.gettyimages.com/photos/hot-air-balloons-at-sunrise-cappadocia-turkey-picture-id1310560429?s=2048x2048" onClick={() => { setFilter('contrast') }} />
          <img className="create_new_post_filter_img" style={{ 'filter': 'grayscale(50%)' }} src="https://media.gettyimages.com/photos/hot-air-balloons-at-sunrise-cappadocia-turkey-picture-id1310560429?s=2048x2048" onClick={() => { setFilter('grayscale') }} />
          <img className="create_new_post_filter_img" style={{ 'filter': 'saturate(50%)' }} src="https://media.gettyimages.com/photos/hot-air-balloons-at-sunrise-cappadocia-turkey-picture-id1310560429?s=2048x2048" onClick={() => { setFilter('saturate') }} />
          <img className="create_new_post_filter_img" style={{ 'filter': 'sepia(50%)' }} src="https://media.gettyimages.com/photos/hot-air-balloons-at-sunrise-cappadocia-turkey-picture-id1310560429?s=2048x2048" onClick={() => { setFilter('sepia') }} />
          <img className="create_new_post_filter_img" style={{ 'filter': 'hue-rotate(95deg)' }} src="https://media.gettyimages.com/photos/hot-air-balloons-at-sunrise-cappadocia-turkey-picture-id1310560429?s=2048x2048" onClick={() => { setFilter('hue-rotate') }} />
          <input className="create_new_post_slider" type="range" id="slider" min="0" max="100" onChange={() => { setSliderValue(document.getElementById('slider').value) }} />
        </div>

        <div className="d-grid gap-2 col-6 mx-auto">
          <button className="btn btn-primary create_new_post_next_btn" onClick={showCaption}>Next</button>
        </div>
      </div>
      <div id="create_new_post_caption">
        <textarea className="form-control" id="caption" rows="5" placeholder="Add caption..."></textarea>
        <br />
        <div className="d-grid gap-2 col-6 mx-auto">
          <button className="btn btn-primary " onClick={() => { savePost() }}>Save</button>
        </div>
      </div>
    </div >
  );
};

export default CreateNewPostPage;
