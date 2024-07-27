import React from 'react';
import { Link } from 'react-router-dom';

const PortfolioNavBar: React.FC = () => (
  <nav className="navbar navbar-expand-lg navbar-light bg-light internal-nav">
    <div className="container-fluid">
      <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
        <span className="navbar-toggler-icon"></span>
      </button>
      <div className="collapse navbar-collapse" id="navbarNav">
        <ul className="navbar-nav me-auto mb-2 mb-lg-0">
          <li className="nav-item">
            <Link to="about" className="nav-link">
              About
            </Link>
          </li>
          <li className="nav-item">
            <Link to="profile" className="nav-link">
              Profile
            </Link>
          </li>
          <li className="nav-item">
            <Link to="skills" className="nav-link">
              Skills
            </Link>
          </li>
          <li className="nav-item">
            <Link to="bio" className="nav-link">
              Bio
            </Link>
          </li>
          <li className="nav-item">
            <Link to="contact" className="nav-link">
              Contact
            </Link>
          </li>
        </ul>
      </div>
    </div>
  </nav>
);

export default PortfolioNavBar;
