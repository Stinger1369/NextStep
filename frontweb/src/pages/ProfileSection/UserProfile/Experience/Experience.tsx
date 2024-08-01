// src/pages/ProfileSection/UserProfile/components/Experience/Experience.tsx

import React from 'react';
import { User } from '../../../../redux/features/user/userSlice';
import './Experience.css'; // Create a separate CSS file for Experience component

interface ExperienceProps {
  experience: User['experience'];
}

const Experience: React.FC<ExperienceProps> = ({ experience }) => {
  return (
    <div className="experience-card">
      <h3 className="text-secondary">Experience</h3>
      <ul>{experience?.map((exp, index) => <li key={index}>{exp}</li>)}</ul>
    </div>
  );
};

export default Experience;
