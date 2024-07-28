import React from 'react';
import './SkillDevelopment.css';

const SkillDevelopment: React.FC = () => {
  return (
    <div className="skill-development-container">
      <h3>Skill Development</h3>
      <p>Improve your skills with our online courses</p>
      <iframe src="https://www.discudemy.com/" title="Discudemy" className="skill-development-iframe"></iframe>
    </div>
  );
};

export default SkillDevelopment;
