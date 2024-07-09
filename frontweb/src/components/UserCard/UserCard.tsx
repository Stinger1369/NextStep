import React from 'react';
import './UserCard.css';

interface UserCardProps {
  username: string;
  email: string;
}

const UserCard: React.FC<UserCardProps> = ({ username, email }) => {
  return (
    <div className="user-card">
      <h3>{username ? username : email}</h3>
      <p>Voici comment vous pouvez gérer et influencer efficacement votre carrière.</p>
    </div>
  );
};

export default UserCard;
