import React from 'react';
import UserCard from '../../../components/UserCard/UserCard';
import PostCard from '../../../components/PostCard/PostCard';
import PostForm from '../../../components/PostCard/PostForm';
import './HomeJob.css';

const HomeJob: React.FC = () => {
  // Exemple de données utilisateur
  const username = 'Bilel Zaaraoui';
  const email = 'bilel@example.com';

  // Exemple de données pour les posts
  const posts = [
    { id: '1', title: 'Titre du Post 1', content: 'Contenu du post 1...', author: 'Auteur 1', createdAt: new Date() },
    { id: '2', title: 'Titre du Post 2', content: 'Contenu du post 2...', author: 'Auteur 2', createdAt: new Date() },
    { id: '3', title: 'Titre du Post 3', content: 'Contenu du post 3...', author: 'Auteur 3', createdAt: new Date() }
  ];

  return (
    <div className="home-job">
      <UserCard username={username} email={email} />
      <PostForm />
      <div className="home-job__posts">
        {posts.map((post, index) => (
          <PostCard key={index} title={post.title} content={post.content} author={post.author} />
        ))}
      </div>
    </div>
  );
};

export default HomeJob;
