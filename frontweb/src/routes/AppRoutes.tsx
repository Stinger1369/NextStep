// src/routes/AppRoutes.tsx

import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import Home from '../pages/Home/Home';
import About from '../pages/About/About';
import LoginComponent from '../pages/LoginPages/LoginComponent';
import RegisterComponent from '../pages/RegisterPages/RegisterComponent';
import PasswordResetComponent from '../pages/PasswordReset/PasswordReset/PasswordResetComponent';
import Navbar from '../components/Navbar/Navbar';
import VerifyEmailComponent from '../components/VerifyEmail/EmailVerificationComponent';
import PasswordResetRequestComponent from '../pages/PasswordReset/PasswordRequest/PasswordResetRequestComponent';
import PersonalInfo from '../pages/ProfileSection/ProfileEditUser/ProfileScreen/PersonalInfo/PersonalInfo';
import AddressInfo from '../pages/ProfileSection/ProfileEditUser/ProfileScreen/AddressInfo/AddressInfo';
import ProfessionInfo from '../pages/ProfileSection/ProfileEditUser/ProfileScreen/ProfessionInfo/ProfessionInfo';
import BioSkillsInfo from '../pages/ProfileSection/ProfileEditUser/ProfileScreen/BioSkillsInfo/BioSkillsInfo';
import MediaInfo from '../pages/ProfileSection/ProfileEditUser/ProfileScreen/MediaInfo/MediaInfo';
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
import ProfileSection from '../pages/Portfolio/Profile/Profile';
import SkillsSection from '../pages/Portfolio/Skills/Skills';
import BioSection from '../pages/Portfolio/Bio/Bio';
import ContactSection from '../pages/Portfolio/Contact/Contact';
import Notifications from '../components/Notifications/Notifications';
import Members from '../pages/Members/Members';
import { RootState, AppDispatch } from '../redux/store';
import { getCompanies } from '../redux/features/company/companySlice';
import FooterGlobal from '../components/FooterGlobal/FooterGlobal';
import SkillDevelopment from '../pages/Home/SkillDevelopment/SkillDevelopment';
import CreateActivity from '../pages/activities/CreateActivity/CreateActivity'; // Import CreateActivity
import ActivityList from '../pages/activities/ActivityList/ActivityList'; // Import ActivityList
import ActivityDetail from '../pages/activities/ActivityDetail/ActivityDetail'; // Import ActivityDetail
import '../App.css';
import '../index.css';

const AppRoutes: React.FC = () => {
  const user = useSelector((state: RootState) => state.auth.user);
  const status = useSelector((state: RootState) => state.company.status);
  const dispatch = useDispatch<AppDispatch>();
  const location = useLocation();

  useEffect(() => {
    if (status === 'idle' && user) {
      dispatch(getCompanies());
    }
  }, [dispatch, status, user]);

  const isPortfolioPage = location.pathname.includes('/portfolio');

  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/login" element={!user ? <LoginComponent /> : <Navigate to="/" />} />
        <Route path="/register" element={!user ? <RegisterComponent /> : <Navigate to="/" />} />
        <Route path="/password-reset" element={<PasswordResetComponent />} />
        <Route path="/verify-email" element={<VerifyEmailComponent />} />
        <Route path="/password-request-reset" element={<PasswordResetRequestComponent />} />
        <Route path="/profile-edit-user/personal-info" element={user ? <PersonalInfo /> : <Navigate to="/login" />} />
        <Route path="/profile-edit-user/address-info" element={user ? <AddressInfo /> : <Navigate to="/login" />} />
        <Route path="/profile-edit-user/profession-info" element={user ? <ProfessionInfo /> : <Navigate to="/login" />} />
        <Route path="/profile-edit-user/bio-skills-info" element={user ? <BioSkillsInfo /> : <Navigate to="/login" />} />
        <Route path="/profile-edit-user/media-info" element={user ? <MediaInfo /> : <Navigate to="/login" />} />
        <Route path="/role-selection" element={user ? <RoleSelection /> : <Navigate to="/login" />} />
        <Route path="/edit-recruit/new/company-info" element={<RecruitCompanyInfo isNew />} />
        <Route path="/edit-recruit/:companyId/company-info" element={<RecruitCompanyInfo />} />
        <Route path="/edit-recruit/:companyId/address-info" element={<RecruitAddressInfo />} />
        <Route path="/edit-recruit/:companyId/contact-info" element={<RecruitContactInfo />} />
        <Route path="/edit-recruit/:companyId/other-info" element={<RecruitOtherInfo />} />
        <Route path="/edit-recruit/:companyId/social-media-info" element={<RecruitSocialMediaInfo />} />
        <Route path="/profile-edit-recruiter" element={user ? <ProfileEditRecruits /> : <Navigate to="/login" />} />
        <Route path="/user-profile/:userId" element={user ? <UserProfile /> : <Navigate to="/login" />} />
        <Route path="/notifications" element={user ? <Notifications /> : <Navigate to="/login" />} />
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
      </Routes>
      {!isPortfolioPage && <FooterGlobal />}
    </>
  );
};

export default AppRoutes;
