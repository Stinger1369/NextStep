import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../../../redux/store';
import { getUserById } from '../../../redux/features/user/userSlice';
import { getCompanies } from '../../../redux/features/company/companySlice';
import { useParams } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './PublicUserProfile.css';

const PublicUserProfile: React.FC = () => {
  const { userId } = useParams<{ userId: string }>();
  const dispatch = useDispatch<AppDispatch>();
  const user = useSelector((state: RootState) => state.user.user);
  const companies = useSelector((state: RootState) => state.company.companies);

  useEffect(() => {
    if (userId) {
      dispatch(getUserById(userId));
      dispatch(getCompanies());
    }
  }, [dispatch, userId]);

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div className="public-user-profile-container">
      <div className="profile-header">
        <h2>
          {user.firstName} {user.lastName}
        </h2>
        <p>{user.profession}</p>
      </div>
      <div className="profile-section">
        <h3>Personal Information</h3>
        <p>
          <strong>Email:</strong> {user.email}
        </p>
        <p>
          <strong>Phone:</strong> {user.phone}
        </p>
        <p>
          <strong>Address:</strong> {user.address?.street}, {user.address?.city}, {user.address?.state}, {user.address?.zipCode}, {user.address?.country}
        </p>
      </div>
      <div className="profile-section">
        <h3>Companies</h3>
        <ul>
          {companies.map((company) => (
            <li key={company._id}>
              <h4>{company.companyName}</h4>
              <p>
                <strong>Industry:</strong> {company.industryType}
              </p>
              <p>
                <strong>Employees:</strong> {company.numberOfEmployees}
              </p>
              <p>
                <strong>Address:</strong> {company.address.street}, {company.address.city}, {company.address.state}, {company.address.zipCode}, {company.address.country}
              </p>
              <p>
                <strong>Contact:</strong> {company.contactEmail} | {company.contactPhone}
              </p>
              <div className="social-media-links">
                {company.socialMediaLinks?.linkedin && <a href={company.socialMediaLinks.linkedin}>LinkedIn</a>}
                {company.socialMediaLinks?.facebook && <a href={company.socialMediaLinks.facebook}>Facebook</a>}
                {company.socialMediaLinks?.twitter && <a href={company.socialMediaLinks.twitter}>Twitter</a>}
                {company.socialMediaLinks?.instagram && <a href={company.socialMediaLinks.instagram}>Instagram</a>}
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default PublicUserProfile;
