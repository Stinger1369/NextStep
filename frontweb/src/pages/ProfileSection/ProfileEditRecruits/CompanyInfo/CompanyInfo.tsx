import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../../../../redux/store';
import { updateCompany, getCompanyById } from '../../../../redux/features/company/companySlice';
import { useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaTimes } from 'react-icons/fa';
import 'bootstrap/dist/css/bootstrap.min.css';
import './CompanyInfo.css';

interface CompanyInfoProps {
  companyId: string;
}

const CompanyInfo: React.FC<CompanyInfoProps> = ({ companyId }) => {
  const dispatch = useDispatch<AppDispatch>();
  const company = useSelector((state: RootState) => state.company.company);
  const [companyInfo, setCompanyInfo] = useState({
    companyName: '',
    companyRegistrationNumber: '',
    numberOfEmployees: 0,
    industryType: ''
  });
  const navigate = useNavigate();

  useEffect(() => {
    if (companyId) {
      dispatch(getCompanyById(companyId));
    }
  }, [companyId, dispatch]);

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
    dispatch(updateCompany({ id: companyId, companyData: companyInfo }));
  };

  const handleContinue = () => {
    handleSave();
    navigate(`/edit-recruit/${companyId}/address-info`);
  };

  return (
    <div className="company-info-container">
      <div className="header-icons">
        <FaArrowLeft className="icon" onClick={() => navigate('/role-selection')} />
        <FaTimes className="icon" onClick={() => navigate('/')} />
      </div>
      <h2>Company Information</h2>
      <form>
        <div className="form-group">
          <label htmlFor="companyName">Company Name:</label>
          <input id="companyName" name="companyName" value={companyInfo.companyName} onChange={handleChange} className="form-control" />
        </div>
        <div className="form-group">
          <label htmlFor="companyRegistrationNumber">Registration Number:</label>
          <input id="companyRegistrationNumber" name="companyRegistrationNumber" value={companyInfo.companyRegistrationNumber} onChange={handleChange} className="form-control" />
        </div>
        <div className="form-group">
          <label htmlFor="numberOfEmployees">Number of Employees:</label>
          <input id="numberOfEmployees" name="numberOfEmployees" value={companyInfo.numberOfEmployees} onChange={handleChange} type="number" className="form-control" />
        </div>
        <div className="form-group">
          <label htmlFor="industryType">Industry Type:</label>
          <input id="industryType" name="industryType" value={companyInfo.industryType} onChange={handleChange} className="form-control" />
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

export default CompanyInfo;
