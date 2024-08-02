import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
import './PortfolioFooter.css';

interface PortfolioFooterProps {
  firstName: string;
  lastName: string;
  email: string;
  socialMediaLinks?: {
    github?: string;
    twitter?: string;
    instagram?: string;
    facebook?: string;
    discord?: string;
  };
}

const PortfolioFooter: React.FC<PortfolioFooterProps> = ({
  firstName,
  lastName,
  email,
  socialMediaLinks
}) => {
  return (
    <div className="PortfolioFooter mt-auto text-center">
      <div className="container d-flex justify-content-between align-items-center">
        <div className="social-media-links">
          {socialMediaLinks?.github && (
            <a
              href={socialMediaLinks.github}
              target="_blank"
              rel="noopener noreferrer"
              className="mx-2"
            >
              <i className="fab fa-github"></i>
            </a>
          )}
          {socialMediaLinks?.twitter && (
            <a
              href={socialMediaLinks.twitter}
              target="_blank"
              rel="noopener noreferrer"
              className="mx-2"
            >
              <i className="fab fa-twitter"></i>
            </a>
          )}
          {socialMediaLinks?.instagram && (
            <a
              href={socialMediaLinks.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="mx-2"
            >
              <i className="fab fa-instagram"></i>
            </a>
          )}
          {socialMediaLinks?.facebook && (
            <a
              href={socialMediaLinks.facebook}
              target="_blank"
              rel="noopener noreferrer"
              className="mx-2"
            >
              <i className="fab fa-facebook"></i>
            </a>
          )}
          {socialMediaLinks?.discord && (
            <a
              href={socialMediaLinks.discord}
              target="_blank"
              rel="noopener noreferrer"
              className="mx-2"
            >
              <i className="fab fa-discord"></i>
            </a>
          )}
        </div>
        <div className="text-center">
          <span className="text-muted">
            &copy; {new Date().getFullYear()} {firstName} {lastName} -{' '}
            <a href={`mailto:${email}`}>{email}</a>
          </span>
        </div>
        <div className="useful-links">
          <a href="/portfolio/bilel-zaaraoui/contact" className="mx-2 text-muted">
            Contact
          </a>
          <a href="/portfolio/bilel-zaaraoui/about" className="mx-2 text-muted">
            About
          </a>
          {/* Add more links as needed */}
        </div>
      </div>
    </div>
  );
};

export default PortfolioFooter;
