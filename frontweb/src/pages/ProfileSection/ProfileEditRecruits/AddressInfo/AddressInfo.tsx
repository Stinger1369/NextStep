import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../../../../redux/store';
import { updateCompany, getCompanyById } from '../../../../redux/features/company/companySlice';

interface AddressInfoProps {
  companyId: string;
}

const AddressInfo: React.FC<AddressInfoProps> = ({ companyId }) => {
  const dispatch = useDispatch<AppDispatch>();
  const company = useSelector((state: RootState) => state.company.company);
  const [address, setAddress] = useState({
    street: '',
    city: '',
    state: '',
    zipCode: '',
    country: ''
  });

  useEffect(() => {
    if (companyId) {
      dispatch(getCompanyById(companyId));
    }
  }, [companyId, dispatch]);

  useEffect(() => {
    if (company) {
      setAddress(company.address);
    }
  }, [company]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAddress({
      ...address,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = () => {
    dispatch(updateCompany({ id: companyId, companyData: { address } }));
  };

  return (
    <div>
      <h2>Address Information</h2>
      <form onSubmit={handleSubmit}>
        <label>Street:</label>
        <input name="street" value={address.street} onChange={handleChange} />
        <label>City:</label>
        <input name="city" value={address.city} onChange={handleChange} />
        <label>State:</label>
        <input name="state" value={address.state} onChange={handleChange} />
        <label>Zip Code:</label>
        <input name="zipCode" value={address.zipCode} onChange={handleChange} />
        <label>Country:</label>
        <input name="country" value={address.country} onChange={handleChange} />
        <button type="submit">Save</button>
      </form>
    </div>
  );
};

export default AddressInfo;
