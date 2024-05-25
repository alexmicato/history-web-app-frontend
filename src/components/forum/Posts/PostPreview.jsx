import React from 'react';
import { useNavigate } from 'react-router-dom';
import UserLink from '../User/UserLink'; 
import './PostPreview.css'
import { TbMessageCircle2Filled } from "react-icons/tb";
import { BiLike } from "react-icons/bi";

function PostPreview({ post }) {
    const navigate = useNavigate();

    const handleNavigation = (path) => {
        navigate(path);
    };

    return (
        <article className="article-container" key={post.id}>
            <h2 className='post-title'>{post.title}</h2>
            <div
                className="post-content"
                dangerouslySetInnerHTML={{ __html: post.content.substring(0, 800) + "..." }}
            ></div>
            <button onClick={() => handleNavigation(`/post/${post.id}`)}>
                Read more
            </button>
            <footer>
                <div>
                    <small>Posted by <UserLink username={post.username || "Unknown"} /> on {new Date(post.createdAt).toLocaleDateString()}</small>
                </div>
                <div>
                    <small> Category: {post.category}</small>
                </div>
                <div>
                    <small>{post.commentCount} <TbMessageCircle2Filled /> | {post.likesCount} <BiLike /></small>
                </div>
            </footer>
        </article>
    );
}

export default PostPreview;
