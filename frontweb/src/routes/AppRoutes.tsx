import React, { useEffect, useState, useCallback } from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation,
  useNavigate
} from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../redux/store';
import Home from '../pages/Home/Home';
import About from '../pages/About/About';
import LoginComponent from '../pages/LoginPages/LoginComponent';
import RegisterComponent from '../pages/ProfileSection/RegisterPages/RegisterComponent';
import PasswordResetComponent from '../pages/PasswordReset/PasswordReset/PasswordResetComponent';
import Navbar from '../components/NavbarGlobal/NavbarGlobal';
import VerifyEmailComponent from '../components/VerifyEmail/EmailVerificationComponent';
import PasswordResetRequestComponent from '../pages/PasswordReset/PasswordRequest/PasswordResetRequestComponent';
import PersonalInfo from '../pages/ProfileSection/ProfileEditUser/ProfileScreen/PersonalInfo/PersonalInfo';
import AddressInfo from '../pages/ProfileSection/ProfileEditUser/ProfileScreen/AddressInfo/AddressInfo';
import ProfessionInfo from '../pages/ProfileSection/ProfileEditUser/ProfileScreen/ProfessionInfo/ProfessionInfo';
import BioSkillsInfo from '../pages/ProfileSection/ProfileEditUser/ProfileScreen/BioSkillsInfo/BioSkillsInfo';
import RoleSelection from '../pages/ProfileSection/RoleSelection/RoleSelection';
import ProfileEditRecruits from '../pages/ProfileSection/ProfileEditRecruits/ProfileEditRecruits';
import RecruitAddressInfo from '../pages/ProfileSection/ProfileEditRecruits/AddressInfo/AddressInfo';
import RecruitCompanyInfo from '../pages/ProfileSection/ProfileEditRecruits/CompanyInfo/CompanyInfo';
import RecruitContactInfo from '../pages/ProfileSection/ProfileEditRecruits/ContactInfo/ContactInfo';
import RecruitOtherInfo from '../pages/ProfileSection/ProfileEditRecruits/OtherInfo/OtherInfo';
import RecruitSocialMediaInfo from '../pages/ProfileSection/ProfileEditRecruits/SocialMediaInfo/SocialMediaInfo';
import UserProfile from '../pages/ProfileSection/UserProfile/UserProfile';
import PublicUserProfile from '../pages/ProfileSection/PublicUserProfile/PublicUserProfile';
import Portfolio from '../pages/Portfolio/Portfolio';
import AboutSection from '../pages/Portfolio/About/About';
import ProfileSection from '../pages/Portfolio/PortfolioProfile/PortfolioProfile';
import SkillsSection from '../pages/Portfolio/Skills/Skills';
import BioSection from '../pages/Portfolio/Bio/Bio';
import ContactSection from '../pages/Portfolio/Contact/Contact';
import Notifications from '../components/Notifications/Notifications';
import Members from '../pages/Members/Members';
import { getCompanies } from '../redux/features/company/companySlice';
import { getThemeStatus, changeThemeStatus } from '../redux/features/theme/thunks/themeThunk';
import FooterGlobal from '../components/FooterGlobal/FooterGlobal';
import SkillDevelopment from '../pages/Home/SkillDevelopment/SkillDevelopment';
import CreateActivity from '../pages/activities/CreateActivity/CreateActivity';
import ActivityList from '../pages/activities/ActivityList/ActivityList';
import ActivityDetail from '../pages/activities/ActivityDetail/ActivityDetail';
import SearchSite from '../components/SearchDropdown/SearchSite/SearchSite';
import SearchJobs from '../components/SearchDropdown/SearchJobs/SearchJobs';
import SearchActivities from '../components/SearchDropdown/SearchActivities/SearchActivities';
import SearchMembers from '../components/SearchDropdown/SearchMembers/SearchMembers';
import { FaArrowsAltH, FaPencilAlt, FaEye, FaToggleOn, FaToggleOff } from 'react-icons/fa';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../App.css';
import '../index.css';
import './AppRoutes.css';

import ImageScreen from '../pages/ProfileSection/ProfileEditUser/ProfileScreen/MediaInfo/ImageScreen/ImageScreen';
import VideoScreen from '../pages/ProfileSection/ProfileEditUser/ProfileScreen/MediaInfo/VideoScreen/VideoScreen';

