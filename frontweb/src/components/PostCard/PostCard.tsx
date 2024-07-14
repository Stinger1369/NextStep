import React, { useEffect } from 'react';
import { Card, CardContent, Typography, IconButton } from '@mui/material';
import { ThumbUp, Share, Repeat } from '@mui/icons-material';
import { Post } from '../../types';
import CommentSection from '../../pages/Home/HomeJob/CommentSection';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUser } from '../../redux/features/websocket/users/userWebsocketThunks/userWebsocketThunks';
import { RootState, AppDispatch } from '../../redux/store';
import { likePost, unlikePost, sharePost, repostPost } from '../../redux/features/websocket/posts/postThunks';

interface PostCardProps {
  post: Post;
}

const PostCard: React.FC<PostCardProps> = ({ post }) => {
  const dispatch = useDispatch<AppDispatch>();
  const user = useSelector((state: RootState) => state.userWebSocket.users[post.userId]);
  const createdAt = new Date(post.createdAt).toLocaleString();
  const currentUser = useSelector((state: RootState) => state.userWebSocket.currentUser);

  useEffect(() => {
    if (!user) {
      dispatch(fetchUser(post.userId));
    }
  }, [dispatch, post.userId, user]);

  const handleLike = () => {
    if (currentUser && currentUser.id) {
      dispatch(likePost(post.id, currentUser.id));
    }
  };

  const handleUnlike = () => {
    if (currentUser && currentUser.id) {
      dispatch(unlikePost(post.id, currentUser.id));
    }
  };

  const handleShare = () => {
    if (currentUser && currentUser.id) {
      const email = prompt('Enter email to share with:');
      if (email) {
        dispatch(sharePost(post.id, email));
      }
    }
  };

  const handleRepost = () => {
    if (currentUser && currentUser.id) {
      dispatch(repostPost(post.id, currentUser.id));
    }
  };

  return (
    <Card style={{ marginBottom: '20px' }}>
      <CardContent>
        <Typography variant="body1">{post.content}</Typography>
        <Typography variant="caption">
          Posted by {post.userFirstName} {post.userLastName} on {createdAt}
        </Typography>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '10px' }}>
          <IconButton onClick={handleLike} aria-label="like">
            <ThumbUp />
          </IconButton>
          <IconButton onClick={handleUnlike} aria-label="unlike">
            <ThumbUp color="secondary" />
          </IconButton>
          <IconButton onClick={handleShare} aria-label="share">
            <Share />
          </IconButton>
          <IconButton onClick={handleRepost} aria-label="repost">
            <Repeat />
          </IconButton>
        </div>
        <CommentSection postId={post.id} />
      </CardContent>
    </Card>
  );
};

export default PostCard;
