import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Home from '../pages/Home/Home';
import About from '../pages/About/About';
import LoginComponent from '../pages/LoginPages/LoginComponent';
import RegisterComponent from '../pages/RegisterPages/RegisterComponent';
import PasswordResetComponent from '../pages/PasswordReset/PasswordReset/PasswordResetComponent';
import JobOffers from '../pages/JobOffers/JobOffers';
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
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../redux/store';
import { getCompanies } from '../redux/features/company/companySlice';
import { useEffect } from 'react';
const AppRoutes: React.FC = () => {
  const user = useSelector((state: RootState) => state.auth.user);
  const status = useSelector((state: RootState) => state.company.status);
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    if (status === 'idle') {
      dispatch(getCompanies());
    }
  }, [dispatch, status]);

  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/login" element={!user ? <LoginComponent /> : <Navigate to="/" />} />
        <Route path="/register" element={!user ? <RegisterComponent /> : <Navigate to="/" />} />
        <Route path="/password-reset" element={<PasswordResetComponent />} />
        <Route path="/job-offers" element={<JobOffers />} />
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
        <Route path="/user-profile" element={user ? <UserProfile /> : <Navigate to="/login" />} />
        <Route path="/public-profile/:userId" element={<PublicUserProfile />} />
      </Routes>
    </Router>
  );
};

export default AppRoutes;