const AppRoutes: React.FC = () => {
  const user = useSelector((state: RootState) => state.auth.user);
  const status = useSelector((state: RootState) => state.company.status);
  const themeStatus = useSelector((state: RootState) => state.theme.themeStatus);
  const dispatch = useDispatch<AppDispatch>();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (status === 'idle' && user) {
      dispatch(getCompanies());
    }
  }, [dispatch, status, user]);

  const isPortfolioPage = location.pathname.includes('/portfolio');

  const [isDragEnabled, setIsDragEnabled] = useState(true);
  const [isFinalView, setIsFinalView] = useState(false);

  const toggleDragAndDrop = () => {
    setIsDragEnabled((prev) => !prev);
  };

  const toggleFinalView = () => {
    setIsFinalView((prev) => !prev);
  };

  const handleEditProfile = useCallback(() => {
    console.log('Navigating to edit profile');
    navigate('/profile-edit-user/personal-info');
  }, [navigate]);

  const toggleTheme = useCallback(() => {
    if (user) {
      const isCurrentlyEnabled = themeStatus.theme_enabled;
      console.log(`Current theme state: ${isCurrentlyEnabled ? 'Enabled' : 'Disabled'}`);

      dispatch(
        changeThemeStatus({ userId: user._id, profession: user.profession || 'No Profession' })
      )
        .then(() => {
          dispatch(
            getThemeStatus({ userId: user._id, profession: user.profession || 'No Profession' })
          );

          const newThemeState = !isCurrentlyEnabled;
          console.log(`Theme ${newThemeState ? 'Enabled' : 'Disabled'} successfully`);
        })
        .catch((error) => {
          console.error('Failed to toggle theme:', error);
        });
    }
  }, [dispatch, user, themeStatus]);

  return (
    <>
      <Navbar />
      <div className="AppRoutes-mainContent">
        {location.pathname.startsWith('/user-profile') && (
          <div className="AppRoutes-controls">
            <button
              onClick={toggleDragAndDrop}
              aria-label={isDragEnabled ? 'Disable Drag and Drop' : 'Enable Drag and Drop'}
            >
              <FaArrowsAltH size={20} />
              {isDragEnabled ? 'Disable Drag' : 'Enable Drag'}
            </button>
            <button
              onClick={toggleFinalView}
              aria-label={isFinalView ? 'Edit Profile Layout' : 'View Final Profile'}
            >
              {isFinalView ? <FaPencilAlt size={20} /> : <FaEye size={20} />}
              {isFinalView ? 'Edit Profile Layout' : 'View Final Profile'}
            </button>
            <button
              onClick={toggleTheme}
              aria-label={themeStatus.theme_enabled ? 'Disable Theme' : 'Enable Theme'}
              className="theme-toggle-button"
            >
              {themeStatus.theme_enabled ? <FaToggleOff size={20} /> : <FaToggleOn size={20} />}
              {themeStatus.theme_enabled ? 'Disable Theme' : 'Enable Theme'}
            </button>
            {user && (
              <button onClick={handleEditProfile} className="edit-profile-button">
                <FaPencilAlt size={20} />
                Edit My Profile
              </button>
            )}
          </div>
        )}

        <div className="AppRoutes-pageContent">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/login" element={!user ? <LoginComponent /> : <Navigate to="/" />} />
            <Route path="/register" element={!user ? <RegisterComponent /> : <Navigate to="/" />} />
            <Route path="/password-reset" element={<PasswordResetComponent />} />
            <Route path="/verify-email" element={<VerifyEmailComponent />} />
            <Route path="/password-request-reset" element={<PasswordResetRequestComponent />} />
            <Route
              path="/profile-edit-user/personal-info"
              element={user ? <PersonalInfo /> : <Navigate to="/login" />}
            />
            <Route
              path="/profile-edit-user/address-info"
              element={user ? <AddressInfo /> : <Navigate to="/login" />}
            />
            <Route
              path="/profile-edit-user/profession-info"
              element={user ? <ProfessionInfo /> : <Navigate to="/login" />}
            />
            <Route
              path="/profile-edit-user/bio-skills-info"
              element={user ? <BioSkillsInfo /> : <Navigate to="/login" />}
            />
            <Route
              path="/role-selection"
              element={user ? <RoleSelection /> : <Navigate to="/login" />}
            />
            <Route path="/edit-recruit/new/company-info" element={<RecruitCompanyInfo isNew />} />
            <Route path="/edit-recruit/:companyId/company-info" element={<RecruitCompanyInfo />} />
            <Route path="/edit-recruit/:companyId/address-info" element={<RecruitAddressInfo />} />
            <Route path="/edit-recruit/:companyId/contact-info" element={<RecruitContactInfo />} />
            <Route path="/edit-recruit/:companyId/other-info" element={<RecruitOtherInfo />} />
            <Route
              path="/edit-recruit/:companyId/social-media-info"
              element={<RecruitSocialMediaInfo />}
            />
            <Route
              path="/profile-edit-recruiter"
              element={user ? <ProfileEditRecruits /> : <Navigate to="/login" />}
            />
            <Route
              path="/user-profile/:userId"
              element={
                user ? (
                  <UserProfile isDragEnabled={isDragEnabled} isFinalView={isFinalView} />
                ) : (
                  <Navigate to="/login" />
                )
              }
            />
            <Route
              path="/notifications"
              element={user ? <Notifications /> : <Navigate to="/login" />}
            />
            <Route path="/public-profile/:userId" element={<PublicUserProfile />} />
            <Route path="/portfolio/:slug/*" element={<Portfolio />}>
              <Route index element={<Navigate to="about" replace />} />
              <Route path="about" element={<AboutSection />} />
              <Route path="profile" element={<ProfileSection />} />
              <Route path="skills" element={<SkillsSection />} />
              <Route path="bio" element={<BioSection />} />
              <Route path="contact" element={<ContactSection />} />
            </Route>
            <Route path="/members" element={user ? <Members /> : <Navigate to="/login" />} />
            <Route path="/skill-development" element={<SkillDevelopment />} />
            <Route path="/activities" element={<ActivityList />} />
            <Route path="/create-activity" element={<CreateActivity />} />
            <Route path="/activities/:id" element={<ActivityDetail />} />
            <Route path="/search-site" element={<SearchSite />} />
            <Route path="/search-jobs" element={<SearchJobs />} />
            <Route path="/search-activities" element={<SearchActivities />} />
            <Route path="/search-members" element={<SearchMembers />} />
            <Route
              path="/media-info/images"
              element={user ? <ImageScreen /> : <Navigate to="/login" />}
            />
            <Route
              path="/media-info/videos"
              element={user ? <VideoScreen /> : <Navigate to="/login" />}
            />
            <Route
              path="/profile-edit-user/image"
              element={user ? <ImageScreen /> : <Navigate to="/login" />}
            />
          </Routes>
        </div>
      </div>
      {!isPortfolioPage && <FooterGlobal />}
    </>
  );
};

export default AppRoutes;
