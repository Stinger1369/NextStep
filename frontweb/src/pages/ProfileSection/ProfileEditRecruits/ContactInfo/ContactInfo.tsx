import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../../../../redux/store';
import { updateCompany, getCompanyById } from '../../../../redux/features/company/companySlice';

interface ContactInfoProps {
  companyId: string;
}

const ContactInfo: React.FC<ContactInfoProps> = ({ companyId }) => {
  const dispatch = useDispatch<AppDispatch>();
  const company = useSelector((state: RootState) => state.company.company);
  const [contactInfo, setContactInfo] = useState({
    contactEmail: '',
    contactPhone: ''
  });

  useEffect(() => {
    if (companyId) {
      dispatch(getCompanyById(companyId));
    }
  }, [companyId, dispatch]);

  useEffect(() => {
    if (company) {
      setContactInfo({
        contactEmail: company.contactEmail,
        contactPhone: company.contactPhone
      });
    }
  }, [company]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setContactInfo({
      ...contactInfo,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = () => {
    dispatch(updateCompany({ id: companyId, companyData: contactInfo }));
  };

  return (
    <div>
      <h2>Contact Information</h2>
      <form onSubmit={handleSubmit}>
        <label>Email:</label>
        <input name="contactEmail" value={contactInfo.contactEmail} onChange={handleChange} />
        <label>Phone:</label>
        <input name="contactPhone" value={contactInfo.contactPhone} onChange={handleChange} />
        <button type="submit">Save</button>
      </form>
    </div>
  );
};

export default ContactInfo;
