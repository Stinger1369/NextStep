// src/components/PostCard/PostCard.tsx
import React from 'react';
import { Post } from '../../types';

interface PostCardProps {
  post: Post;
}

const PostCard: React.FC<PostCardProps> = ({ post }) => {
  return (
    <div key={post._id}>
      <h2>{post.title}</h2>
      <p>{post.content}</p>
      <p>{new Date(post.createdAt).toLocaleString()}</p>
    </div>
  );
};

export default PostCard;
