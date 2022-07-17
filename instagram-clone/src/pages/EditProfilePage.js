import React, {useContext} from 'react'
import { useNavigate } from 'react-router-dom';

const EditProfilePage = () => {
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
    const navigate = useNavigate();
    
    let update_profile= async () => {

        let username = document.getElementById('username_input').value;
        let email = document.getElementById('email_input').value;
        let bio = document.getElementById('bio_input').value;
        let image = document.getElementById('image_input').files[0]
        const formDataProfile  = new FormData();
        formDataProfile.append('bio', bio)
        formDataProfile.append('image', image)
        formDataProfile.append('user', localStorage.getItem('my_id'))

        fetch(`http://prouserr.pythonanywhere.com/api/update_profile/${localStorage.getItem('my_id')}`, {
            method:'POST', 
            headers:{
                'X-CSRFToken':csrftoken,
            },
            body:formDataProfile
        })
        
        fetch(`http://prouserr.pythonanywhere.com/api/update_user/${localStorage.getItem('my_id')}`, {
            method:'POST', 
            headers:{
                'Content-type':'application/json',
                'X-CSRFToken':csrftoken,
            },
            body:JSON.stringify({'email':email,'username':username,'password':' ', 'posts': []})
        })
        window.location.replace("/")
    }

    return (
        <div>
                <div className="mb-3">
                    <label className="form-label">Username</label>
                    <input className="form-control" id="username_input" />
                </div>
                <div className="mb-3">
                    <label className="form-label">Email address</label>
                    <input type="email" className="form-control" id="email_input" />
                </div>
                <div className="mb-3">
                    <label className="form-label">Profile Picture</label>
                    <input type="file" className="form-control" id="image_input"/>
                </div>
                <div className="mb-3">
                    <label className="form-label">Bio</label>
                    <input className="form-control" id="bio_input"/>
                </div>
                <button className="btn btn-primary w-100" onClick={update_profile}>Submit</button>
        </div>
    )
}

export default EditProfilePage