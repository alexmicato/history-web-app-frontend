import React, { useState, useEffect } from "react";
import axios from "axios";
import { fetchCategories } from "../../../services/CategoryService";
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';

function PostForm({
  initialTitle,
  initialContent,
  initialCategory,
  onSubmit,
  isUpdate = false,
  postId = null

}) {
  const [title, setTitle] = useState(initialTitle);
  const [content, setContent] = useState(initialContent);
  const [selectedCategory, setSelectedCategory] = useState(
    initialCategory || ""
  );
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const data = await fetchCategories();
        setCategories(data);
        // Set the initial category based on whether an initialCategory is provided
        // or default to the first category from the fetched list if initialCategory is empty
        if (initialCategory) {
          setSelectedCategory(initialCategory);
        } else if (data.length > 0) {
          setSelectedCategory(data[0]); // Automatically select the first category from the list
        }
      } catch (error) {
        console.error("Failed to load categories:", error);
      }
    };
    loadCategories();
  }, [initialCategory]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const token = localStorage.getItem("authToken");
    const postData = { title, content, category: selectedCategory };
    try {
      const url = isUpdate
        ? `http://localhost:8080/posts/${postId}`
        : "http://localhost:8080/posts";
      const method = isUpdate ? "put" : "post";
      const response = await axios({
        method: method,
        url: url,
        data: postData,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      onSubmit(response.data);
    } catch (error) {
      console.error(
        "Failed to submit post:",
        error.response ? error.response.data : error
      );
      alert(
        `Failed to submit post: ${
          error.response ? error.response.data : "Error details not available"
        }`
      );
    }
  };

  return (
    <form className="post-form" onSubmit={handleSubmit}>
      <label htmlFor="title">Title</label>
      <input
        type="text"
        id="title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
      />
      <label htmlFor="content">Content</label>
            <CKEditor
                editor={ClassicEditor}
                data={content}
                onChange={(event, editor) => {
                    const data = editor.getData();
                    setContent(data);
                }}
            />
      <label htmlFor="category">Category</label>
      <select
        id="category"
        value={selectedCategory}
        onChange={(e) => setSelectedCategory(e.target.value)}
        required
      >
        {categories.map((category) => (
          <option key={category} value={category}>
            {category}
          </option>
        ))}
      </select>
      <button type="submit">Submit</button>
    </form>
  );
}

export default PostForm;
