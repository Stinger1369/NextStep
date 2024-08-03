import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './PortfolioFooter.css';
import { FaGithub, FaTwitter, FaInstagram, FaFacebook, FaDiscord, FaGlobe } from 'react-icons/fa';

interface SocialMediaLink {
  platform: string;
  url: string;
}

interface PortfolioFooterProps {
  firstName: string;
  lastName: string;
  email: string;
  slug: string;
  socialMediaLinks?: SocialMediaLink[];
}

const PortfolioFooter: React.FC<PortfolioFooterProps> = ({
  firstName,
  lastName,
  email,
  socialMediaLinks,
  slug
}) => {
  const userSlug = slug || `${firstName.toLowerCase()}-${lastName.toLowerCase()}`;

  // Helper function to get the icon component for a given social media platform
  const getSocialMediaIcon = (platform: string) => {
    switch (platform.toLowerCase()) {
      case 'github':
        return <FaGithub />;
      case 'twitter':
        return <FaTwitter />;
      case 'instagram':
        return <FaInstagram />;
      case 'facebook':
        return <FaFacebook />;
      case 'discord':
        return <FaDiscord />;
      default:
        return <FaGlobe />; // Default icon for unknown platforms
    }
  };

  return (
    <div className="PortfolioFooter mt-auto text-center">
      <div className="PortfolioFooter-container d-flex justify-content-between align-items-center">
        <div className="PortfolioFooter-social-media-links">
          {socialMediaLinks &&
            socialMediaLinks.map((link, index) => (
              <a
                key={index}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="PortfolioFooter-social-link mx-1"
                aria-label={link.platform}
              >
                {getSocialMediaIcon(link.platform)}
              </a>
            ))}
        </div>

        <div className="PortfolioFooter-text text-center">
          <span className="PortfolioFooter-text-muted">
            &copy; {new Date().getFullYear()} {firstName} {lastName} -{' '}
            <a href={`mailto:${email}`} className="PortfolioFooter-email-link">
              {email}
            </a>
          </span>
        </div>

        <div className="PortfolioFooter-useful-links">
          <a href={`/portfolio/${userSlug}/contact`} className="PortfolioFooter-link mx-1">
            Contact
          </a>
          <a href={`/portfolio/${userSlug}/about`} className="PortfolioFooter-link mx-1">
            About
          </a>
        </div>
      </div>
    </div>
  );
};

export default PortfolioFooter;
