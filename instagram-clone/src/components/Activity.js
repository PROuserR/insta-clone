import React from 'react'
import { useNavigate } from 'react-router-dom'
import "../components_style/Activity.css"

const Activity = ({ profile_image, username, action, influncer_id}) => {
  const navigate = useNavigate();
  return (
    <div className='activity'>
        <div className='profile_picture_lg' onClick={() => {navigate(`/user/${influncer_id}`)}}>
          <img className='profile_picture_img_lg' src={`https://prouserr.pythonanywhere.com/media/${profile_image}`} alt="..." />
        </div>
        <div className='activity_info'>
            <strong>{username}</strong> {action}
        </div>
    </div>
  )
}

export default Activity