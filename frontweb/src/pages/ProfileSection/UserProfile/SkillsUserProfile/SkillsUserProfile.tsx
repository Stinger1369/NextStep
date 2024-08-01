// src/pages/ProfileSection/UserProfile/components/Skills/SkillsUserProfile.tsx

import React from 'react';
import { User } from '../../../../redux/features/user/userSlice';
import './SkillsUserProfile.css'; // Create a separate CSS file for Skills component

interface SkillsProps {
  skills: User['skills'];
}

const SkillsUserProfile: React.FC<SkillsProps> = ({ skills }) => {
  return (
    <div className="skills-card">
      <h3 className="text-secondary">Skills</h3>
      <ul>{skills?.map((skill, index) => <li key={index}>{skill}</li>)}</ul>
    </div>
  );
};

export default SkillsUserProfile;
