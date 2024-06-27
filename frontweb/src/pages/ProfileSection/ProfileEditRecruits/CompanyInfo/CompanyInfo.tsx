import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../../../../redux/store';
import { updateCompany, getCompanyById } from '../../../../redux/features/company/companySlice';

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

  const handleSubmit = () => {
    dispatch(updateCompany({ id: companyId, companyData: companyInfo }));
  };

  return (
    <div>
      <h2>Company Information</h2>
      <form onSubmit={handleSubmit}>
        <label>Company Name:</label>
        <input name="companyName" value={companyInfo.companyName} onChange={handleChange} />
        <label>Registration Number:</label>
        <input name="companyRegistrationNumber" value={companyInfo.companyRegistrationNumber} onChange={handleChange} />
        <label>Number of Employees:</label>
        <input name="numberOfEmployees" value={companyInfo.numberOfEmployees} onChange={handleChange} type="number" />
        <label>Industry Type:</label>
        <input name="industryType" value={companyInfo.industryType} onChange={handleChange} />
        <button type="submit">Save</button>
      </form>
    </div>
  );
};

export default CompanyInfo;
