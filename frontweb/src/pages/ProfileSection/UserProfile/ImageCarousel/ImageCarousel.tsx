// src/pages/ProfileSection/UserProfile/components/ImageCarousel/ImageCarousel.tsx

import React, { useState } from 'react';
import { FaArrowLeft, FaArrowRight } from 'react-icons/fa';
import './ImageCarousel.css';

interface ImageCarouselProps {
  images: string[];
  openModal: (index: number) => void;
}

const ImageCarousel: React.FC<ImageCarouselProps> = ({ images, openModal }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const handleNextImage = () => {
    if (images.length > 0) {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
    }
  };

  const handlePrevImage = () => {
    if (images.length > 0) {
      setCurrentImageIndex((prevIndex) => (prevIndex - 1 + images.length) % images.length);
    }
  };

  return (
    <div className="carousel">
      {images.length > 0 && (
        <>
          {images.length > 1 && (
            <button className="carousel-control-prev" onClick={handlePrevImage} aria-label="Previous image">
              <FaArrowLeft />
            </button>
          )}
          <div className="carousel-image-container">
            {images.map((image, index) => (
              <button
                key={index}
                className={`carousel-image ${index === currentImageIndex ? 'active' : ''}`}
                onClick={() => openModal(index)}
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    openModal(index);
                  }
                }}
                aria-label={`Image ${index + 1}`}
                style={{ background: 'none', border: 'none', padding: 0 }}
              >
                <img src={image} alt={`User ${index + 1}`} className="carousel-image-content" />
              </button>
            ))}
          </div>

          {images.length > 1 && (
            <button className="carousel-control-next" onClick={handleNextImage} aria-label="Next image">
              <FaArrowRight />
            </button>
          )}
        </>
      )}
    </div>
  );
};

export default ImageCarousel;
