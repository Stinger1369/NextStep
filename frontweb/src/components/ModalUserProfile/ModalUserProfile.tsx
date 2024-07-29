import React from 'react';
import { FaArrowLeft, FaArrowRight, FaTimes } from 'react-icons/fa';
import './ModalUserProfile.css';

interface ModalUserProfileProps {
  images: string[];
  currentIndex: number;
  isOpen: boolean;
  onClose: () => void;
  onNext: () => void;
  onPrev: () => void;
}

const ModalUserProfile: React.FC<ModalUserProfileProps> = ({ images, currentIndex, isOpen, onClose, onNext, onPrev }) => {
  if (!isOpen) return null;

  const handleKeyPress = (event: React.KeyboardEvent, action: () => void) => {
    if (event.key === 'Enter' || event.key === ' ') {
      action();
    }
  };

  return (
    <div className="ModalUserProfile-overlay" role="dialog" aria-modal="true">
      <div className="ModalUserProfile-content" onClick={(e) => e.stopPropagation()} role="document">
        <button className="ModalUserProfile-close" onClick={onClose} aria-label="Close modal" onKeyPress={(event) => handleKeyPress(event, onClose)}>
          <FaTimes />
        </button>
        <button className="ModalUserProfile-control-prev" onClick={onPrev} aria-label="Previous image" onKeyPress={(event) => handleKeyPress(event, onPrev)}>
          <FaArrowLeft />
        </button>
        <img src={images[currentIndex]} alt={`User profile ${currentIndex + 1}`} className="ModalUserProfile-image" />
        <button className="ModalUserProfile-control-next" onClick={onNext} aria-label="Next image" onKeyPress={(event) => handleKeyPress(event, onNext)}>
          <FaArrowRight />
        </button>
      </div>
      <button
        className="ModalUserProfile-overlay-close"
        onClick={onClose}
        aria-label="Close modal"
        style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', background: 'none', border: 'none', cursor: 'default' }}
      ></button>
    </div>
  );
};

export default ModalUserProfile;
