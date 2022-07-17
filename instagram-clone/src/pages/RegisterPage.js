import React from 'react'
import { ReactComponent as InstaIcon } from '../assets/insta.svg'
import { useNavigate } from 'react-router-dom';
import "../pages_style/RegisterPage.css"

const RegisterPage = () => {
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
    const navigate = useNavigate();

    const registerUser = () => {
        let username = document.getElementById('username-input').value
        let email = document.getElementById('email-input').value
        let password = document.getElementById('password-input').value

        fetch(`http://127.0.0.1:8000/api/register_user/`, {
            method: 'POST',
            headers: {
                'Content-type': 'application/json',
                'X-CSRFToken': csrftoken,
            },
            body: JSON.stringify({ 'username': username, 'password': password, 'email': email })
        }).then(navigate('/login'))

    }
    return (
        <div id='login_page'>
            <InstaIcon />
            <div className='register_p'>Register in order to gain access:</div>
            <br />
            <div className="mb-3 w-100">
                <p className="form-label text-center">Username</p>
                <input type="username" className="form-control" id="username-input" aria-describedby="usernameHelp" />
            </div>
            <div className="mb-3 w-100">
                <p className="form-label text-center">Email address</p>
                <input type="email" className="form-control" id="email-input" aria-describedby="emailHelp" />
            </div>
            <div className="mb-3 w-100">
                <p className="form-label text-center">Password</p>
                <input type="password" className="form-control" id="password-input" />
            </div>
            <button className="btn btn-primary w-100" onClick={registerUser}>Register</button>
        </div>
    )
}

export default RegisterPage