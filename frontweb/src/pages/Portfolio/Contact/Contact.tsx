import React from 'react';
import { useOutletContext } from 'react-router-dom';

interface User {
  email: string;
  phone?: string;
  socialMediaLinks?: {
    github?: string;
    twitter?: string;
    instagram?: string;
    facebook?: string;
    discord?: string;
  };
}

const ContactSection: React.FC = () => {
  const { user } = useOutletContext<{ user: User }>();

  return (
    <div>
      <h2>Contact</h2>
      <p>Email: {user.email}</p>
      {user.phone && <p>Phone: {user.phone}</p>}
      <h3>Social Media Links</h3>
      <ul>
        {user.socialMediaLinks?.github && (
          <li>
            <a href={user.socialMediaLinks.github} target="_blank" rel="noopener noreferrer">
              GitHub
            </a>
          </li>
        )}
        {user.socialMediaLinks?.twitter && (
          <li>
            <a href={user.socialMediaLinks.twitter} target="_blank" rel="noopener noreferrer">
              Twitter
            </a>
          </li>
        )}
        {user.socialMediaLinks?.instagram && (
          <li>
            <a href={user.socialMediaLinks.instagram} target="_blank" rel="noopener noreferrer">
              Instagram
            </a>
          </li>
        )}
        {user.socialMediaLinks?.facebook && (
          <li>
            <a href={user.socialMediaLinks.facebook} target="_blank" rel="noopener noreferrer">
              Facebook
            </a>
          </li>
        )}
        {user.socialMediaLinks?.discord && (
          <li>
            <a href={user.socialMediaLinks.discord} target="_blank" rel="noopener noreferrer">
              Discord
            </a>
          </li>
        )}
      </ul>
    </div>
  );
};

export default ContactSection;
