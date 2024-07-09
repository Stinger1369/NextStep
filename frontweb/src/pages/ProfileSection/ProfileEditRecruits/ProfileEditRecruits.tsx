import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { RootState, AppDispatch } from '../../../redux/store';
import { getCompanies } from '../../../redux/features/company/companySlice';
import 'bootstrap/dist/css/bootstrap.min.css';
import './ProfileEditRecruits.css';

const ProfileEditRecruits: React.FC = () => {
  const companies = useSelector((state: RootState) => state.company.companies);
  const user = useSelector((state: RootState) => state.auth.user);
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(getCompanies());
  }, [dispatch]);

  const handleCreateNewCompany = () => {
    navigate('/edit-recruit/new/company-info');
  };

  return (
    <div className="profile-edit-recruits">
      <h1>Select a Company to Edit</h1>
      {companies.length > 0 ? (
        <>
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
        </>
      ) : (
        <div>
          <p>No companies found. Create a new company to get started.</p>
          <button className="btn btn-primary" onClick={handleCreateNewCompany}>
            Create New Company
          </button>
        </div>
      )}
    </div>
  );
};

export default ProfileEditRecruits;
