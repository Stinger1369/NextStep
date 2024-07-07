import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createPost } from '../../redux/features/SocketServer/Thunks/postThunks';
import { Post } from '../../types';
import { AppDispatch, RootState } from '../../redux/store';

const PostForm: React.FC = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const userId = useSelector((state: RootState) => state.auth.user?._id);
  const dispatch: AppDispatch = useDispatch();

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!userId) {
      alert('User ID is missing.');
      return;
    }
    const newPost: Post = { id: '', title, content, userId, createdAt: new Date(), updatedAt: new Date() };
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
      <button type="submit">Create Post</button>
    </form>
  );
};

export default PostForm;
