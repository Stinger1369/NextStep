// src/pages/ProfileSection/UserProfile/components/SocialMediaLinks/SocialMediaLinks.tsx

import React from 'react';
import './SocialMediaLinks.css';
import { User } from '../../../../redux/features/user/userSlice';

interface SocialMediaLinksProps {
  socialMediaLinks: User['socialMediaLinks'];
}

const SocialMediaLinks: React.FC<SocialMediaLinksProps> = ({ socialMediaLinks }) => {
  return (
    <div className="social-media-links">
      <h3 className="text-secondary">Social Media Links</h3>
      {socialMediaLinks?.map(({ platform, url }) => (
        <p key={platform}>
          <strong>{platform.charAt(0).toUpperCase() + platform.slice(1)}:</strong>{' '}
          <a href={url} target="_blank" rel="noopener noreferrer">
            {url}
          </a>
        </p>
      ))}
    </div>
  );
};

export default SocialMediaLinks;
