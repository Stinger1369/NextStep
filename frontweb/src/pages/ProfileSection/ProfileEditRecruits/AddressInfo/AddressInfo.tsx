import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../../../../redux/store';
import {
  updateCompany,
  getCompanyById,
  createCompany
} from '../../../../redux/features/company/companySlice';
import { useNavigate, useParams } from 'react-router-dom';
import { FaArrowLeft, FaTimes } from 'react-icons/fa';
import 'bootstrap/dist/css/bootstrap.min.css';
import './AddressInfo.css';

const AddressInfo: React.FC = () => {
  const { companyId } = useParams<{ companyId: string }>();
  const dispatch = useDispatch<AppDispatch>();
  const company = useSelector((state: RootState) => state.company.company);
  const [address, setAddress] = useState({
    street: '',
    city: '',
    state: '',
    zipCode: '',
    country: ''
  });
  const navigate = useNavigate();

  useEffect(() => {
    if (companyId) {
      dispatch(getCompanyById(companyId));
    }
  }, [companyId, dispatch]);

  useEffect(() => {
    if (company) {
      setAddress(
        company.address || {
          street: '',
          city: '',
          state: '',
          zipCode: '',
          country: ''
        }
      );
    }
  }, [company]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAddress({
      ...address,
      [e.target.name]: e.target.value
    });
  };

  const handleSave = () => {
    if (companyId) {
      dispatch(updateCompany({ id: companyId, companyData: { address } }));
    } else {
      // Assuming you have the company info in the state to create a new company
      dispatch(createCompany({ address }));
    }
  };

  const handleContinue = () => {
    handleSave();
    if (companyId) {
      navigate(`/edit-recruit/${companyId}/contact-info`);
    } else {
      // Navigate to contact info for new company creation
      navigate(`/edit-recruit/new/contact-info`);
    }
  };

  return (
    <div className="address-info-container">
      <div className="header-icons">
        <FaArrowLeft className="icon" onClick={() => navigate(-1)} />
        <FaTimes className="icon" onClick={() => navigate('/')} />
      </div>
      <h2>Address Information</h2>
      <form>
        <div className="form-group">
          <label htmlFor="street">Street:</label>
          <input
            id="street"
            name="street"
            value={address.street}
            onChange={handleChange}
            className="form-control"
          />
        </div>
        <div className="form-group">
          <label htmlFor="city">City:</label>
          <input
            id="city"
            name="city"
            value={address.city}
            onChange={handleChange}
            className="form-control"
          />
        </div>
        <div className="form-group">
          <label htmlFor="state">State:</label>
          <input
            id="state"
            name="state"
            value={address.state}
            onChange={handleChange}
            className="form-control"
          />
        </div>
        <div className="form-group">
          <label htmlFor="zipCode">Zip Code:</label>
          <input
            id="zipCode"
            name="zipCode"
            value={address.zipCode}
            onChange={handleChange}
            className="form-control"
          />
        </div>
        <div className="form-group">
          <label htmlFor="country">Country:</label>
          <input
            id="country"
            name="country"
            value={address.country}
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

export default AddressInfo;
