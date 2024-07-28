import React from 'react';
import { useOutletContext } from 'react-router-dom';
import './SkillsSection.css'; // Import du fichier CSS

interface User {
  skills?: string[];
}

const SkillsSection: React.FC = () => {
  const { user } = useOutletContext<{ user: User }>();

  return (
    <div className="skills-section">
      <h2>Skills</h2>
      <ul>
        {user.skills?.map((skill, index) => (
          <li key={index} className="skill-item">
            {skill}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SkillsSection;
