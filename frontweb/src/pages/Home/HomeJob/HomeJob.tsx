import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUserPosts } from '../../../redux/features/SocketServer/Thunk/postSockeThunk';
import { RootState } from '../../../redux/store';
import { Post, Comment } from '../../../types';

interface UserPostsProps {
  userId: string;
  apiKey: string;
}

const UserPosts: React.FC<UserPostsProps> = ({ userId, apiKey }) => {
  const dispatch = useDispatch();
  const posts = useSelector((state: RootState) => state.userSocket.posts);
  const loading = useSelector((state: RootState) => state.userSocket.loading);
  const error = useSelector((state: RootState) => state.userSocket.error);

  useEffect(() => {
    dispatch(fetchUserPosts({ userId, apiKey }));
  }, [dispatch, userId, apiKey]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      <h2>User Posts</h2>
      <ul>
        {posts.map((post: Post) => (
          <li key={post._id.$oid}>
            <h3>{post.title}</h3>
            <p>{post.content}</p>
            <h4>Comments</h4>
            <ul>
              {post.comments.map((comment: Comment) => (
                <li key={comment._id.$oid}>
                  <p>{comment.content}</p>
                  <small>{new Date(comment.createdAt.$date).toLocaleString()}</small>
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default UserPosts;
