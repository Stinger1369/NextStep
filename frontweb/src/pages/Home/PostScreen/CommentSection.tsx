// CommentSection.tsx

import React, { useState, useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../../redux/store';
import { createComment, getAllComments, CommentCreatedSuccessData } from '../../../websocket/commentWebSocket';
import { fetchCommentsRequest, fetchCommentsSuccess, fetchCommentsFailure, addComment } from '../../../redux/features/websocket/comments/commentSlice';
import { selectCommentsWithDatesByPostId } from '../../../redux/selectors';
import { TextField, Button, Typography, CircularProgress } from '@mui/material';
import CommentList from '../../../components/CommentCard/CommentList';
import './CommentSection.css';
import { Comment, Like, Unlike } from '../../../types';
import { addEventListener, removeEventListener } from '../../../websocket/websocket';

interface CommentSectionProps {
  postId: string;
}

const CommentSection: React.FC<CommentSectionProps> = ({ postId }) => {
  const [content, setContent] = useState('');
  const comments = useSelector((state: RootState) => selectCommentsWithDatesByPostId(state, postId));
  const loading = useSelector((state: RootState) => state.comments.loading);
  const error = useSelector((state: RootState) => state.comments.error);
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    dispatch(fetchCommentsRequest());
    getAllComments(postId)
      .then((comments) => {
        dispatch(fetchCommentsSuccess(comments));
      })
      .catch((error) => {
        console.error('Error fetching comments:', error);
        dispatch(fetchCommentsFailure(error.message));
      });
  }, [postId, dispatch]);

  useEffect(() => {
    const handleCommentCreateSuccess = (data: CommentCreatedSuccessData) => {
      console.log('Handling comment.create.success event:', data);
      const newComment: Comment = {
        id: data.commentId,
        userId: data.userId,
        postId: data.postId,
        content: data.content,
        firstName: data.userFirstName,
        lastName: data.userLastName,
        createdAt: data.createdAt || new Date().toISOString(),
        updatedAt: data.updatedAt || new Date().toISOString(),
        likes: [],
        unlikes: []
      };
      dispatch(addComment(newComment));
    };

    addEventListener('comment.create.success', handleCommentCreateSuccess);

    return () => {
      removeEventListener('comment.create.success', handleCommentCreateSuccess);
    };
  }, [dispatch]);

  const handleCreateComment = useCallback(() => {
    const userId = localStorage.getItem('currentUserId');
    const userFirstName = localStorage.getItem('currentUserFirstName');
    const userLastName = localStorage.getItem('currentUserLastName');

    if (!userId || !userFirstName || !userLastName) {
      console.error('User ID, first name, or last name is missing');
      return;
    }

    console.log('Creating comment...');
    createComment(content, postId, userId, userFirstName, userLastName)
      .then((commentData) => {
        console.log('Comment created with ID:', commentData.commentId);
        setContent(''); // Clear the content after creating the comment
      })
      .catch((error) => console.error('Error creating comment:', error));
  }, [content, postId]);

  const formattedComments = comments.map((comment) => ({
    ...comment,
    createdAt: new Date(comment.createdAt).toISOString(),
    updatedAt: new Date(comment.updatedAt).toISOString()
  }));

  let contentToDisplay;
  if (loading) {
    contentToDisplay = <CircularProgress />;
  } else if (error) {
    contentToDisplay = <Typography color="error">{error}</Typography>;
  } else if (formattedComments.length > 0) {
    contentToDisplay = <CommentList comments={formattedComments} />;
  } else {
    contentToDisplay = <Typography>Aucun commentaire à afficher pour le moment.</Typography>;
  }

  return (
    <div className="comment-section">
      <div>
        <TextField label="Write your comment here" multiline rows={2} value={content} onChange={(e) => setContent(e.target.value)} variant="outlined" fullWidth />
        <Button variant="contained" color="primary" onClick={handleCreateComment}>
          Comment
        </Button>
      </div>
      {contentToDisplay}
    </div>
  );
};

export default CommentSection;

const isValidDate = (date: Date | string): boolean => {
  return !isNaN(new Date(date).getTime());
};
