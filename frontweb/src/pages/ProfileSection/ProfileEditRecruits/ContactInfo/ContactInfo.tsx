import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../../../../redux/store';
import { updateCompany, getCompanyById, createCompany } from '../../../../redux/features/company/companySlice';
import { useNavigate, useParams } from 'react-router-dom';
import { FaArrowLeft, FaTimes } from 'react-icons/fa';
import 'bootstrap/dist/css/bootstrap.min.css';
import './ContactInfo.css';

const ContactInfo: React.FC = () => {
  const { companyId } = useParams<{ companyId: string }>();
  const dispatch = useDispatch<AppDispatch>();
  const company = useSelector((state: RootState) => state.company.company);
  const [contactInfo, setContactInfo] = useState({
    contactEmail: '',
    contactPhone: ''
  });
  const navigate = useNavigate();

  useEffect(() => {
    if (companyId) {
      dispatch(getCompanyById(companyId));
    }
  }, [companyId, dispatch]);

  useEffect(() => {
    if (company) {
      setContactInfo({
        contactEmail: company.contactEmail || '',
        contactPhone: company.contactPhone || ''
      });
    }
  }, [company]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setContactInfo({
      ...contactInfo,
      [e.target.name]: e.target.value
    });
  };

  const handleSave = () => {
    if (companyId) {
      dispatch(updateCompany({ id: companyId, companyData: contactInfo }));
    } else {
      // Assuming you have the company info in the state to create a new company
      dispatch(createCompany({ contactEmail: contactInfo.contactEmail, contactPhone: contactInfo.contactPhone }));
    }
  };

  const handleContinue = () => {
    handleSave();
    if (companyId) {
      navigate(`/edit-recruit/${companyId}/other-info`);
    } else {
      // Navigate to other info for new company creation
      navigate(`/edit-recruit/new/other-info`);
    }
  };

  return (
    <div className="contact-info-container">
      <div className="header-icons">
        <FaArrowLeft className="icon" onClick={() => navigate(-1)} />
        <FaTimes className="icon" onClick={() => navigate('/')} />
      </div>
      <h2>Contact Information</h2>
      <form>
        <div className="form-group">
          <label htmlFor="contactEmail">Email:</label>
          <input id="contactEmail" name="contactEmail" value={contactInfo.contactEmail} onChange={handleChange} className="form-control" />
        </div>
        <div className="form-group">
          <label htmlFor="contactPhone">Phone:</label>
          <input id="contactPhone" name="contactPhone" value={contactInfo.contactPhone} onChange={handleChange} className="form-control" />
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

export default ContactInfo;
