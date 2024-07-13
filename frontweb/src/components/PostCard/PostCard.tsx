import React, { useState } from 'react';
import { Card, CardContent, Typography, TextField, Button } from '@mui/material';
import { Post } from '../../types';
import CommentCard from '../CommentCard/CommentCard';

interface PostCardProps {
  post: Post;
  handleCreateComment: (postId: string, content: string) => void;
}

const PostCard: React.FC<PostCardProps> = ({ post, handleCreateComment }) => {
  const [commentContent, setCommentContent] = useState('');
  const createdAt = new Date(post.createdAt).toLocaleString();

  const onCommentSubmit = () => {
    handleCreateComment(post.id, commentContent);
    setCommentContent(''); // Clear the input after submitting the comment
  };

  return (
    <Card style={{ marginBottom: '20px' }}>
      <CardContent>
        <Typography variant="body1">{post.content}</Typography>
        <Typography variant="caption">
          Posted by {post.userId} on {createdAt}
        </Typography>
        <div>
          <TextField label="Write your comment" multiline rows={2} value={commentContent} onChange={(e) => setCommentContent(e.target.value)} variant="outlined" fullWidth />
          <Button variant="contained" color="primary" onClick={onCommentSubmit}>
            Comment
          </Button>
        </div>
        {post.comments.map((comment) => (
          <CommentCard key={comment.id} comment={comment} />
        ))}
      </CardContent>
    </Card>
  );
};

export default PostCard;
