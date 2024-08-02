import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../../../../redux/store';
import {
  updateCompany,
  getCompanyById,
  createCompany
} from '../../../../redux/features/company/companySlice';
import { useParams, useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaTimes } from 'react-icons/fa';
import 'bootstrap/dist/css/bootstrap.min.css';
import './SocialMediaInfo.css';

const SocialMediaInfo: React.FC = () => {
  const { companyId } = useParams<{ companyId: string }>();
  const dispatch = useDispatch<AppDispatch>();
  const company = useSelector((state: RootState) => state.company.company);
  const [socialMediaLinks, setSocialMediaLinks] = useState({
    linkedin: '',
    facebook: '',
    twitter: '',
    instagram: ''
  });
  const navigate = useNavigate();

  useEffect(() => {
    if (companyId) {
      dispatch(getCompanyById(companyId));
    }
  }, [companyId, dispatch]);

  useEffect(() => {
    if (company && company.socialMediaLinks) {
      setSocialMediaLinks({
        linkedin: company.socialMediaLinks.linkedin || '',
        facebook: company.socialMediaLinks.facebook || '',
        twitter: company.socialMediaLinks.twitter || '',
        instagram: company.socialMediaLinks.instagram || ''
      });
    }
  }, [company]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSocialMediaLinks({
      ...socialMediaLinks,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (companyId) {
      await dispatch(updateCompany({ id: companyId, companyData: { socialMediaLinks } }));
    } else {
      await dispatch(createCompany({ socialMediaLinks }));
    }
    navigate('/profile-edit-recruiter');
  };

  const handleBack = () => {
    navigate(-1);
  };

  const handleClose = () => {
    navigate('/');
  };

  return (
    <div className="social-media-info-container">
      <div className="header-icons">
        <FaArrowLeft className="icon" onClick={handleBack} />
        <FaTimes className="icon" onClick={handleClose} />
      </div>
      <h2>Social Media Links</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="linkedin">LinkedIn:</label>
          <input
            id="linkedin"
            name="linkedin"
            value={socialMediaLinks.linkedin}
            onChange={handleChange}
            className="form-control"
          />
        </div>
        <div className="form-group">
          <label htmlFor="facebook">Facebook:</label>
          <input
            id="facebook"
            name="facebook"
            value={socialMediaLinks.facebook}
            onChange={handleChange}
            className="form-control"
          />
        </div>
        <div className="form-group">
          <label htmlFor="twitter">Twitter:</label>
          <input
            id="twitter"
            name="twitter"
            value={socialMediaLinks.twitter}
            onChange={handleChange}
            className="form-control"
          />
        </div>
        <div className="form-group">
          <label htmlFor="instagram">Instagram:</label>
          <input
            id="instagram"
            name="instagram"
            value={socialMediaLinks.instagram}
            onChange={handleChange}
            className="form-control"
          />
        </div>
        <div className="button-container">
          <button type="submit" className="btn btn-primary">
            Save
          </button>
        </div>
      </form>
    </div>
  );
};

export default SocialMediaInfo;
