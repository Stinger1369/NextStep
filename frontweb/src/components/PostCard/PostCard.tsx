import React, { useEffect } from 'react';
import { Card, CardContent, Typography } from '@mui/material';
import { Post } from '../../types';
import CommentSection from '../../pages/Home/HomeJob/CommentSection';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUser } from '../../redux/features/websocket/users/userWebsocketThunks/userWebsocketThunks';
import { RootState, AppDispatch } from '../../redux/store';

interface PostCardProps {
  post: Post;
}

const PostCard: React.FC<PostCardProps> = ({ post }) => {
  const dispatch = useDispatch<AppDispatch>();
  const user = useSelector((state: RootState) => state.userWebSocket.users[post.userId]);
  const createdAt = new Date(post.createdAt).toLocaleString();

  useEffect(() => {
    if (!user) {
      dispatch(fetchUser(post.userId));
    }
  }, [dispatch, post.userId, user]);

  return (
    <Card style={{ marginBottom: '20px' }}>
      <CardContent>
        <Typography variant="body1">{post.content}</Typography>
        <Typography variant="caption">
          Posted by {post.userFirstName} {post.userLastName} on {createdAt}
        </Typography>
        <CommentSection postId={post.id} />
      </CardContent>
    </Card>
  );
};

export default PostCard;
