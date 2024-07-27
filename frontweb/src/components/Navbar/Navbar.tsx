import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { FaHome, FaInfoCircle, FaUser, FaUserPlus, FaSignOutAlt, FaBriefcase, FaUserCircle, FaUsers, FaBell, FaCaretDown } from 'react-icons/fa';
import logo from '../../assests/Images/nextstep.webp';
import { RootState, AppDispatch } from '../../redux/store';
import { performLogout } from '../../redux/features/auth/authLogout';
import 'bootstrap/dist/css/bootstrap.min.css';
import './NavBar.css';

const Navbar: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const user = useSelector((state: RootState) => state.auth.user);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLLIElement>(null);

  const handleLogout = async () => {
    await dispatch(performLogout());
    navigate('/'); // Redirection vers la page d'accueil après la déconnexion
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
    <nav className="navbar navbar-expand-lg navbar-light bg-light">
      <div className="container-fluid">
        <Link to="/" className="navbar-brand">
          <img src={logo} alt="Next Step Logo" className="navbar-logo" />
        </Link>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <Link to="/" className="nav-link">
                <FaHome /> Home
              </Link>
            </li>
            <li className="nav-item">
              <Link to="/about" className="nav-link">
                <FaInfoCircle /> About
              </Link>
            </li>
            <li className="nav-item">
              <Link to="/job-offers" className="nav-link">
                <FaBriefcase /> Job Offers
              </Link>
            </li>
            <li className="nav-item">
              <Link to="/members" className="nav-link">
                <FaUsers /> Members
              </Link>
            </li>
            <li className="nav-item">
              <Link to="/notifications" className="nav-link">
                <FaBell /> Notifications
              </Link>
            </li>
          </ul>
          <ul className="navbar-nav">
            {!user ? (
              <>
                <li className="nav-item">
                  <Link to="/login" className="nav-link">
                    <FaUser /> Login
                  </Link>
                </li>
                <li className="nav-item">
                  <Link to="/register" className="nav-link">
                    <FaUserPlus /> Register
                  </Link>
                </li>
              </>
            ) : (
              <>
                <li className="nav-item dropdown" ref={dropdownRef}>
                  <button className="btn nav-link dropdown-toggle" id="navbarDropdown" aria-expanded={dropdownOpen} onClick={toggleDropdown}>
                    <FaUserCircle /> My Account <FaCaretDown />
                  </button>
                  <ul className={`dropdown-menu${dropdownOpen ? ' show' : ''}`} aria-labelledby="navbarDropdown">
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
            <button className="btn btn-outline-success" type="submit">
              Go
            </button>
          </form>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
