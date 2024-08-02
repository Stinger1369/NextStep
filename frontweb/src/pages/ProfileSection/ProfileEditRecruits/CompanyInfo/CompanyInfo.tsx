import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../../../../redux/store';
import {
  getCompanyById,
  updateCompany,
  createCompany
} from '../../../../redux/features/company/companySlice';
import { useNavigate, useParams } from 'react-router-dom';
import { FaArrowLeft, FaTimes } from 'react-icons/fa';
import 'bootstrap/dist/css/bootstrap.min.css';
import './CompanyInfo.css';

interface CompanyInfoProps {
  isNew?: boolean;
}

const RecruitCompanyInfo: React.FC<CompanyInfoProps> = ({ isNew }) => {
  const { companyId } = useParams<{ companyId: string }>();
  const dispatch = useDispatch<AppDispatch>();
  const company = useSelector((state: RootState) => state.company.company);
  const companies = useSelector((state: RootState) => state.company.companies);
  const [companyInfo, setCompanyInfo] = useState({
    companyName: '',
    companyRegistrationNumber: '',
    numberOfEmployees: 0,
    industryType: ''
  });
  const navigate = useNavigate();

  useEffect(() => {
    if (companyId && !isNew) {
      dispatch(getCompanyById(companyId));
    } else {
      setCompanyInfo({
        companyName: '',
        companyRegistrationNumber: '',
        numberOfEmployees: 0,
        industryType: ''
      });
    }
  }, [companyId, dispatch, isNew]);

  useEffect(() => {
    if (company) {
      setCompanyInfo({
        companyName: company.companyName,
        companyRegistrationNumber: company.companyRegistrationNumber,
        numberOfEmployees: company.numberOfEmployees,
        industryType: company.industryType
      });
    }
  }, [company]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCompanyInfo({
      ...companyInfo,
      [e.target.name]: e.target.value
    });
  };

  const handleSave = () => {
    if (isNew) {
      dispatch(createCompany(companyInfo));
    } else if (companyId) {
      dispatch(updateCompany({ id: companyId, companyData: companyInfo }));
    }
  };

  const handleContinue = () => {
    handleSave();
    navigate(`/edit-recruit/${companyId}/address-info`);
  };

  const handleBack = () => {
    if (companies.length === 0) {
      navigate('/role-selection');
    } else {
      navigate('/profile-edit-recruiter');
    }
  };

  return (
    <div className="company-info-container">
      <div className="header-icons">
        <FaArrowLeft className="icon" onClick={handleBack} />
        <FaTimes className="icon" onClick={() => navigate('/')} />
      </div>
      <h2>Company Information</h2>
      <form>
        <div className="form-group">
          <label htmlFor="companyName">Company Name:</label>
          <input
            id="companyName"
            name="companyName"
            value={companyInfo.companyName}
            onChange={handleChange}
            className="form-control"
          />
        </div>
        <div className="form-group">
          <label htmlFor="companyRegistrationNumber">Registration Number:</label>
          <input
            id="companyRegistrationNumber"
            name="companyRegistrationNumber"
            value={companyInfo.companyRegistrationNumber}
            onChange={handleChange}
            className="form-control"
          />
        </div>
        <div className="form-group">
          <label htmlFor="numberOfEmployees">Number of Employees:</label>
          <input
            id="numberOfEmployees"
            name="numberOfEmployees"
            value={companyInfo.numberOfEmployees}
            onChange={handleChange}
            type="number"
            className="form-control"
          />
        </div>
        <div className="form-group">
          <label htmlFor="industryType">Industry Type:</label>
          <input
            id="industryType"
            name="industryType"
            value={companyInfo.industryType}
            onChange={handleChange}
            className="form-control"
          />
        </div>
        <div className="button-container">
          <button type="button" className="btn btn-secondary" onClick={handleSave}>
            Save
          </button>
          <button type="button" className="btn btn-primary" onClick={handleContinue}>
            Continue
          </button>
        </div>
      </form>
    </div>
  );
};

export default RecruitCompanyInfo;
