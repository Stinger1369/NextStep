// src/components/Navbar/Navbar.tsx

import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { FaHome, FaInfoCircle, FaUser, FaUserPlus, FaSignOutAlt, FaBriefcase, FaUserCircle, FaUsers, FaBell, FaCalendarAlt } from 'react-icons/fa';
import logo from '../../assests/Images/nextstep.webp';
import { RootState, AppDispatch } from '../../redux/store';
import { performLogout } from '../../redux/features/auth/authLogout';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';
import './NavBar.css';

const Navbar: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const user = useSelector((state: RootState) => state.auth.user);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [navbarOpen, setNavbarOpen] = useState(false);
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLLIElement>(null);

  useEffect(() => {
    if (user?.images && user.images.length > 0) {
      setProfileImage(user.images[0]);
    }
  }, [user]);

  const handleLogout = async () => {
    await dispatch(performLogout());
    navigate('/');
    setNavbarOpen(false);
  };

  const handleProfileClick = () => {
    if (user && (!user.firstName || !user.lastName)) {
      navigate('/profile-edit-user/personal-info');
    } else if (user && user._id) {
      navigate(`/user-profile/${user._id}`);
    }
    setNavbarOpen(false);
  };

  const handlePortfolioClick = () => {
    if (user && user.firstName && user.lastName) {
      const slug = `${user.firstName.toLowerCase()}-${user.lastName.toLowerCase()}`;
      navigate(`/portfolio/${slug}`);
    } else if (user && user._id) {
      navigate(`/portfolio/${user._id}`);
    }
    setNavbarOpen(false);
  };

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const toggleNavbar = () => {
    setNavbarOpen(!navbarOpen);
  };

  const handleClickOutside = (event: MouseEvent) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
      setDropdownOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light">
      <div className="container-fluid">
        <Link to="/" className="navbar-brand">
          <img src={logo} alt="Next Step Logo" className="navbar-logo" />
        </Link>
        <button className="navbar-toggler" type="button" onClick={toggleNavbar} aria-controls="navbarNav" aria-expanded={navbarOpen} aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className={`collapse navbar-collapse ${navbarOpen ? 'show' : ''}`} id="navbarNav">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <Link to="/" className="nav-link" onClick={() => setNavbarOpen(false)}>
                <FaHome /> Home
              </Link>
            </li>
            <li className="nav-item">
              <Link to="/about" className="nav-link" onClick={() => setNavbarOpen(false)}>
                <FaInfoCircle /> About
              </Link>
            </li>
            <li className="nav-item">
              <Link to="/job-offers" className="nav-link" onClick={() => setNavbarOpen(false)}>
                <FaBriefcase /> Job Offers
              </Link>
            </li>
            {user && (
              <>
                <li className="nav-item">
                  <Link to="/members" className="nav-link" onClick={() => setNavbarOpen(false)}>
                    <FaUsers /> Members
                  </Link>
                </li>
                <li className="nav-item">
                  <Link to="/notifications" className="nav-link" onClick={() => setNavbarOpen(false)}>
                    <FaBell /> Notifications
                  </Link>
                </li>
                <li className="nav-item">
                  <Link to="/activities" className="nav-link" onClick={() => setNavbarOpen(false)}>
                    <FaCalendarAlt /> Activities
                  </Link>
                </li>
              </>
            )}
          </ul>
          <ul className="navbar-nav ms-auto">
            {!user ? (
              <>
                <li className="nav-item">
                  <Link to="/login" className="nav-link" onClick={() => setNavbarOpen(false)}>
                    <FaUser /> Login
                  </Link>
                </li>
                <li className="nav-item">
                  <Link to="/register" className="nav-link" onClick={() => setNavbarOpen(false)}>
                    <FaUserPlus /> Register
                  </Link>
                </li>
              </>
            ) : (
              <>
                <li className="nav-item dropdown" ref={dropdownRef}>
                  <button className="btn nav-link dropdown-toggle d-flex align-items-center" id="navbarDropdown" aria-expanded={dropdownOpen} onClick={toggleDropdown}>
                    {profileImage ? <img src={profileImage} alt="Profile" className="profile-thumbnail me-1" /> : <FaUser className="me-1" />}
                    {user?.firstName ? `${user.firstName}` : user?.email}
                  </button>
                  <ul className={`dropdown-menu dropdown-menu-end${dropdownOpen ? ' show' : ''}`} aria-labelledby="navbarDropdown">
                    <li>
                      <button className="dropdown-item" onClick={handleProfileClick}>
                        Profile
                      </button>
                    </li>
                    <li>
                      <button className="dropdown-item" onClick={handlePortfolioClick}>
                        Portfolio
                      </button>
                    </li>
                    <li>
                      <hr className="dropdown-divider" />
                    </li>
                    <li>
                      <button className="dropdown-item" onClick={handleLogout}>
                        <FaSignOutAlt /> Logout
                      </button>
                    </li>
                  </ul>
                </li>
              </>
            )}
          </ul>
          <form className="d-flex">
            <input className="form-control me-2" type="search" placeholder="Search" aria-label="Search" />
            <button className="btn btn-outline-success" type="submit" onClick={() => setNavbarOpen(false)}>
              Go
            </button>
          </form>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
