import React from 'react';
import { useOutletContext } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
import './Profile.css';

interface User {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  address?: {
    street?: string;
    city?: string;
    state?: string;
    zipCode?: string;
    country?: string;
  };
  dateOfBirth?: Date;
  profession?: string;
  experience?: string[];
  education?: string[];
  socialMediaLinks?: {
    github?: string;
    twitter?: string;
    instagram?: string;
    facebook?: string;
    linkedin?: string;
  };
}

const ProfileSection: React.FC = () => {
  const { user } = useOutletContext<{ user: User }>();

  return (
    <div className="profile-section">
      <div className="profile-header text-center">
        <h2>
          {user.firstName} {user.lastName}
        </h2>
        <p className="text-muted">{user.profession}</p>
      </div>

      <div className="profile-body">
        <div className="card mb-3">
          <div className="card-body">
            <h5 className="card-title">Contact Information</h5>
            <p>Email: {user.email}</p>
            {user.phone && <p>Phone: {user.phone}</p>}
            {user.address && (
              <p>
                Address: {user.address.street}, {user.address.city}, {user.address.state}, {user.address.zipCode}, {user.address.country}
              </p>
            )}
            {user.dateOfBirth && <p>Date of Birth: {new Date(user.dateOfBirth).toLocaleDateString()}</p>}
          </div>
        </div>

        <div className="card mb-3">
          <div className="card-body">
            <h5 className="card-title">Experience</h5>
            {user.experience ? (
              <ul>
                {user.experience.map((exp, index) => (
                  <li key={index}>{exp}</li>
                ))}
              </ul>
            ) : (
              <p>No experience listed.</p>
            )}
          </div>
        </div>

        <div className="card mb-3">
          <div className="card-body">
            <h5 className="card-title">Education</h5>
            {user.education ? (
              <ul>
                {user.education.map((edu, index) => (
                  <li key={index}>{edu}</li>
                ))}
              </ul>
            ) : (
              <p>No education listed.</p>
            )}
          </div>
        </div>

        <div className="card mb-3">
          <div className="card-body">
            <h5 className="card-title">Social Media</h5>
            <ul className="list-inline">
              {user.socialMediaLinks?.github && (
                <li className="list-inline-item">
                  <a href={user.socialMediaLinks.github} target="_blank" rel="noopener noreferrer">
                    <i className="fab fa-github"></i> GitHub
                  </a>
                </li>
              )}
              {user.socialMediaLinks?.twitter && (
                <li className="list-inline-item">
                  <a href={user.socialMediaLinks.twitter} target="_blank" rel="noopener noreferrer">
                    <i className="fab fa-twitter"></i> Twitter
                  </a>
                </li>
              )}
              {user.socialMediaLinks?.instagram && (
                <li className="list-inline-item">
                  <a href={user.socialMediaLinks.instagram} target="_blank" rel="noopener noreferrer">
                    <i className="fab fa-instagram"></i> Instagram
                  </a>
                </li>
              )}
              {user.socialMediaLinks?.facebook && (
                <li className="list-inline-item">
                  <a href={user.socialMediaLinks.facebook} target="_blank" rel="noopener noreferrer">
                    <i className="fab fa-facebook"></i> Facebook
                  </a>
                </li>
              )}
              {user.socialMediaLinks?.linkedin && (
                <li className="list-inline-item">
                  <a href={user.socialMediaLinks.linkedin} target="_blank" rel="noopener noreferrer">
                    <i className="fab fa-linkedin"></i> LinkedIn
                  </a>
                </li>
              )}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileSection;
