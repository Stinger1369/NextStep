import React, { useState, useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../../redux/store';
import { createPost, getAllPosts, PostCreatedSuccessData } from '../../../websocket/postWebSocket';
import { createComment, CommentCreatedSuccessData } from '../../../websocket/commentWebSocket';
import { getCurrentUser } from '../../../websocket/userWebSocket';
import { initializeWebSocket, addEventListener, removeEventListener, addErrorListener } from '../../../websocket/websocket';
import { fetchPostsRequest, fetchPostsSuccess, fetchPostsFailure, addPost } from '../../../redux/features/websocket/posts/postSlice';
import { addComment } from '../../../redux/features/websocket/comments/commentSlice';
import { selectPostsWithDates } from '../../../redux/selectors';
import { TextField, Button, Typography, CircularProgress } from '@mui/material';
import PostList from '../../../components/PostCard/PostList';
import './PostNews.css';
import { Post, User, Comment } from '../../../types';

const PostNews: React.FC = () => {
  const [content, setContent] = useState('');
  const [user, setUser] = useState<User | null>(null);
  const posts = useSelector(selectPostsWithDates);
  const loading = useSelector((state: RootState) => state.posts.loading);
  const error = useSelector((state: RootState) => state.posts.error);
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    console.log('Initializing WebSocket...');
    initializeWebSocket('ws://localhost:8080/ws/chat');

    const storedUserId = localStorage.getItem('currentUserId');
    if (storedUserId) {
      getCurrentUser(storedUserId).then(setUser).catch(console.error);
    }

    addErrorListener((error) => {
      console.error('WebSocket error:', error);
    });
  }, []);

  useEffect(() => {
    if (user) {
      console.log('User state changed:', user);
      dispatch(fetchPostsRequest());
      getAllPosts()
        .then((posts) => {
          console.log('Posts fetched:', posts);
          dispatch(fetchPostsSuccess(posts));
        })
        .catch((error) => {
          console.error('Error fetching posts:', error);
          dispatch(fetchPostsFailure(error.message));
        });
    }
  }, [user, dispatch]);

  useEffect(() => {
    if (user) {
      const handlePostCreateSuccess = (data: PostCreatedSuccessData) => {
        console.log('Handling post.create.success event:', data);
        const newPost: Post = {
          id: data.postId,
          userId: user._id,
          title: 'Default Title',
          content,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          comments: [],
          likes: [],
          shares: [],
          repostCount: 0
        };
        console.log('New post created:', newPost);
        dispatch(addPost(newPost));
      };

      const handleCommentCreateSuccess = (data: CommentCreatedSuccessData) => {
        console.log('Handling comment.create.success event:', data);
        const newComment: Comment = {
          id: data.commentId,
          userId: data.userId,
          postId: data.postId,
          content: data.content,
          createdAt: data.createdAt ? new Date(data.createdAt).toISOString() : new Date().toISOString(),
          updatedAt: data.updatedAt ? new Date(data.updatedAt).toISOString() : new Date().toISOString()
        };
        if (isValidDate(newComment.createdAt) && isValidDate(newComment.updatedAt)) {
          dispatch(addComment(newComment));
        } else {
          console.error('Invalid date received for comment:', newComment);
        }
      };

      addEventListener<PostCreatedSuccessData>('post.create.success', handlePostCreateSuccess);
      addEventListener<CommentCreatedSuccessData>('comment.create.success', handleCommentCreateSuccess);

      return () => {
        removeEventListener<PostCreatedSuccessData>('post.create.success', handlePostCreateSuccess);
        removeEventListener<CommentCreatedSuccessData>('comment.create.success', handleCommentCreateSuccess);
      };
    }
  }, [user, dispatch, content]);

  const handleCreatePost = useCallback(() => {
    console.log('Creating post...');
    createPost(content)
      .then((postId) => {
        console.log('Post created with ID:', postId);
        setContent(''); // Clear the content after creating the post
      })
      .catch((error) => console.error('Error creating post:', error));
  }, [content]);

  const handleCreateComment = useCallback((postId: string, content: string) => {
    console.log('Creating comment...');
    createComment(content, postId)
      .then((commentId) => {
        console.log('Comment created with ID:', commentId);
      })
      .catch((error) => console.error('Error creating comment:', error));
  }, []);

  return (
    <div className="home-job">
      <Typography variant="h1">HomeJob</Typography>
      <div>
        <TextField label="Write your post here" multiline rows={4} value={content} onChange={(e) => setContent(e.target.value)} variant="outlined" fullWidth />
        <Button variant="contained" color="primary" onClick={handleCreatePost}>
          Create Post
        </Button>
      </div>
      {loading ? (
        <CircularProgress />
      ) : error ? (
        <Typography color="error">{error}</Typography>
      ) : posts.length > 0 ? (
        <PostList posts={posts} handleCreateComment={handleCreateComment} />
      ) : (
        <Typography>Aucun post à afficher pour le moment.</Typography>
      )}
    </div>
  );
};

export default PostNews;

const isValidDate = (date: Date | string): boolean => {
  return !isNaN(new Date(date).getTime());
};
