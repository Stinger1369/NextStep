import React from 'react';
import PostCard from './PostCard';
import { Post } from '../../types';

interface PostListProps {
  posts: Post[];
  handleCreateComment: (postId: string, content: string) => void;
}

const PostList: React.FC<PostListProps> = ({ posts, handleCreateComment }) => {
  return (
    <div>
      {posts.map((post) => (
        <PostCard key={post.id} post={post} handleCreateComment={handleCreateComment} />
      ))}
    </div>
  );
};

export default PostList;
