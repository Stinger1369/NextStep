// components/HomeJob/HomeJob.tsx
import React, { useState, useEffect, useCallback } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../../redux/store';
import { getAllPosts, createPost } from '../../../websocket/postWebSocket';
import { addEventListener, removeEventListener } from '../../../websocket/websocket';
import { getCurrentUserId } from '../../../websocket/userWebSocket';
import './HomeJob.css';
import { Post } from '../../../types';

const HomeJob: React.FC = () => {
  const [content, setContent] = useState('');
  const [posts, setPosts] = useState<Post[]>([]);
  const user = useSelector((state: RootState) => state.auth.user);

  useEffect(() => {
    if (user) {
      // Fetch posts when component mounts
      getAllPosts()
        .then((posts) => setPosts(posts))
        .catch((error) => console.error('Error fetching posts:', error));

      // Add listener for post creation success
      const handlePostCreateSuccess = (data: Post) => {
        setPosts((prevPosts) => [data, ...prevPosts]);
      };

      addEventListener('post.create.success', handlePostCreateSuccess);

      return () => {
        // Remove listener on cleanup
        removeEventListener('post.create.success', handlePostCreateSuccess);
      };
    }
  }, [user]);

  const handleCreatePost = useCallback(() => {
    const userId = getCurrentUserId();
    if (!userId) return;
    // Send create post request
    createPost(content, userId)
      .then(() => {
        setContent(''); // Clear the content after sending
      })
      .catch((error) => console.error('Error creating post:', error));
  }, [content]);

  return (
    <div className="home-job">
      <h1>HomeJob</h1>
      <div>
        <textarea value={content} onChange={(e) => setContent(e.target.value)} placeholder="Write your post here" />
        <button onClick={handleCreatePost}>Create Post</button>
      </div>
      <PostList posts={posts} />
    </div>
  );
};

interface PostListProps {
  posts: Post[];
}

const PostList: React.FC<PostListProps> = ({ posts }) => {
  return (
    <div>
      {posts.map((post) => (
        <div key={post._id}>
          <p>{post.content}</p>
          <small>
            Posted by {post.userId} on {new Date(post.createdAt).toLocaleString()}
          </small>
        </div>
      ))}
    </div>
  );
};

export default HomeJob;
