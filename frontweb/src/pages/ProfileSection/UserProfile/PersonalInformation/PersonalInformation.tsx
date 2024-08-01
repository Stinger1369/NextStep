// src/pages/ProfileSection/UserProfile/components/PersonalInformation/PersonalInformation.tsx

import React from 'react';
import { User } from '../../../../redux/features/user/userSlice';
import './PersonalInformation.css';

interface PersonalInformationProps {
  user: User;
}

const PersonalInformation: React.FC<PersonalInformationProps> = ({ user }) => {
  return (
    <div className="personal-information">
      <div className="profile-section">
        <h3 className="text-secondary">Personal Information</h3>
        <p>
          <strong>Email:</strong> {user.email}
        </p>
        <p>
          <strong>Phone:</strong> {user.phone}
        </p>
        <p>
          <strong>Address:</strong> {user.address?.street}, {user.address?.city}, {user.address?.state}, {user.address?.zipCode}, {user.address?.country}
        </p>
      </div>
      <div className="separator"></div>
    </div>
  );
};

export default PersonalInformation;
