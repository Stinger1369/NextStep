import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../../../redux/store';
import { getUserById } from '../../../redux/features/user/userSlice';
import { getThemeStatus, changeThemeStatus } from '../../../redux/features/theme/thunks/themeThunk';
import { ThemeStatus } from '../../../redux/features/theme/themeSlice';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './UserProfile.css';
import { FaArrowLeft, FaArrowRight } from 'react-icons/fa';
import ModalUserProfile from '../../../components/ModalUserProfile/ModalUserProfile';

const UserProfile: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { userId } = useParams<{ userId: string }>();
  const location = useLocation();
  const authUser = useSelector((state: RootState) => state.auth.user);
  const user = useSelector((state: RootState) => state.user.user);
  const themeStatus = useSelector((state: RootState) => state.theme.themeStatus);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalImageIndex, setModalImageIndex] = useState(0);
  const [themeLink, setThemeLink] = useState<HTMLLinkElement | null>(null);
  const [key, setKey] = useState(0);

  const profession = location.state?.profession;

  useEffect(() => {
    if (userId) {
      console.log(`Fetching user with ID: ${userId}`);
      dispatch(getUserById(userId));
    }
  }, [dispatch, userId]);

  useEffect(() => {
    if (user) {
      console.log(`Fetching theme status for profession: ${profession}`);
      dispatch(getThemeStatus({ userId: user._id, profession: profession || 'No Profession' }));
    }
  }, [user, dispatch, profession]);

  useEffect(() => {
    if (themeStatus) {
      console.log(`Applying theme for profession: ${profession}`);
      applyTheme(themeStatus);
    }
  }, [themeStatus, profession]);

  const applyTheme = (themeStatus: ThemeStatus) => {
    if (themeStatus.theme_enabled) {
      loadTheme(themeStatus.theme);
    } else {
      removeTheme();
    }
  };

  const loadTheme = (theme: string) => {
    removeTheme();
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = `/themes/${theme}.css?${new Date().getTime()}`; // Ajoute un paramètre unique pour forcer le rechargement
    document.head.appendChild(link);
    setThemeLink(link);
  };

  const removeTheme = () => {
    // Supprimer tous les liens de thèmes existants
    const themeLinks = document.querySelectorAll('link[href*="/themes/"]');
    themeLinks.forEach((link) => link.parentNode?.removeChild(link));
    setThemeLink(null);
  };

  const toggleTheme = async () => {
    if (userId && user) {
      await dispatch(changeThemeStatus({ userId, profession: profession || 'No Profession' }));
      await dispatch(getThemeStatus({ userId: user._id, profession: profession || 'No Profession' }));
      setKey((prevKey) => prevKey + 1);
    }
  };

  useEffect(() => {
    return () => {
      removeTheme();
    };
  }, []);

  const handleEditProfile = () => {
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
          {themeStatus.theme_enabled ? 'Disable Theme' : 'Enable Theme'}
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
      <div className="Personal-Information">
        <div className="profile-section">
          <h3 className="text-secondary">Personal Information</h3>
          <p>
            <strong>Email:</strong> {user.email}
          </p>
          <p>
            <strong>Phone:</strong> {user.phone}
          </p>
          <p>
            <strong>Address:</strong> {user.address?.street}, {user.address?.city}, {user.address?.state}, {user.address?.zipCode}, {user.address?.country}
          </p>
        </div>
        <div className="separator"></div>
        <div className="social-media-links">
          <h3 className="text-secondary">Social Media Links</h3>
          <p>
            <strong>Github:</strong> {user.socialMediaLinks?.github}
          </p>
          <p>
            <strong>Twitter:</strong> {user.socialMediaLinks?.twitter}
          </p>
          <p>
            <strong>Instagram:</strong> {user.socialMediaLinks?.instagram}
          </p>
          <p>
            <strong>Facebook:</strong> {user.socialMediaLinks?.facebook}
          </p>
          <p>
            <strong>Discord:</strong> {user.socialMediaLinks?.discord}
          </p>
        </div>
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
          <div className="hobbies-section">
            <h3 className="text-secondary">Hobbies</h3>
            <ul>{user.hobbies?.map((hobby, index) => <li key={index}>{hobby}</li>)}</ul>
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
