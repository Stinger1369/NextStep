import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "../pages/Home/Home";
import About from "../pages/About/About";
import LoginComponent from "../pages/LoginPages/LoginComponent";
import RegisterComponent from "../pages/RegisterPages/RegisterComponent";
import PasswordResetComponent from "../pages/PasswordReset/PasswordReset/PasswordResetComponent";
import JobOffers from "../pages/JobOffers/JobOffers";
import Navbar from "../components/Navbar/Navbar";
import ProfileEditUser from "../pages/ProfileSection/ProfileEditUser/ProfileEditUser";
import ProfileEditRecruiter from "../pages/ProfileSection/ProfileEditRecruits/ProfileEditRecruits";
import VerifyEmailComponent from "../components/VerifyEmail/EmailVerificationComponent";
import PasswordResetRequestComponent from "../pages/PasswordReset/PasswordRequest/PasswordResetRequestComponent";
import PersonalInfo from "../pages/ProfileSection/ProfileEditUser/ProfileScreen/PersonalInfo/PersonalInfo";
import AddressInfo from "../pages/ProfileSection/ProfileEditUser/ProfileScreen/AddressInfo/AddressInfo";
import ProfessionInfo from "../pages/ProfileSection/ProfileEditUser/ProfileScreen/ProfessionInfo/ProfessionInfo";
import BioSkillsInfo from "../pages/ProfileSection/ProfileEditUser/ProfileScreen/BioSkillsInfo/BioSkillsInfo";
import MediaInfo from "../pages/ProfileSection/ProfileEditUser/ProfileScreen/MediaInfo/MediaInfo";
import RoleSelection from "../pages/ProfileSection/RoleSelection/RoleSelection";

const AppRoutes: React.FC = () => {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/login" element={<LoginComponent />} />
        <Route path="/register" element={<RegisterComponent />} />
        <Route path="/password-reset" element={<PasswordResetComponent />} />
        <Route path="/job-offers" element={<JobOffers />} />
        <Route path="/profile-edit-user" element={<ProfileEditUser />} />
        <Route
          path="/profile-edit-recruiter"
          element={<ProfileEditRecruiter />}
        />
        <Route path="/verify-email" element={<VerifyEmailComponent />} />
        <Route
          path="/password-request-reset"
          element={<PasswordResetRequestComponent />}
        />
        <Route
          path="/profile-edit-user/personal-info"
          element={<PersonalInfo />}
        />
        <Route
          path="/profile-edit-user/address-info"
          element={<AddressInfo />}
        />
        <Route
          path="/profile-edit-user/profession-info"
          element={<ProfessionInfo />}
        />
        <Route
          path="/profile-edit-user/bio-skills-info"
          element={<BioSkillsInfo />}
        />
        <Route path="/profile-edit-user/media-info" element={<MediaInfo />} />
        <Route path="/role-selection" element={<RoleSelection />} />
      </Routes>
    </Router>
  );
};

export default AppRoutes;
