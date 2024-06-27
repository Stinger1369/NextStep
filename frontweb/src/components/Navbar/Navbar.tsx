// src/components/Navbar/Navbar.tsx
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  FaHome,
  FaInfoCircle,
  FaUser,
  FaUserPlus,
  FaSignOutAlt,
  FaBriefcase
} from 'react-icons/fa';
import logo from '../../assests/Images/nextstep.webp';
import { RootState, AppDispatch } from '../../redux/store';
import { performLogout } from '../../redux/features/auth/authLogout';
import './NavBar.css';

const Navbar: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const user = useSelector((state: RootState) => state.auth.user);

  const handleLogout = async () => {
    await dispatch(performLogout());
    navigate('/'); // Redirection vers la page d'accueil après la déconnexion
  };

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <Link to="/">
          <img src={logo} alt="Next Step Logo" className="navbar-logo" />
        </Link>
      </div>
      <ul className="navbar-links">
        <li>
          <Link to="/">
            <FaHome /> Home
          </Link>
        </li>
        <li>
          <Link to="/about">
            <FaInfoCircle /> About
          </Link>
        </li>
        <li>
          <Link to="/job-offers">
            <FaBriefcase /> Job Offers
          </Link>
        </li>
      </ul>
      <div className="navbar-separator"></div>
      <ul className="navbar-links navbar-auth">
        {!user ? (
          <>
            <li>
              <Link to="/login">
                <FaUser /> Login
              </Link>
            </li>
            <li>
              <Link to="/register">
                <FaUserPlus /> Register
              </Link>
            </li>
          </>
        ) : (
          <li className="navbar-user">
            <span>Welcome, {user.firstName ? user.firstName : user.emailOrPhone}!</span>
            <div className="navbar-dropdown">
              <button onClick={handleLogout}>
                <FaSignOutAlt /> Logout
              </button>
            </div>
          </li>
        )}
      </ul>
      <div className="navbar-search">
        <input type="text" placeholder="Search..." />
        <button type="submit">Go</button>
      </div>
    </nav>
  );
};

export default Navbar;
