import React, { useState, useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../../redux/store';
import { createComment, getAllComments, CommentCreatedSuccessData } from '../../../websocket/commentWebSocket';
import { fetchCommentsRequest, fetchCommentsSuccess, fetchCommentsFailure, addComment } from '../../../redux/features/websocket/comments/commentSlice';
import { selectCommentsWithDatesByPostId } from '../../../redux/selectors';
import { TextField, Button, Typography, CircularProgress } from '@mui/material';
import CommentList from '../../../components/CommentCard/CommentList';
import './CommentSection.css';
import { Comment } from '../../../types';
import { addEventListener, removeEventListener } from '../../../websocket/websocket'; // Importez les fonctions

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
        firstName: data.userFirstName, // Ajouté
        lastName: data.userLastName, // Ajouté
        createdAt: data.createdAt ? new Date(data.createdAt).toISOString() : new Date().toISOString(),
        updatedAt: data.updatedAt ? new Date(data.updatedAt).toISOString() : new Date().toISOString()
      };
      if (isValidDate(newComment.createdAt) && isValidDate(newComment.updatedAt)) {
        dispatch(addComment(newComment));
      } else {
        console.error('Invalid date received for comment:', newComment);
      }
    };

    addEventListener('comment.create.success', handleCommentCreateSuccess);

    return () => {
      removeEventListener('comment.create.success', handleCommentCreateSuccess);
    };
  }, [dispatch]);

  const handleCreateComment = useCallback(() => {
    console.log('Creating comment...');
    createComment(content, postId)
      .then((commentData) => {
        console.log('Comment created with ID:', commentData.commentId);
        setContent(''); // Clear the content after creating the comment
      })
      .catch((error) => console.error('Error creating comment:', error));
  }, [content, postId]);

  let contentToDisplay;
  if (loading) {
    contentToDisplay = <CircularProgress />;
  } else if (error) {
    contentToDisplay = <Typography color="error">{error}</Typography>;
  } else if (comments.length > 0) {
    contentToDisplay = <CommentList comments={comments} />;
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
