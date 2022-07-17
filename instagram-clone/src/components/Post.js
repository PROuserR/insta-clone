import React from 'react'
import PostHeader from './PostHeader'
import PostBody from './PostBody'
import PostFooter from './PostFooter'
import "../components_style/Post.css"
import CommentModal from './CommentModal'
import SendModal from './SendModal'


const Post = ({ post }) => {
  let post_header = {user_id: post.owner, post_id:post.id, image:post.image, username:post.username, profile_id:post.profile_id };
  let post_body = {photoes: post.photoes, post_id:post.id};
  let post_footer = {caption: post.caption, comments: post.comments
    , date_added: post.date_added, likes:post.likes, username:post.username, liker:post.liker,
  post_id:post.id, saved:post.saved, user_id: post.owner};
  let comment_modal_id = Math.round(Math.random() * 1000);
  let heart_id = Math.round(Math.random() * 1000);
  let comment_box_id = Math.round(Math.random() * 1000);
  return (
    <div className='post'>
        <PostHeader post_header={post_header} />
        <PostBody carousel_id={Math.round(Math.random() * 1000)} post_body={post_body} heart_id={heart_id} />
        <PostFooter post_footer={post_footer} comment_modal_id={comment_modal_id} heart_id={heart_id} comment_box_id={`post_footer_${comment_box_id}`} comment_modal={false}  />
        <CommentModal  post={post} comment_modal_id={comment_modal_id} comment_box_id={`comment_modal_${comment_box_id}`} />
        <SendModal post_id={post.id} />
    </div>
  )
}

export default Post