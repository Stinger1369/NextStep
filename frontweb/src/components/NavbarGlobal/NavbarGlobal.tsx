import React, { useState, useEffect, useRef, RefObject } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { FaHome, FaInfoCircle, FaUser, FaUserPlus, FaSignOutAlt, FaBriefcase, FaUserCircle, FaUsers, FaBell, FaCaretDown, FaBars } from 'react-icons/fa';
import logo from '../../assests/Images/nextstep.webp';
import { RootState, AppDispatch } from '../../redux/store';
import { performLogout } from '../../redux/features/auth/authLogout';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';
import SearchDropdown from '../SearchDropdown/SearchDropdown';
import './NavbarGlobal.css';

const NavbarGlobal: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const user = useSelector((state: RootState) => state.auth.user);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef: RefObject<HTMLDivElement> = useRef(null);

  const handleLogout = async () => {
    await dispatch(performLogout());
    navigate('/');
  };

  const handleProfileClick = () => {
    if (user && (!user.firstName || !user.lastName)) {
      navigate('/profile-edit-user/personal-info');
    } else if (user && user._id) {
      navigate(`/user-profile/${user._id}`);
    }
  };

  const handlePortfolioClick = () => {
    if (user && user.firstName && user.lastName) {
      const slug = `${user.firstName.toLowerCase()}-${user.lastName.toLowerCase()}`;
      navigate(`/portfolio/${slug}`);
    } else if (user && user._id) {
      navigate(`/portfolio/${user._id}`);
    }
  };

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
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
    <nav className="navbar navbar-expand-lg navbar-light bg-light NavbarGlobal">
      <div className="container-fluid NavbarGlobal-container">
        <Link to="/" className="navbar-brand NavbarGlobal-brand">
          <img src={logo} alt="Next Step Logo" className="NavbarGlobal-logo" />
        </Link>
        <div className="d-flex align-items-center order-lg-2 NavbarGlobal-icons">
          <SearchDropdown />
          {!user ? (
            <>
              <Link to="/login" className="nav-link NavbarGlobal-nav-link">
                <FaUser /> Login
              </Link>
              <Link to="/register" className="nav-link NavbarGlobal-nav-link">
                <FaUserPlus /> Register
              </Link>
            </>
          ) : (
            <div className="nav-item dropdown NavbarGlobal-dropdown" ref={dropdownRef}>
              <button className="btn nav-link dropdown-toggle NavbarGlobal-dropdown-toggle" id="navbarDropdown" aria-expanded={dropdownOpen} onClick={toggleDropdown}>
                <FaUserCircle /> My Account <FaCaretDown />
              </button>
              <ul className={`dropdown-menu NavbarGlobal-dropdown-menu${dropdownOpen ? ' show' : ''}`} aria-labelledby="navbarDropdown">
                <li>
                  <button className="dropdown-item NavbarGlobal-dropdown-item" onClick={handleProfileClick}>
                    Profile
                  </button>
                </li>
                <li>
                  <button className="dropdown-item NavbarGlobal-dropdown-item" onClick={handlePortfolioClick}>
                    Portfolio
                  </button>
                </li>
                <li>
                  <hr className="dropdown-divider NavbarGlobal-dropdown-divider" />
                </li>
                <li>
                  <button className="dropdown-item NavbarGlobal-dropdown-item" onClick={handleLogout}>
                    <FaSignOutAlt /> Logout
                  </button>
                </li>
              </ul>
            </div>
          )}
          <button
            className="navbar-toggler NavbarGlobal-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNav"
            aria-controls="navbarNav"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <FaBars />
          </button>
        </div>
        <div className="collapse navbar-collapse order-lg-1 NavbarGlobal-collapse" id="navbarNav">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0 NavbarGlobal-nav">
            <li className="nav-item NavbarGlobal-nav-item">
              <Link to="/" className="nav-link NavbarGlobal-nav-link">
                <FaHome /> Home
              </Link>
            </li>
            <li className="nav-item NavbarGlobal-nav-item">
              <Link to="/about" className="nav-link NavbarGlobal-nav-link">
                <FaInfoCircle /> About
              </Link>
            </li>
            <li className="nav-item NavbarGlobal-nav-item">
              <Link to="/job-offers" className="nav-link NavbarGlobal-nav-link">
                <FaBriefcase /> Job Offers
              </Link>
            </li>
            <li className="nav-item NavbarGlobal-nav-item">
              <Link to="/members" className="nav-link NavbarGlobal-nav-link">
                <FaUsers /> Members
              </Link>
            </li>
            <li className="nav-item NavbarGlobal-nav-item">
              <Link to="/notifications" className="nav-link NavbarGlobal-nav-link">
                <FaBell /> Notifications
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default NavbarGlobal;
