// src/pages/ProfileSection/UserProfile/UserProfile.tsx

import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../../../redux/store';
import { getUserById } from '../../../redux/features/user/userSlice';
import { getThemeStatus, changeThemeStatus } from '../../../redux/features/theme/thunks/themeThunk';
import { ThemeStatus } from '../../../redux/features/theme/themeSlice';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './UserProfile.css';
import ModalUserProfile from '../../../components/ModalUserProfile/ModalUserProfile';
import ProfileHeader from './ProfileHeader/ProfileHeader';
import ImageCarousel from './ImageCarousel/ImageCarousel';
import PersonalInformation from './PersonalInformation/PersonalInformation';
import ProfessionalInformation from './ProfessionalInformation/ProfessionalInformation';
import SocialMediaLinks from './SocialMediaLinks/SocialMediaLinks';
import VideoGallery from './VideoGallery/VideoGallery';
import Experience from './Experience/Experience';
import SkillsUserProfile from './SkillsUserProfile/SkillsUserProfile';
import ProfileActions from './ProfileActions/ProfileActions'; // Import ProfileActions component
import { User } from '../../../redux/features/user/userSlice';

const UserProfile: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { userId } = useParams<{ userId: string }>();
  const location = useLocation();
  const authUser = useSelector((state: RootState) => state.auth.user);
  const user = useSelector((state: RootState) => state.user.user);
  const themeStatus = useSelector((state: RootState) => state.theme.themeStatus);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalImageIndex, setModalImageIndex] = useState(0);
  const [themeLink, setThemeLink] = useState<HTMLLinkElement | null>(null);
  const [key, setKey] = useState(0);

  // Read the profession from localStorage
  const profession = localStorage.getItem('userProfession') || location.state?.profession;

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
      console.log(`Loading theme: ${themeStatus.theme}`);
      loadTheme(themeStatus.theme);
    } else {
      console.log('Removing theme');
      removeTheme();
    }
  };

  const loadTheme = (theme: string) => {
    removeTheme();
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = `/themes/${theme}.css?${new Date().getTime()}`; // Add a unique parameter to force reload
    document.head.appendChild(link);
    setThemeLink(link);
  };

  const removeTheme = () => {
    // Remove all existing theme links
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

  const openModal = (index: number) => {
    setModalImageIndex(index);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  if (!user) {
    return <div className="loading-container">Loading...</div>;
  }

  // Get the user's social media links
  const socialMediaLinks = user.socialMediaLinks || [];

  return (
    <div key={key} className="user-profile-container">
      {/* Profile Header Card */}
      <div className="userProfile-card">
        <div className="userProfile-card-body">
          {/* Pass only the user prop to ProfileHeader */}
          <ProfileHeader user={user} />
        </div>
      </div>

      {/* Profile Actions Card */}
      <div className="userProfile-card">
        <div className="userProfile-card-body">
          <ProfileActions themeEnabled={themeStatus.theme_enabled} toggleTheme={toggleTheme} showEditButton={authUser?._id === user._id} handleEditProfile={handleEditProfile} />
        </div>
      </div>

      {/* Image Carousel Card */}
      <div className="userProfile-card">
        <div className="userProfile-card-body">{user.images && <ImageCarousel images={user.images} openModal={openModal} />}</div>
      </div>

      {/* Personal Information Card */}
      <div className="userProfile-card">
        <div className="userProfile-card-body">
          <PersonalInformation user={user} />
        </div>
      </div>

      {/* Social Media Links Card */}
      <div className="userProfile-card">
        <div className="userProfile-card-body">
          <SocialMediaLinks socialMediaLinks={socialMediaLinks} />
        </div>
      </div>

      {/* Professional Information Card */}
      <div className="userProfile-card">
        <div className="userProfile-card-body">
          <ProfessionalInformation user={user} />
        </div>
      </div>

      {/* Experience Card */}
      <div className="userProfile-card">
        <div className="userProfile-card-body">
          <Experience experience={user.experience} />
        </div>
      </div>

      {/* Skills Card */}
      <div className="userProfile-card">
        <div className="userProfile-card-body">
          <SkillsUserProfile skills={user.skills} />
        </div>
      </div>

      {/* Video Gallery Card */}
      <div className="userProfile-card">
        <div className="userProfile-card-body">
          <VideoGallery videos={user.videos || []} />
        </div>
      </div>

      {user.images && (
        <ModalUserProfile
          images={user.images}
          currentIndex={modalImageIndex}
          isOpen={isModalOpen}
          onClose={closeModal}
          onNext={() => setModalImageIndex((prevIndex) => (prevIndex + 1) % user.images!.length)}
          onPrev={() => setModalImageIndex((prevIndex) => (prevIndex - 1 + user.images!.length) % user.images!.length)}
        />
      )}
    </div>
  );
};

export default UserProfile;
