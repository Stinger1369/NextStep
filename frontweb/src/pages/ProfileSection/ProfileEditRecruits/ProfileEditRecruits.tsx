import React from 'react';
import AddressInfo from './AddressInfo/AddressInfo';
import CompanyInfo from './CompanyInfo/CompanyInfo';
import ContactInfo from './ContactInfo/ContactInfo';
import OtherInfo from './OtherInfo/OtherInfo';
import SocialMediaInfo from './SocialMediaInfo/SocialMediaInfo';

interface ProfileEditRecruitsProps {
  companyId: string;
}

const ProfileEditRecruits: React.FC<ProfileEditRecruitsProps> = ({ companyId }) => {
  return (
    <div>
      <h1>Edit Company Profile</h1>
      <CompanyInfo companyId={companyId} />
      <AddressInfo companyId={companyId} />
      <ContactInfo companyId={companyId} />
      <OtherInfo companyId={companyId} />
      <SocialMediaInfo companyId={companyId} />
    </div>
  );
};

export default ProfileEditRecruits;
