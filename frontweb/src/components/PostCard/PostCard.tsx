import React from 'react';
import { Card, CardContent, Typography } from '@mui/material';
import { Post } from '../../types';
import CommentSection from '../../pages/Home/HomeJob/CommentSection';

interface PostCardProps {
  post: Post;
}

const PostCard: React.FC<PostCardProps> = ({ post }) => {
  const createdAt = new Date(post.createdAt).toLocaleString();

  return (
    <Card style={{ marginBottom: '20px' }}>
      <CardContent>
        <Typography variant="body1">{post.content}</Typography>
        <Typography variant="caption">
          Posted by {post.userId} on {createdAt}
        </Typography>
        <CommentSection postId={post.id} />
      </CardContent>
    </Card>
  );
};

export default PostCard;
