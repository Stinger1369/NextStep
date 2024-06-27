import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../../../../redux/store';
import { updateCompany, getCompanyById } from '../../../../redux/features/company/companySlice';

interface SocialMediaInfoProps {
  companyId: string;
}

const SocialMediaInfo: React.FC<SocialMediaInfoProps> = ({ companyId }) => {
  const dispatch = useDispatch<AppDispatch>();
  const company = useSelector((state: RootState) => state.company.company);
  const [socialMediaLinks, setSocialMediaLinks] = useState({
    linkedin: '',
    facebook: '',
    twitter: '',
    instagram: ''
  });

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
    await dispatch(updateCompany({ id: companyId, companyData: { socialMediaLinks } }));
  };

  return (
    <div>
      <h2>Social Media Links</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="linkedin">LinkedIn:</label>
          <input id="linkedin" name="linkedin" value={socialMediaLinks.linkedin} onChange={handleChange} />
        </div>
        <div>
          <label htmlFor="facebook">Facebook:</label>
          <input id="facebook" name="facebook" value={socialMediaLinks.facebook} onChange={handleChange} />
        </div>
        <div>
          <label htmlFor="twitter">Twitter:</label>
          <input id="twitter" name="twitter" value={socialMediaLinks.twitter} onChange={handleChange} />
        </div>
        <div>
          <label htmlFor="instagram">Instagram:</label>
          <input id="instagram" name="instagram" value={socialMediaLinks.instagram} onChange={handleChange} />
        </div>
        <button type="submit">Save</button>
      </form>
    </div>
  );
};

export default SocialMediaInfo;
