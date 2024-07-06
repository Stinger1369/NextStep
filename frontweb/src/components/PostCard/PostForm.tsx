import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { createPost } from '../../redux//features/SocketServer/Thunks/postThunks';
import { Post } from '../../types';
import { AppDispatch } from '../../redux/store'; // Import correct du type AppDispatch

const PostForm: React.FC = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [author, setAuthor] = useState('');
  const dispatch: AppDispatch = useDispatch(); // Typage correct pour dispatch

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    const newPost: Post = { id: '', title, content, author, createdAt: new Date(), updatedAt: new Date() };
    dispatch(createPost(newPost));
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label htmlFor="title">Title:</label>
        <input id="title" value={title} onChange={(e) => setTitle(e.target.value)} />
      </div>
      <div>
        <label htmlFor="content">Content:</label>
        <textarea id="content" value={content} onChange={(e) => setContent(e.target.value)}></textarea>
      </div>
      <div>
        <label htmlFor="author">Author:</label>
        <input id="author" value={author} onChange={(e) => setAuthor(e.target.value)} />
      </div>
      <button type="submit">Create Post</button>
    </form>
  );
};

export default PostForm;
