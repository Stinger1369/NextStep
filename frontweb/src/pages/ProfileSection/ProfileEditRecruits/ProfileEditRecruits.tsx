import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { RootState } from '../../../redux/store';

const ProfileEditRecruits: React.FC = () => {
  const companies = useSelector((state: RootState) => state.company.companies);
  const user = useSelector((state: RootState) => state.auth.user);
  const navigate = useNavigate();

  useEffect(() => {
    if (companies.length === 0) {
      navigate('/edit-recruit/new/company-info');
    }
  }, [companies.length, navigate]);

  const handleCreateNewCompany = () => {
    navigate(`/edit-recruit/new/company-info`);
  };

  return (
    <div className="profile-edit-recruits">
      <h1>Select a Company to Edit</h1>
      <ul>
        {companies.map((company) => (
          <li key={company._id}>
            <Link to={`/edit-recruit/${company._id}/company-info`}>{company.companyName}</Link>
          </li>
        ))}
      </ul>
      <button className="btn btn-primary" onClick={handleCreateNewCompany}>
        Create New Company
      </button>
    </div>
  );
};

export default ProfileEditRecruits;
