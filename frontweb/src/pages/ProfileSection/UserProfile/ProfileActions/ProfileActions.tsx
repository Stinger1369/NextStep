// src/pages/ProfileSection/UserProfile/components/ProfileActions/ProfileActions.tsx

import React from 'react';
import './ProfileActions.css'; // Import a new CSS file for ProfileActions

interface ProfileActionsProps {
  themeEnabled: boolean;
  toggleTheme: () => void;
  showEditButton: boolean;
  handleEditProfile: () => void;
}

const ProfileActions: React.FC<ProfileActionsProps> = ({
  themeEnabled,
  toggleTheme,
  showEditButton,
  handleEditProfile
}) => {
  return (
    <div className="profile-actions">
      <button className="btn btn-outline-secondary toggle-theme-btn" onClick={toggleTheme}>
        {themeEnabled ? 'Disable Theme' : 'Enable Theme'}
      </button>

      {showEditButton && (
        <button className="btn btn-outline-primary edit-profile-btn" onClick={handleEditProfile}>
          Edit My Profile
        </button>
      )}
    </div>
  );
};

export default ProfileActions;
