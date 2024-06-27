import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../../../redux/store';
import { getUserById } from '../../../redux/features/user/userSlice';
import { getCompanies } from '../../../redux/features/company/companySlice';
import 'bootstrap/dist/css/bootstrap.min.css';
import './RoleSelection.css';

const RoleSelection: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const user = useSelector((state: RootState) => state.auth.user);
  const companies = useSelector((state: RootState) => state.company.companies);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserAndCompanies = async () => {
      if (user?._id) {
        await dispatch(getUserById(user._id));
        await dispatch(getCompanies());
      }
      setLoading(false);
    };
    fetchUserAndCompanies();
  }, [dispatch, user?._id]);

  useEffect(() => {
    if (!loading && user?._id && companies.length === 0) {
      navigate('/edit-recruit/new/company-info');
    }
  }, [loading, user, companies.length, navigate]);

  const handleRoleSelection = (role: string) => {
    if (user?._id) {
      if (role === 'user') {
        navigate('/profile-edit-user/personal-info');
      } else if (role === 'recruiter') {
        if (companies.length === 0) {
          navigate('/edit-recruit/new/company-info');
        } else {
          navigate('/profile-edit-recruiter');
        }
      }
    } else {
      console.error('No user ID found, please log in.');
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="role-selection-container">
      <h2>Select Your Role</h2>
      <div className="d-flex justify-content-center">
        <button className="btn btn-primary mx-2" onClick={() => handleRoleSelection('user')}>
          User
        </button>
        <button className="btn btn-success mx-2" onClick={() => handleRoleSelection('recruiter')}>
          Recruiter
        </button>
      </div>
    </div>
  );
};

export default RoleSelection;
