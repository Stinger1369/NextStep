import React from 'react';
import { useOutletContext } from 'react-router-dom';

interface User {
  skills?: string[];
}

const SkillsSection: React.FC = () => {
  const { user } = useOutletContext<{ user: User }>();

  return (
    <div>
      <h2>Skills</h2>
      <ul>{user.skills?.map((skill, index) => <li key={index}>{skill}</li>)}</ul>
    </div>
  );
};

export default SkillsSection;
