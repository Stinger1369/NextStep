import React, { useEffect, useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
import './About.css';
import '../background/backgroundGradient.css'; // Import the background gradient CSS
import '../background/backgroundBulles.css'; // Import the bubbles CSS

interface User {
  firstName: string;
  lastName: string;
  bio: string;
  profession: string;
  images: string[];
}

const AboutSection: React.FC = () => {
  const { user } = useOutletContext<{ user: User }>();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    document.body.classList.add('no-scroll');
    return () => {
      document.body.classList.remove('no-scroll');
    };
  }, []);

  const handlePrevClick = () => {
    setCurrentIndex((prevIndex) => (prevIndex === 0 ? user.images.length - 1 : prevIndex - 1));
  };

  const handleNextClick = () => {
    setCurrentIndex((prevIndex) => (prevIndex === user.images.length - 1 ? 0 : prevIndex + 1));
  };

  const handleImageClick = () => {
    setIsModalOpen(true);
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter' || event.key === ' ') {
      setIsModalOpen(true);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="about-background">
      <div id="background-wrap">
        <div className="bubble x1"></div>
        <div className="bubble x2"></div>
        <div className="bubble x3"></div>
        <div className="bubble x4"></div>
        <div className="bubble x5"></div>
        <div className="bubble x6"></div>
        <div className="bubble x7"></div>
        <div className="bubble x8"></div>
        <div className="bubble x9"></div>
        <div className="bubble x10"></div>
        <div className="bubble x11"></div>
      </div>
      <div className="about-section-content">
        <div className="about-section">
          <div className="about-FlexBlock">
            <div className="about-images position-relative d-flex justify-content-center align-items-center">
              {user.images.length > 1 && (
                <button className="btn btn-outline-dark prev-button" onClick={handlePrevClick}>
                  <i className="fas fa-chevron-left"></i>
                </button>
              )}
              <button type="button" className="about-image-button" onClick={handleImageClick} onKeyDown={handleKeyDown} aria-label={`Image of ${user.firstName} ${user.lastName}`}>
                <div className="image-container">
                  <img src={user.images[currentIndex]} alt={`${user.firstName} ${user.lastName}`} className="about-image img-thumbnail" />
                </div>
              </button>
              {user.images.length > 1 && (
                <button className="btn btn-outline-dark next-button" onClick={handleNextClick}>
                  <i className="fas fa-chevron-right"></i>
                </button>
              )}
            </div>
            <div className="vertical-line"></div>
            <div className="about-text text-left">
              <h1>
                {user.profession} {`${user.firstName} ${user.lastName}`}
              </h1>
              <div className="card">
                <div className="card-body">
                  <p className="card-text">{user.bio}</p>
                </div>
              </div>
            </div>
          </div>
          {isModalOpen && (
            <div className="modal show d-block" tabIndex={-1} role="dialog">
              <div className="modal-dialog modal-dialog-centered" role="document">
                <div className="modal-content">
                  <div className="modal-header">
                    <h5 className="modal-title">{`${user.firstName} ${user.lastName}`}</h5>
                    <button type="button" className="close" aria-label="Close" onClick={handleCloseModal}>
                      <span aria-hidden="true">&times;</span>
                    </button>
                  </div>
                  <div className="modal-body">
                    <img src={user.images[currentIndex]} alt={`${user.firstName} ${user.lastName}`} className="img-fluid" />
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AboutSection;
