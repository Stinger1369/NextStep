// NavigationIcons/NavigationIcons.tsx

import React from 'react';
import { FaArrowLeft, FaTimes } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import './NavigationIcons.css';

interface NavigationIconsProps {
  navigate: ReturnType<typeof useNavigate>;
}

const NavigationIcons: React.FC<NavigationIconsProps> = ({ navigate }) => {
  return (
    <div className="header-icons">
      <FaArrowLeft
        className="icon"
        onClick={() => navigate('/profile-edit-user/bio-skills-info')}
      />
      <FaTimes className="icon" onClick={() => navigate('/')} />
    </div>
  );
};

export default NavigationIcons;
