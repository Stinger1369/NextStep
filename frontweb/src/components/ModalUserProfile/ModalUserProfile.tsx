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

  const handleKeyDown = (event: React.KeyboardEvent, action: () => void) => {
    if (event.key === 'Enter' || event.key === ' ') {
      action();
    }
  };

  return (
    <div className="modal-user-profile-overlay" role="dialog" aria-modal="true">
      <div className="modal-user-profile-content" role="document" onClick={(e) => e.stopPropagation()}>
        <button className="modal-user-profile-close" onClick={onClose} aria-label="Close modal" onKeyDown={(event) => handleKeyDown(event, onClose)}>
          <FaTimes />
        </button>
        <button className="modal-user-profile-control-prev" onClick={onPrev} aria-label="Previous image" onKeyDown={(event) => handleKeyDown(event, onPrev)}>
          <FaArrowLeft />
        </button>
        <img src={images[currentIndex]} alt={`User profile ${currentIndex + 1}`} className="modal-user-profile-image" />
        <button className="modal-user-profile-control-next" onClick={onNext} aria-label="Next image" onKeyDown={(event) => handleKeyDown(event, onNext)}>
          <FaArrowRight />
        </button>
      </div>
      <div className="modal-user-profile-overlay-close" role="button" tabIndex={0} onClick={onClose} onKeyDown={(event) => handleKeyDown(event, onClose)} aria-label="Close modal"></div>
    </div>
  );
};

export default ModalUserProfile;
