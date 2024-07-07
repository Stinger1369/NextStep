import React from 'react';
import './PostCard.css';

interface PostCardProps {
  title: string;
  content: string;
  userId: string;
}

const PostCard: React.FC<PostCardProps> = ({ title, content, userId }) => {
  return (
    <div className="post-card">
      <h3 className="post-card__title">{title}</h3>
      <p className="post-card__content">{content}</p>
      <p className="post-card__author">User ID: {userId}</p>
    </div>
  );
};

export default PostCard;
