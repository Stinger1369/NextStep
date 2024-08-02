// src/pages/ProfileSection/UserProfile/UserProfile.tsx

import React, { useEffect, useState, useCallback } from 'react';
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
import ProfileActions from './ProfileActions/ProfileActions';
import DragAndDrop from './DragAndDrop'; // Import the new component

interface UserProfileProps {
  isDragEnabled: boolean;
  isFinalView: boolean;
}

const UserProfile: React.FC<UserProfileProps> = ({ isDragEnabled, isFinalView }) => {
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

  const initialCardOrder: string[] = [
    'ProfileHeader',
    'ProfileActions',
    'ImageCarousel',
    'PersonalInformation',
    'SocialMediaLinks',
    'ProfessionalInformation',
    'Experience',
    'SkillsUserProfile',
    'VideoGallery'
  ];

  const [cardOrder, setCardOrder] = useState<string[]>(initialCardOrder);
  const [columnCount, setColumnCount] = useState<number>(() => {
    const saved = localStorage.getItem('columnCount');
    return saved ? Number(saved) : 3;
  });
  const [cardSpans, setCardSpans] = useState<Record<string, number>>(() => {
    const saved = localStorage.getItem('cardSpans');
    return saved
      ? JSON.parse(saved)
      : {
          ProfileHeader: 1,
          ProfileActions: 1,
          ImageCarousel: 1,
          PersonalInformation: 1,
          SocialMediaLinks: 1,
          ProfessionalInformation: 1,
          Experience: 1,
          SkillsUserProfile: 1,
          VideoGallery: 1
        };
  });

  const profession = localStorage.getItem('userProfession') || location.state?.profession;

  useEffect(() => {
    if (userId) {
      dispatch(getUserById(userId));
    }
  }, [dispatch, userId]);

  useEffect(() => {
    if (user) {
      dispatch(getThemeStatus({ userId: user._id, profession: profession || 'No Profession' }));
    }
  }, [user, dispatch, profession]);

  useEffect(() => {
    if (themeStatus) {
      applyTheme(themeStatus);
    }
  }, [themeStatus]);

  const applyTheme = useCallback((themeStatus: ThemeStatus) => {
    if (themeStatus.theme_enabled) {
      loadTheme(themeStatus.theme);
    } else {
      removeTheme();
    }
  }, []);

  const loadTheme = useCallback((theme: string) => {
    removeTheme();
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = `/themes/${theme}.css?${new Date().getTime()}`;
    document.head.appendChild(link);
    setThemeLink(link);
  }, []);

  const removeTheme = useCallback(() => {
    const themeLinks = document.querySelectorAll('link[href*="/themes/"]');
    themeLinks.forEach((link) => link.parentNode?.removeChild(link));
    setThemeLink(null);
  }, []);

  const toggleTheme = useCallback(async () => {
    if (userId && user) {
      await dispatch(changeThemeStatus({ userId, profession: profession || 'No Profession' }));
      await dispatch(
        getThemeStatus({ userId: user._id, profession: profession || 'No Profession' })
      );
      setKey((prevKey) => prevKey + 1);
    }
  }, [userId, user, profession, dispatch]);

  useEffect(() => {
    return () => {
      removeTheme();
    };
  }, [removeTheme]);

  useEffect(() => {
    localStorage.setItem('columnCount', columnCount.toString());
    localStorage.setItem('cardSpans', JSON.stringify(cardSpans));
  }, [columnCount, cardSpans]);

  const handleEditProfile = useCallback(() => {
    navigate('/profile-edit-user/personal-info');
  }, [navigate]);

  const openModal = useCallback((index: number) => {
    setModalImageIndex(index);
    setIsModalOpen(true);
  }, []);

  const closeModal = useCallback(() => {
    setIsModalOpen(false);
  }, []);

  if (!user) {
    return <div className="loading-container">Chargement...</div>;
  }

  const socialMediaLinks = user.socialMediaLinks || [];

  const renderComponent = (cardId: string): JSX.Element | null => {
    switch (cardId) {
      case 'ProfileHeader':
        return <ProfileHeader user={user} />;
      case 'ProfileActions':
        return (
          <ProfileActions
            themeEnabled={themeStatus.theme_enabled}
            toggleTheme={toggleTheme}
            showEditButton={authUser?._id === user._id}
            handleEditProfile={handleEditProfile}
          />
        );
      case 'ImageCarousel':
        return user.images && user.images.length > 0 ? (
          <ImageCarousel images={user.images} openModal={openModal} />
        ) : null;
      case 'PersonalInformation':
        return <PersonalInformation user={user} />;
      case 'SocialMediaLinks':
        return socialMediaLinks.length > 0 ? (
          <SocialMediaLinks socialMediaLinks={socialMediaLinks} />
        ) : null;
      case 'ProfessionalInformation':
        return <ProfessionalInformation user={user} />;
      case 'Experience':
        return user.experience && user.experience.length > 0 ? (
          <Experience experience={user.experience} />
        ) : null;
      case 'SkillsUserProfile':
        return user.skills && user.skills.length > 0 ? (
          <SkillsUserProfile skills={user.skills} />
        ) : null;
      case 'VideoGallery':
        return user.videos && user.videos.length > 0 ? <VideoGallery videos={user.videos} /> : null;
      default:
        return null;
    }
  };

  const handleColumnCountChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setColumnCount(Number(e.target.value));
  };

  const handleCardSpanChange = (cardId: string, span: number) => {
    setCardSpans((prev) => ({ ...prev, [cardId]: span }));
  };

  return (
    <div key={key} className="user-profile-container">
      {isDragEnabled && !isFinalView && (
        <div className="layout-controls">
          <label htmlFor="column-count">Nombre de colonnes : </label>
          <select id="column-count" value={columnCount} onChange={handleColumnCountChange}>
            {[1, 2, 3, 4, 5].map((count) => (
              <option key={count} value={count}>
                {count} {count === 1 ? 'Colonne' : 'Colonnes'}
              </option>
            ))}
          </select>
        </div>
      )}

      {isDragEnabled && !isFinalView && (
        <DragAndDrop
          items={cardOrder}
          cardSpans={cardSpans}
          columnCount={columnCount}
          renderComponent={renderComponent}
          setCardOrder={setCardOrder}
          handleCardSpanChange={handleCardSpanChange}
        />
      )}

      {(!isDragEnabled || isFinalView) && (
        <div
          className="userProfile-grid"
          style={{ gridTemplateColumns: `repeat(${columnCount}, 1fr)` }}
        >
          {cardOrder.map((cardId) => {
            const component = renderComponent(cardId);
            if (!component) return null;

            return (
              <div
                key={cardId}
                className={`userProfile-card`}
                style={{ gridColumn: `span ${cardSpans[cardId]}` }}
              >
                <div className="userProfile-card-body">{component}</div>
              </div>
            );
          })}
        </div>
      )}

      {user.images && (
        <ModalUserProfile
          images={user.images}
          currentIndex={modalImageIndex}
          isOpen={isModalOpen}
          onClose={closeModal}
          onNext={() => setModalImageIndex((prevIndex) => (prevIndex + 1) % user.images!.length)}
          onPrev={() =>
            setModalImageIndex(
              (prevIndex) => (prevIndex - 1 + user.images!.length) % user.images!.length
            )
          }
        />
      )}
    </div>
  );
};

export default React.memo(UserProfile);
