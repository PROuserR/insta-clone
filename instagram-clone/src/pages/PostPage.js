import React, { useEffect, useState } from 'react'
import Post from '../components/Post'

const PostPage = () => {
    let [posts, setPosts] = useState([]);
    let path = window.location.pathname;
    let post_id = path.match(/(\d+)/)[0];
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

    let getPost = async () => {
        let response = await fetch(`https://prouserr.pythonanywhere.com/api/get_post/${post_id}`, {
            method: 'GET',
            headers: {
                'X-CSRFToken': csrftoken,
            }
        });
        let data = await response.json();
        setPosts([data])
    }

    useEffect(() => {
        getPost()
    }, [])

    try {
        return (
            <div>
                {posts.map((post, index) => (
                    <Post post={post} key={index} />
                ))}
            </div>
        )
    } catch (error) {
    }

}

export default PostPage