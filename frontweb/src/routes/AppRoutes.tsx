import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "../pages/Home/Home";
import About from "../pages/About/About";
import LoginComponent from "../pages/LoginPages/LoginComponent";
import RegisterComponent from "../pages/RegisterPages/RegisterComponent";
import PasswordResetComponent from "../pages/PasswordReset/PasswordResetComponent";
import JobOffers from "../pages/JobOffers/JobOffers";
import Navbar from "../components/Navbar/Navbar";
import ProfileEdit from "../pages/ProfileSection/ProfileEdit/ProfileEdit"; // Importer ProfileEdit

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
        <Route path="/profile-edit" element={<ProfileEdit />} />{" "}
        {/* Ajouter la route pour ProfileEdit */}
      </Routes>
    </Router>
  );
};

export default AppRoutes;
