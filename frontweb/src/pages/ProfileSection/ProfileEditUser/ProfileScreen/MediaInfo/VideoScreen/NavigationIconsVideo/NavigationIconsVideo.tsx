import React from 'react';
import { FaArrowLeft, FaTimes } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import './NavigationIconsVideo.css';

interface NavigationIconsVideoProps {
  navigate: ReturnType<typeof useNavigate>;
}

const NavigationIconsVideo: React.FC<NavigationIconsVideoProps> = ({ navigate }) => {
  return (
    <div className="navigation-icons-video">
      <button className="btn btn-link" onClick={() => navigate(-1)}>
        <FaArrowLeft size={20} />
        Back
      </button>
      <button
        className="btn btn-link"
        onClick={() => navigate('/profile-edit-user/bio-skills-info')}
      >
        <FaTimes size={20} />
        Home
      </button>
    </div>
  );
};

export default NavigationIconsVideo;
