import React from 'react';
import { useOutletContext } from 'react-router-dom';

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
}

const ProfileSection: React.FC = () => {
  const { user } = useOutletContext<{ user: User }>();

  return (
    <div>
      <h2>Profile</h2>
      <p>Email: {user.email}</p>
      {user.phone && <p>Phone: {user.phone}</p>}
      {user.address && (
        <div>
          <p>Address: {user.address.street}</p>
          <p>City: {user.address.city}</p>
          <p>State: {user.address.state}</p>
          <p>Zip Code: {user.address.zipCode}</p>
          <p>Country: {user.address.country}</p>
        </div>
      )}
      {user.dateOfBirth && <p>Date of Birth: {new Date(user.dateOfBirth).toLocaleDateString()}</p>}
    </div>
  );
};

export default ProfileSection;
