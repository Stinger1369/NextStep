import React, { useState, useEffect, useRef, RefObject } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { FaHome, FaInfoCircle, FaUser, FaUserPlus, FaSignOutAlt, FaBriefcase, FaUsers, FaBell, FaCaretDown, FaBars } from 'react-icons/fa';
import { Modal, Button } from 'react-bootstrap';
import logo from '../../assests/Images/nextstep.webp';
import defaultProfilePicture from '../../assests/Images/Profile.png';
import { RootState, AppDispatch } from '../../redux/store';
import { performLogout } from '../../redux/features/auth/authLogout';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';
import SearchDropdown from '../SearchDropdown/SearchDropdown';
import './NavbarGlobal.css';
import Cookies from 'js-cookie';
import LogoutConfirmationModal from '../LogoutConfirmationModal';

interface User {
  _id: string;
  firstName?: string;
  lastName?: string;
  email: string;
  images?: string[];
}

const NavbarGlobal: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const user = useSelector((state: RootState) => state.auth.user) as User | null;
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [cookiesUpdated, setCookiesUpdated] = useState(false); // État local pour surveiller les cookies
  const dropdownRef: RefObject<HTMLDivElement> = useRef(null);
  const menuRef: RefObject<HTMLDivElement> = useRef(null);
  const closeMenuTimeoutRef = useRef<number | null>(null);

  const handleLogout = async (saveData: boolean) => {
    if (saveData && user) {
      Cookies.set('userName', user.firstName || '');
      Cookies.set('userEmail', user.email);
    } else {
      Cookies.remove('userName');
      Cookies.remove('userEmail');
    }
    await dispatch(performLogout());
    setShowLogoutModal(false);
    setCookiesUpdated(!cookiesUpdated); // Met à jour l'état local
    navigate('/');
  };

  const handleProfileClick = () => {
    if (user && (!user.firstName || !user.lastName)) {
      navigate('/profile-edit-user/personal-info');
    } else if (user && user._id) {
      navigate(`/user-profile/${user._id}`);
    }
  };

  const isProfileComplete = (user: User) => {
    return user.firstName !== undefined && user.lastName !== undefined && user.images !== undefined && user.images.length > 0;
  };

  const handlePortfolioClick = () => {
    if (user && isProfileComplete(user)) {
      const slug = `${user.firstName!.toLowerCase()}-${user.lastName!.toLowerCase()}`;
      navigate(`/portfolio/${slug}`);
    } else {
      setShowModal(true);
    }
  };

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const handleClickOutside = (event: MouseEvent) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
      setDropdownOpen(false);
    }
    if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
      setMenuOpen(false);
    }
  };

  const handleMouseEnter = () => {
    if (closeMenuTimeoutRef.current) {
      clearTimeout(closeMenuTimeoutRef.current);
      closeMenuTimeoutRef.current = null;
    }
  };

  const handleMouseLeave = () => {
    closeMenuTimeoutRef.current = window.setTimeout(() => {
      setMenuOpen(false);
    }, 1000);
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      if (closeMenuTimeoutRef.current) {
        clearTimeout(closeMenuTimeoutRef.current);
      }
    };
  }, []);

  const handleCloseModal = () => setShowModal(false);
  const handleCompleteProfile = () => {
    setShowModal(false);
    navigate('/profile-edit-user/personal-info');
  };

  const handleCloseLogoutModal = () => setShowLogoutModal(false);

  const userProfilePicture = user?.images && user.images.length > 0 ? user.images[0] : defaultProfilePicture;

  return (
    <>
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
                  <img src={userProfilePicture} alt="User Profile" className="NavbarGlobal-profile-picture" />
                  {user.firstName ? user.firstName : user.email}
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
                    <button className="dropdown-item NavbarGlobal-dropdown-item" onClick={() => setShowLogoutModal(true)}>
                      <FaSignOutAlt /> Logout
                    </button>
                  </li>
                </ul>
              </div>
            )}
            <button className="navbar-toggler NavbarGlobal-toggler" type="button" aria-controls="navbarNav" aria-expanded={menuOpen} aria-label="Toggle navigation" onClick={toggleMenu}>
              <FaBars />
            </button>
          </div>
          <div
            className={`collapse navbar-collapse order-lg-1 NavbarGlobal-collapse${menuOpen ? ' show' : ''}`}
            id="navbarNav"
            ref={menuRef}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
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
              {user && (
                <>
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
                </>
              )}
            </ul>
          </div>
        </div>
      </nav>

      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>Complete Your Profile</Modal.Title>
        </Modal.Header>
        <Modal.Body>Please complete your profile to access the portfolio. The more complete your profile is, the better your portfolio will be.</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Close
          </Button>
          <Button variant="primary" onClick={handleCompleteProfile}>
            Complete Profile
          </Button>
        </Modal.Footer>
      </Modal>

      <LogoutConfirmationModal show={showLogoutModal} handleClose={handleCloseLogoutModal} handleSave={() => handleLogout(true)} handleDontSave={() => handleLogout(false)} />
    </>
  );
};

export default NavbarGlobal;
