// src/pages/ProfileSection/UserProfile/components/ProfessionalInformation/ProfessionalInformation.tsx

import React from 'react';
import { User } from '../../../../redux/features/user/userSlice';
import './ProfessionalInformation.css';

interface ProfessionalInformationProps {
  user: User;
}

const ProfessionalInformation: React.FC<ProfessionalInformationProps> = ({ user }) => {
  return (
    <div className="professional-information">
      <h3 className="text-secondary">Professional Information</h3>
      <p>
        <strong>Profession:</strong> {user.profession}
      </p>
      <p>
        <strong>Bio:</strong> {user.bio}
      </p>
      <div>
        <strong>Education:</strong>
        <ul>{user.education?.map((edu, index) => <li key={index}>{edu}</li>)}</ul>
      </div>
      <div className="hobbies-section">
        <h3 className="text-secondary">Hobbies</h3>
        <ul>{user.hobbies?.map((hobby, index) => <li key={index}>{hobby}</li>)}</ul>
      </div>
    </div>
  );
};

export default ProfessionalInformation;
