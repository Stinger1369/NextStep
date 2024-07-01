// src/components/ModalUserProfile/ModalUserProfile.tsx
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

  return (
    <div className="modal-overlay" role="dialog" aria-modal="true" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()} role="document">
        <button className="close-modal" onClick={onClose} aria-label="Close modal">
          <FaTimes />
        </button>
        <button className="modal-control-prev" onClick={onPrev} aria-label="Previous image">
          <FaArrowLeft />
        </button>
        <img src={images[currentIndex]} alt={`User profile ${currentIndex + 1}`} className="modal-image" />
        <button className="modal-control-next" onClick={onNext} aria-label="Next image">
          <FaArrowRight />
        </button>
      </div>
    </div>
  );
};

export default ModalUserProfile;
