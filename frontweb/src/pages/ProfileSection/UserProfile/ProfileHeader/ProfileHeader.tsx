// src/pages/ProfileSection/UserProfile/components/ProfileHeader/ProfileHeader.tsx

import React from 'react';
import { User } from '../../../../redux/features/user/userSlice';
import './ProfileHeader.css';

interface ProfileHeaderProps {
  user: User;
}

const ProfileHeader: React.FC<ProfileHeaderProps> = ({ user }) => {
  return (
    <div className="card profile-header position-relative">
      <div className="card-body">
        <div className="profile-header-content">
          <h2 className="text-primary">
            {user.firstName} {user.lastName}
          </h2>
          <p className="text-muted">{user.profession}</p>
        </div>
      </div>
    </div>
  );
};

export default ProfileHeader;
