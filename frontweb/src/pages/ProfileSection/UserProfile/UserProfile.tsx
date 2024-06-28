import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../../../redux/store';
import { getUserById } from '../../../redux/features/user/userSlice';
import { useNavigate, useParams } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './UserProfile.css';
import { FaArrowLeft, FaArrowRight } from 'react-icons/fa';
import ModalUserProfile from '../../../components/ModalUserProfile/ModalUserProfile';
import axios from 'axios';

const UserProfile: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { userId } = useParams<{ userId: string }>();
  const authUser = useSelector((state: RootState) => state.auth.user);
  const user = useSelector((state: RootState) => state.user.user);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalImageIndex, setModalImageIndex] = useState(0);
  const [themeEnabled, setThemeEnabled] = useState(true);
  const [themeLink, setThemeLink] = useState<HTMLLinkElement | null>(null);
  const [theme, setTheme] = useState('no_theme');
  const [key, setKey] = useState(0);

  useEffect(() => {
    if (userId) {
      console.log(`Fetching user with ID: ${userId}`);
      dispatch(getUserById(userId));
    }
  }, [dispatch, userId]);

  useEffect(() => {
    if (user) {
      console.log('Fetched user:', user);
      if (user.images) {
        console.log('User images:', user.images);
      }
      if (userId) {
        fetchThemeStatus(userId);
      }
    }
  }, [user, userId]);

  const fetchThemeStatus = async (userId: string) => {
    try {
      const response = await axios.post('http://localhost:8001/theme_status', { userId });
      setThemeEnabled(response.data.theme_enabled);
      setTheme(response.data.theme);
      if (response.data.theme_enabled) {
        loadTheme(response.data.theme);
      } else {
        removeTheme();
      }
    } catch (error) {
      console.error('Error fetching theme status:', error);
    }
  };

  const loadTheme = (theme: string) => {
    removeTheme();
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = `/themes/${theme}.css`;
    document.head.appendChild(link);
    setThemeLink(link);
  };

  const removeTheme = () => {
    if (themeLink) {
      document.head.removeChild(themeLink);
      setThemeLink(null);
    }
  };

  const toggleTheme = async () => {
    try {
      const response = await axios.post('http://localhost:8001/toggle_theme', {
        userId,
        profession: user?.profession || 'No Profession' // Inclure la profession de l'utilisateur dans la requête
      });
      const themeStatus = response.data.theme_enabled;
      setThemeEnabled(themeStatus);
      if (themeStatus) {
        loadTheme(response.data.theme);
      } else {
        removeTheme();
      }
      setKey((prevKey) => prevKey + 1);
    } catch (error) {
      console.error('Error toggling theme:', error);
    }
  };

  useEffect(() => {
    return () => {
      removeTheme();
    };
  }, []);

  const handleEditProfile = () => {
    console.log('Navigating to profile-edit-user/personal-info');
    navigate('/profile-edit-user/personal-info');
  };

  const handleNextImage = () => {
    if (user?.images && user.images.length > 0) {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % user.images!.length);
    }
  };

  const handlePrevImage = () => {
    if (user?.images && user.images.length > 0) {
      setCurrentImageIndex((prevIndex) => (prevIndex - 1 + user.images!.length) % user.images!.length);
    }
  };

  const openModal = (index: number) => {
    setModalImageIndex(index);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleNextModalImage = () => {
    if (user?.images && user.images.length > 0) {
      setModalImageIndex((prevIndex) => (prevIndex + 1) % user.images!.length);
    }
  };

  const handlePrevModalImage = () => {
    if (user?.images && user.images.length > 0) {
      setModalImageIndex((prevIndex) => (prevIndex - 1 + user.images!.length) % user.images!.length);
    }
  };

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div key={key} className="user-profile-container container mt-5">
      <div className="profile-header position-relative">
        <button className="btn btn-outline-secondary toggle-theme-btn" onClick={toggleTheme} style={{ position: 'absolute', right: '140px', top: '10px', zIndex: 1000 }}>
          {themeEnabled ? 'Disable Theme' : 'Enable Theme'}
        </button>
        {authUser?._id === user._id && (
          <button className="btn btn-outline-primary edit-profile-btn" onClick={handleEditProfile} style={{ position: 'absolute', right: '10px', top: '10px', zIndex: 1000 }}>
            Edit My Profile
          </button>
        )}
        {user.images && user.images.length > 0 && (
          <div className="carousel mb-3">
            {user.images.length > 1 && (
              <button className="carousel-control-prev" onClick={handlePrevImage} aria-label="Previous image">
                <FaArrowLeft />
              </button>
            )}
            <div className="carousel-image-container">
              {user.images.map((image, index) => (
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
            {user.images.length > 1 && (
              <button className="carousel-control-next" onClick={handleNextImage} aria-label="Next image">
                <FaArrowRight />
              </button>
            )}
          </div>
        )}
        <h2 className="text-primary mt-3">
          {user.firstName} {user.lastName}
        </h2>
        <p className="text-muted">{user.profession}</p>
      </div>
      <div className="profile-section">
        <h3 className="text-secondary">Personal Information</h3>
        <p>
          <strong>Email:</strong> {user.emailOrPhone}
        </p>
        <p>
          <strong>Phone:</strong> {user.phone}
        </p>
        <p>
          <strong>Address:</strong> {user.address?.street}, {user.address?.city}, {user.address?.state}, {user.address?.zipCode}, {user.address?.country}
        </p>
      </div>
      <div className="row profile-section mt-4">
        <div className="col-md-6">
          <h3 className="text-secondary">Professional Information</h3>
          <p>
            <strong>Profession:</strong> {user.profession}
          </p>
          <p>
            <strong>Bio:</strong> {user.bio}
          </p>
          <div>
            <strong>Education:</strong>
            <ul>{user.education?.map((edu, index) => <li key={index}>{edu}</li>)}</ul>
          </div>
        </div>
        <div className="col-md-6 vertical-line">
          <h3 className="text-secondary">Experience</h3>
          <div>
            <strong>Experience:</strong>
            <ul>{user.experience?.map((exp, index) => <li key={index}>{exp}</li>)}</ul>
          </div>
          <div>
            <strong>Skills:</strong>
            <ul>{user.skills?.map((skill, index) => <li key={index}>{skill}</li>)}</ul>
          </div>
        </div>
      </div>
      <div className="profile-section mt-4">
        <h3 className="text-secondary">Videos</h3>
        {user.videos && user.videos.length > 0 ? (
          <div className="video-gallery d-flex overflow-auto">
            {user.videos.map((video, index) => (
              <video key={index} controls className="video-thumbnail mr-2 mb-2">
                <track kind="captions" />
              </video>
            ))}
          </div>
        ) : (
          <p>No videos available</p>
        )}
      </div>
      {user.images && <ModalUserProfile images={user.images} currentIndex={modalImageIndex} isOpen={isModalOpen} onClose={closeModal} onNext={handleNextModalImage} onPrev={handlePrevModalImage} />}
    </div>
  );
};

export default UserProfile;
