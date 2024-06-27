import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../../../redux/store';
import { getUserById, updateUser } from '../../../redux/features/user/userSlice';
import { createCompany } from '../../../redux/features/company/companySlice';
import 'bootstrap/dist/css/bootstrap.min.css';
import './RoleSelection.css';

const RoleSelection: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const user = useSelector((state: RootState) => state.auth.user);

  const handleRoleSelection = async (role: string) => {
    if (user?._id) {
      await dispatch(getUserById(user._id));
      if (role === 'user') {
        navigate('/profile-edit-user/personal-info');
      } else if (role === 'recruiter') {
        // Créer une nouvelle entreprise
        const newCompany = await dispatch(
          createCompany({
            companyName: 'New Company',
            companyRegistrationNumber: '123456',
            address: { street: '', city: '', state: '', zipCode: '', country: '' },
            numberOfEmployees: 0,
            industryType: '',
            contactEmail: '',
            contactPhone: '',
            website: '',
            description: '',
            foundedDate: new Date(),
            logo: '',
            socialMediaLinks: {},
            companySize: 'small',
            headquarterLocation: '',
            subsidiaries: [],
            certifications: []
          })
        ).unwrap();

        // Mettre à jour l'utilisateur avec l'ID et le nom de l'entreprise
        await dispatch(updateUser({ id: user._id, userData: { company: newCompany.companyName, companyId: newCompany._id } }));
        navigate('/profile-edit-recruiter/personal-info');
      }
    } else {
      console.error('No user ID found, please log in.');
    }
  };

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
