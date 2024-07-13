import React from 'react';
import { Card, CardContent, Typography } from '@mui/material';
import { Comment } from '../../types';

interface CommentCardProps {
  comment: Comment;
}

const CommentCard: React.FC<CommentCardProps> = ({ comment }) => {
  return (
    <Card style={{ marginBottom: '10px' }}>
      <CardContent>
        <Typography variant="body1">{comment.content}</Typography>
        <Typography variant="caption">
          Commented by {comment.userId} on {new Date(comment.createdAt).toLocaleString()}
        </Typography>
      </CardContent>
    </Card>
  );
};

export default CommentCard;
