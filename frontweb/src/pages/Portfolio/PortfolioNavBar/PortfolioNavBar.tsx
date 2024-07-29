import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import './PortfolioNavBar.css'; // Import du fichier CSS

const PortfolioNavBar: React.FC = () => {
  const location = useLocation();

  const isActive = (path: string) => location.pathname.includes(path);

  return (
    <nav className="portfolio-navbar navbar navbar-expand navbar-light bg-light">
      <div className="container-fluid">
        <div className="navbar-collapse" id="navbarNav">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <Link to="about" className={`nav-link ${isActive('about') ? 'active' : ''}`}>
                About
              </Link>
            </li>
            <li className="nav-item">
              <Link to="profile" className={`nav-link ${isActive('profile') ? 'active' : ''}`}>
                Profile
              </Link>
            </li>
            <li className="nav-item">
              <Link to="skills" className={`nav-link ${isActive('skills') ? 'active' : ''}`}>
                Skills
              </Link>
            </li>
            <li className="nav-item">
              <Link to="bio" className={`nav-link ${isActive('bio') ? 'active' : ''}`}>
                Bio
              </Link>
            </li>
            <li className="nav-item">
              <Link to="contact" className={`nav-link ${isActive('contact') ? 'active' : ''}`}>
                Contact
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default PortfolioNavBar;
