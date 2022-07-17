import React , {useState} from 'react'
import { ReactComponent as InstaIcon } from '../assets/insta.svg'
import { Link } from 'react-router-dom';
import "../pages_style/LoginPage.css"

const LoginPage = () => {
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
  
  const loginUser = async () => {
    let username = document.getElementById('username-input').value
    let password = document.getElementById('password-input').value

    let res1 = await fetch(`http://127.0.0.1:8000/api/login_user/`, {
        method:'POST', 
        headers:{
            'Content-type':'application/json',
            'X-CSRFToken':csrftoken,
        },
        body:JSON.stringify({'username':username,'password':password})
    })
    let data1 = await res1.json();
    console.log(data1['token'])

    let res = await fetch(`http://localhost:8000/api/get_user_id`, {
      method:'GET', 
      headers:{
          'Content-type':'application/json',
          'X-CSRFToken':csrftoken,
          'Authorization': `Token ${data1['token']}`
      }})
    let data = await res.json();
    localStorage.setItem('my_id', data['my_id'])
    window.location.replace('/')
  }

  return (
    <div>
      <div id='login_page'>
        <InstaIcon />
        <div className='register_p'>Please Login:</div>
        <br />
        <div className="mb-3 w-100">
          <p className="form-label text-center">Username</p>
          <input type="username" className="form-control" id="username-input" aria-describedby="usernameHelp" />
        </div>
        <div className="mb-3 w-100">
          <p className="form-label text-center">Password</p>
          <input type="password" className="form-control" id="password-input" />
        </div>
        <div className="w-100">
          <button className="btn btn-primary login_btn" onClick={loginUser}>Login</button>
        </div>
      </div>
      <div className='loginpage_register'>
        <Link to='/register' className='register_link register_p'>Create New Account</Link>
      </div>
    </div>
  )
}

export default LoginPage