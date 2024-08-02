import React, { useState, useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../../redux/store';
import { createPost, getAllPosts } from '../../../websocket/postWebSocket';
import {
  initializeWebSocket,
  addEventListener,
  removeEventListener,
  addErrorListener
} from '../../../websocket/websocket';
import {
  fetchPostsRequest,
  fetchPostsSuccess,
  fetchPostsFailure,
  addPost
} from '../../../redux/features/websocket/posts/postSlice';
import { fetchUser } from '../../../redux/features/websocket/users/userWebsocketThunks/userWebsocketThunks';
import { setCurrentUser } from '../../../redux/features/websocket/users/userWebSocketSlice';
import { selectPostsWithDates } from '../../../redux/selectors';
import { TextField, Button, Typography, CircularProgress, Box } from '@mui/material';
import PostList from '../../../components/PostCard/PostList';
import { Post, User, PostCreatedSuccessData } from '../../../types';
import './PostNews.css';

const PostNews: React.FC = () => {
  const [content, setContent] = useState('');
  const posts = useSelector(selectPostsWithDates);
  const loading = useSelector((state: RootState) => state.posts.loading);
  const error = useSelector((state: RootState) => state.posts.error);
  const user = useSelector((state: RootState) => state.userWebSocket.currentUser);
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    const websocketUrl = process.env.REACT_APP_WEBSOCKET_URL || 'ws://localhost:8081/ws/chat';
    initializeWebSocket(websocketUrl);

    const storedUserId = localStorage.getItem('currentUserId');

    if (storedUserId) {
      dispatch(fetchUser(storedUserId)).then((result) => {
        const user = result.payload as User;
        if (user && user.id && user.email) {
          dispatch(setCurrentUser(user));
        } else {
          console.error('Invalid user data:', user);
        }
      });
    }

    addErrorListener((error) => {
      console.error('WebSocket error:', error);
    });
  }, [dispatch]);

  useEffect(() => {
    if (user) {
      dispatch(fetchPostsRequest());
      getAllPosts()
        .then((posts) => {
          dispatch(fetchPostsSuccess(posts));
        })
        .catch((error) => {
          dispatch(fetchPostsFailure(error.message));
        });
    }
  }, [user, dispatch]);

  useEffect(() => {
    if (user) {
      const handlePostCreateSuccess = (data: PostCreatedSuccessData) => {
        const newPost: Post = {
          id: data.postId,
          userId: user.id,
          userFirstName: user.firstName,
          userLastName: user.lastName,
          title: 'Default Title',
          content: data.content,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          comments: [],
          likes: [],
          unlikes: [],
          shares: [],
          images: [],
          repostCount: 0,
          reposters: []
        };
        dispatch(addPost(newPost));
      };

      addEventListener<PostCreatedSuccessData>('post.create.success', handlePostCreateSuccess);

      return () => {
        removeEventListener<PostCreatedSuccessData>('post.create.success', handlePostCreateSuccess);
      };
    }
  }, [user, dispatch]);

  const handleCreatePost = useCallback(() => {
    if (user) {
      createPost(content)
        .then(() => {
          setContent('');
        })
        .catch((error) => {
          console.error('Error creating post:', error);
        });
    } else {
      console.error('No user logged in');
    }
  }, [content, user]);

  const sortedPosts = posts
    .map((post) => ({
      ...post,
      createdAt: new Date(post.createdAt).toISOString(),
      updatedAt: new Date(post.updatedAt).toISOString()
    }))
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  let contentToDisplay;
  if (loading) {
    contentToDisplay = <CircularProgress />;
  } else if (error) {
    contentToDisplay = <Typography color="error">{error}</Typography>;
  } else if (sortedPosts.length > 0) {
    contentToDisplay = <PostList posts={sortedPosts} />;
  } else {
    contentToDisplay = <Typography>Aucun post à afficher pour le moment.</Typography>;
  }

  return (
    <Box className="PostNews-homeJob">
      <Typography variant="h5" component="div" sx={{ marginBottom: '10px', textAlign: 'center' }}>
        HomeJob
      </Typography>
      <Box className="PostNews-createPost">
        <TextField
          placeholder="Commencer un post"
          multiline
          rows={1}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          variant="outlined"
          fullWidth
          sx={{ marginRight: '10px', borderRadius: '20px' }}
        />
        <Button variant="contained" color="primary" onClick={handleCreatePost}>
          Post
        </Button>
      </Box>
      {contentToDisplay}
    </Box>
  );
};

export default PostNews;
