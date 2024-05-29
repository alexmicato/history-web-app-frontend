import React, { useState, useEffect, useRef  } from "react";
import './Post.css';
import axios from "axios";
import { useNavigate } from "react-router-dom";
import useOutsideClick from "../../../hooks/useOutsideClick";

import { useParams } from "react-router-dom";
import UserLink from "../User/UserLink";
import { useUser } from "../../../contexts/UserContext";
import PostForm from "./PostForm";
import SimpleModal from "../../Modal/SimpleModal";
import { fetchCategories } from "../../../services/CategoryService";
import { BiLike, BiSolidLike  } from "react-icons/bi";
import { FiMoreVertical } from "react-icons/fi";
import { MdEdit } from "react-icons/md";
import { MdDelete } from "react-icons/md";

function Post({ postId }) {
  const navigate = useNavigate();
  const [showOptions, setShowOptions] = useState(false);
  const [showCommentOptions, setShowCommentOptions] = useState(false);
  const [post, setPost] = useState(null);
  const [commentText, setCommentText] = useState("");
  const [comments, setComments] = useState([]);
  const [userHasLiked, setUserHasLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(0);
  const [isPostOwner, setIsPostOwner] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [ownedCommentIds, setOwnedCommentIds] = useState([]);
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editingText, setEditingText] = useState("");
  const optionsRef = useRef(null);

  const { user, logoutUser } = useUser();
  const isModerator = user && user.roles && user.roles.includes("MODERATOR");

  useOutsideClick(optionsRef, () => {
    if (showOptions) setShowOptions(false);
    if(showCommentOptions) setShowCommentOptions(false);
  });

  useEffect(() => {
    async function fetchData() {
      await fetchPost();
      await fetchComments();
      checkUserLikedPost();
      fetchOwnership();
    }
    fetchData();
  }, [postId]);

  const fetchPost = async () => {
    try {
      const response = await axios.get(`http://localhost:8080/posts/${postId}`);
      console.log("Post data received:", response.data);
      setPost(response.data);
      setLikesCount(response.data.likesCount);
    } catch (error) {
      console.error("Error fetching post", error);
    }
  };

  const fetchComments = async () => {
    try {
      const token = localStorage.getItem("authToken"); // Retrieve the stored token
      const response = await axios.get(
        `http://localhost:8080/comments/post/${postId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`, // Include the token in the Authorization header
          },
        }
      );
      console.log("Comments received:", response.data);

      setComments(response.data);
      await fetchAndSetOwnership(response.data);
    } catch (error) {
      console.error("Error fetching comments", error);
    }
  };

  const handleAddComment = async (event) => {
    event.preventDefault();
    if (!commentText) {
      alert("Comment text required!");
      return;
    }
    try {
      const postData = {
        content: commentText,
      };
      const token = localStorage.getItem("authToken"); // Retrieve the stored token

      const response = await axios.post(
        `http://localhost:8080/comments?postId=${postId}`,
        postData,
        {
          headers: {
            Authorization: `Bearer ${token}`, // Include the token in the Authorization header
          },
        }
      );
      console.log("Comment added:", response.data);
      const newComment = response.data;

      setComments((prevComments) => {
        const updatedComments = [...prevComments, newComment];
        console.log("Updated comments:", updatedComments);
        return updatedComments;
      });

      setOwnedCommentIds((prevOwnedIds) => [...prevOwnedIds, newComment.id]);
      setCommentText("");
      //fetchComments();
    } catch (error) {
      console.error(
        "Failed to add comment:",
        error.response ? error.response.data : error
      );
      alert(
        `Failed to add comment: ${
          error.response ? error.response.data : "Error details not available"
        }`
      );
    }
  };

  const checkUserLikedPost = async () => {
    try {
      const token = localStorage.getItem("authToken");
      const response = await axios.get(
        `http://localhost:8080/${postId}/userHasLiked`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setUserHasLiked(response.data);
      console.log("User has liked post:", response.data);
    } catch (error) {
      console.error("Failed to check if user has liked post:", error);
    }
  };

  const handleLikePost = async () => {
    if (!userHasLiked) {
      // Only send request if the user hasn't liked the post yet
      try {
        const response = await axios.post(
          `http://localhost:8080/${postId}/like`,
          {},
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("authToken")}`,
            },
          }
        );
        setLikesCount((prevLikes) => prevLikes + 1); // Increment likes count locally
        setUserHasLiked(true); // Update the userHasLiked state to prevent multiple likes
        console.log("Post liked:", response.data);
      } catch (error) {
        console.error("Failed to like post:", error);
        alert("Failed to like post.");
      }
    }
  };

  const handleUnlikePost = async () => {
    if (userHasLiked) {
      // Only send request if the user has liked the post
      try {
        const token = localStorage.getItem("authToken");
        const response = await axios.delete(
          `http://localhost:8080/${postId}/unlike`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setLikesCount((prevLikes) => (prevLikes > 0 ? prevLikes - 1 : 0)); // Decrement likes count locally
        setUserHasLiked(false); // Update the userHasLiked state to reflect unlike
        console.log("Post unliked");
      } catch (error) {
        console.error("Failed to unlike post:", error);
        alert("Failed to unlike post.");
      }
    }
  };

  const handleDeletePost = async (postId) => {
    try {
      const token = localStorage.getItem("authToken");
      await axios.delete(`http://localhost:8080/posts/${postId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert("Post deleted successfully");
      navigate("/forum"); // Redirect to the posts list or home page after deletion
    } catch (error) {
      console.error("Failed to delete post:", error);
      alert("Failed to delete post");
    }
  };

  const handleUpdatePost = (responseData) => {
    setPost({ ...post, ...responseData });
    setShowEditModal(false);
    alert("Post updated successfully");
  };

  const fetchOwnership = async () => {
    const { data: postOwner } = await axios.get(
      `http://localhost:8080/posts/${postId}/isOwner`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
      }
    );
    setIsPostOwner(postOwner);
  };

  const checkCommentOwnership = async (commentId) => {
    try {
      const token = localStorage.getItem("authToken");
      const response = await axios.get(
        `http://localhost:8080/comments/${commentId}/isOwner`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      return response.data;
    } catch (error) {
      console.error("Failed to check comment ownership:", error);
      return false; // Default to false in case of error
    }
  };

  const fetchAndSetOwnership = async (comments) => {
    const checks = await Promise.all(
      comments.map((comment) => checkCommentOwnership(comment.id))
    );
    const ownedIds = comments
      .filter((_, index) => checks[index])
      .map((comment) => comment.id);
    setOwnedCommentIds(ownedIds);
  };

  const handleDeleteComment = async (commentId) => {
    const token = localStorage.getItem("authToken");

    try {
      await axios.delete(`http://localhost:8080/comments/${commentId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      // Remove the comment from local state
      setComments(comments.filter((comment) => comment.id !== commentId));
      alert("Comment deleted successfully");
    } catch (error) {
      console.error("Failed to delete comment:", error);
      alert("Failed to delete comment");
    }
  };

  const saveEditedComment = async (commentId) => {
    const token = localStorage.getItem("authToken");
    const commentData = { content: editingText };

    try {
      const response = await axios.put(
        `http://localhost:8080/comments/${commentId}`,
        commentData,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      // Update local state to reflect the edited comment
      setComments(
        comments.map((comment) => {
          if (comment.id === commentId) {
            return { ...comment, content: response.data.content };
          }
          return comment;
        })
      );
      cancelEdit(); // Reset editing state
      alert("Comment updated successfully");
    } catch (error) {
      console.error("Failed to update comment:", error);
      alert("Failed to update comment");
    }
  };

  const startEditing = (comment) => {
    setEditingCommentId(comment.id);
    setEditingText(comment.content);
  };

  const cancelEdit = () => {
    setEditingCommentId(null);
    setEditingText("");
  };

  return (
    <div className="post-container">
      {post ? (
        <>
          <div className="post-details">
            <p>
              Posted by <UserLink username={post.username || "Unknown user"} />{" "}
              on {new Date(post.createdAt).toLocaleDateString()}
            </p>
          </div>
          <div className="post-category">
            <p>Category: {post.category}</p>
          </div>
          <div className="post-header">
            <h1>{post.title}</h1>
            {(isPostOwner || isModerator) && (
                <div className="post-options" /*ref={optionsRef}*/>
                  <button onClick={() => setShowOptions(!showOptions)} className="options-button">
                    <FiMoreVertical />
                  </button>
                  {showOptions && (
                    <div className="options-menu">
                      <button onClick={() => setShowEditModal(true)}><MdEdit /> Edit</button>
                      <button onClick={() => handleDeletePost(postId)}><MdDelete /> Delete</button>
                    </div>
                  )}
                </div>
              )}
           </div>
          <SimpleModal
            isOpen={showEditModal}
            onClose={() => setShowEditModal(false)}
          >
            <PostForm
              initialTitle={post.title}
              initialContent={post.content}
              initialCategory={post.category}
              onSubmit={handleUpdatePost}
              isUpdate={true}
              postId={postId}
            />
          </SimpleModal>
          <div
            className="post-content"
            dangerouslySetInnerHTML={{ __html: post.content }}
          ></div>
          <div className="post-interactions">
            <div className="post-likes-comments">
              <div className="post-likes">
                <h2>{likesCount}</h2>
                <button onClick={userHasLiked ? handleUnlikePost : handleLikePost}>
                  {userHasLiked ? <BiSolidLike /> : <BiLike />}
                </button>
              </div>
              <h2>Comments</h2>
            </div>
            <div className="post-comments">
              {comments && comments.length > 0 ? (
                comments.map((comment) => (
                  <div key={comment.id} className="comment">
                    {editingCommentId === comment.id ? (
                      <div className="editing-comment">
                        <textarea
                          value={editingText}
                          onChange={(e) => setEditingText(e.target.value)}
                          className="edit-textarea"
                        />
                        <div className="edit-buttons">
                          <button onClick={() => saveEditedComment(comment.id)} className="save-button">
                            Save
                          </button>
                          <button onClick={cancelEdit} className="cancel-button">
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <>
                      <small> <UserLink username={comment.username || "Unknown user"} /> </small>
                        <p>{comment.content}</p>
                        {(ownedCommentIds.includes(comment.id) ||
                          isModerator) && (
                          <div className="comment-options" /*ref={optionsRef}*/>
                            <button
                              onClick={() =>
                                setShowCommentOptions(
                                  showCommentOptions === comment.id
                                    ? null
                                    : comment.id
                                )
                              }
                              className="comment-options-button"
                            >
                              <FiMoreVertical />
                            </button>
                            {showCommentOptions === comment.id && (
                              <div className="comment-options-menu">
                                <button onClick={() => startEditing(comment)}>
                                <MdEdit /> Edit
                                </button>
                                <button
                                  onClick={() =>
                                    handleDeleteComment(comment.id)
                                  }
                                >
                                  <MdDelete /> Delete
                                </button>
                              </div>
                            )}
                          </div>
                        )}
                      </>
                    )}
                  </div>
                ))
              ) : (
                <p>No comments yet.</p>
              )}
            </div>
          </div>
          <div className="add-comment">
            <input
              type="text"
              placeholder="Write a comment..."
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
            />
            <button onClick={handleAddComment}>Add Comment</button>
          </div>
        </>
      ) : (
        <p>Loading post...</p>
      )}
    </div>
  );
}

export default Post;
