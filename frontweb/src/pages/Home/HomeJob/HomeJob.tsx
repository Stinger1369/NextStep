import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../../redux/store';
import { sendCreateUser, sendCreatePost } from '../../../websocket/websocket';
import './HomeJob.css';

const HomeJob: React.FC = () => {
  const [content, setContent] = useState('');
  const [posts, setPosts] = useState<Post[]>([]);
  const user = useSelector((state: RootState) => state.auth.user);

  useEffect(() => {
    if (user) {
      // Send create user request when component mounts
      sendCreateUser({
        emailOrPhone: user.emailOrPhone,
        firstName: user.firstName ?? 'DefaultFirstName', // Provide default value
        lastName: user.lastName ?? 'DefaultLastName' // Provide default value
      });
    }
  }, [user]);

  const handleCreatePost = () => {
    sendCreatePost(content);
    setContent(''); // Clear the content after sending
  };

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

interface Post {
  _id: string;
  userId: string;
  title: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
  comments: Comment[];
}

const PostList: React.FC<{ posts: Post[] }> = ({ posts }) => {
  return (
    <div>
      {posts.map((post) => (
        <div key={post._id}>
          <p>{post.content}</p>
          <small>
            Posted by {post.userId} on {post.createdAt.toLocaleString()}
          </small>
        </div>
      ))}
    </div>
  );
};

export default HomeJob;
