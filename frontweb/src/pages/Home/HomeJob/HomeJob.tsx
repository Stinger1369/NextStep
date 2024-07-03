import React from 'react';
import UserCard from '../../../components/UserCard/UserCard';
import PostCard from '../../../components/PostCard/PostCard';
import './HomeJob.css';

const HomeJob: React.FC = () => {
  // Données d'exemple pour les posts
  const posts = [
    { title: 'Titre du Post 1', content: 'Contenu du post 1...', author: 'Auteur 1' },
    { title: 'Titre du Post 2', content: 'Contenu du post 2...', author: 'Auteur 2' },
    { title: 'Titre du Post 3', content: 'Contenu du post 3...', author: 'Auteur 3' }
  ];

  // Exemple de données utilisateur
  const username = 'Bilel Zaaraoui';
  const email = 'bilel@example.com';

  return (
    <div className="home-job">
      <UserCard username={username} email={email} />
      <div className="home-job__posts">
        {posts.map((post, index) => (
          <PostCard key={index} title={post.title} content={post.content} author={post.author} />
        ))}
      </div>
    </div>
  );
};

export default HomeJob;
