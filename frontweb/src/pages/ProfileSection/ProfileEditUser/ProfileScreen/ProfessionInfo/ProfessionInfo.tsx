import React, { useEffect, useState } from 'react';
import { useFormik, FormikProvider } from 'formik';
import * as Yup from 'yup';
import { useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaTimes } from 'react-icons/fa';
import 'bootstrap/dist/css/bootstrap.min.css';
import './ProfessionInfo.css';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../../../../../redux/store';
import { updateUser, getUserById } from '../../../../../redux/features/user/userSlice';
import {
  changeThemeStatus,
  getThemeStatus
} from '../../../../../redux/features/theme/thunks/themeThunk';
import { getProfessionTheme } from '../../../../../utils/professionHelper';

import ProfessionCompanyInfo from './ProfessionCompanyInfo/ProfessionCompanyInfo';
import SocialMediaLinks from './SocialMediaLinks/SocialMediaLinks';
import Hobbies from './Hobbies/Hobbies';

interface SocialMediaLink {
  platform: string;
  url: string;
}

interface FormValues {
  profession: string;
  company: string;
  hobbies: string[];
  socialMediaLinks: SocialMediaLink[];
}

const ProfessionInfo: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const user = useSelector((state: RootState) => state.auth.user);
  const userData = useSelector((state: RootState) => state.user.user);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const formik = useFormik<FormValues>({
    initialValues: {
      profession: '',
      company: '',
      hobbies: [''],
      socialMediaLinks: [] // Initialize as an empty array
    },
    validationSchema: Yup.object({
      profession: Yup.string().required('Profession is required'),
      company: Yup.string(),
      hobbies: Yup.array().of(Yup.string()),
      socialMediaLinks: Yup.array().of(
        Yup.object({
          platform: Yup.string().required('Platform is required'),
          url: Yup.string().url('Invalid URL').required('URL is required')
        })
      )
    }),
    onSubmit: async (values) => {
      if (user?._id) {
        setIsSubmitting(true);

        // Convert Formik socialMediaLinks array back to Redux structure
        const socialMediaLinks = values.socialMediaLinks;

        const updatedValues = {
          ...userData,
          profession: values.profession,
          company: values.company,
          hobbies: values.hobbies.filter((hobby) => hobby.trim() !== ''),
          socialMediaLinks // Use the transformed array
        };

        console.log('Updating user with profession info:', updatedValues);
        await dispatch(updateUser({ id: user._id, userData: updatedValues }));

        // Save the profession in localStorage
        localStorage.setItem('userProfession', values.profession);

        const theme = getProfessionTheme(values.profession);
        await dispatch(changeThemeStatus({ userId: user._id, profession: theme }));
        await dispatch(getThemeStatus({ userId: user._id, profession: theme }));
        setIsSubmitting(false);
        navigate('/profile-edit-user/bio-skills-info');
      }
    }
  });

  useEffect(() => {
    if (user?._id) {
      dispatch(getUserById(user._id));
    }
  }, [dispatch, user]);

  useEffect(() => {
    if (userData) {
      // Convert Redux socialMediaLinks array to Formik array
      const socialMediaLinksArray: SocialMediaLink[] = userData.socialMediaLinks || [];

      formik.setValues({
        profession: userData.profession || '',
        company: userData.company || '',
        hobbies: userData.hobbies && userData.hobbies.length > 0 ? userData.hobbies : [''],
        socialMediaLinks: socialMediaLinksArray // Use the array directly
      });
    }
  }, [userData]);

  return (
    <div className="profession-info-container">
      <div className="header-icons">
        <FaArrowLeft className="icon" onClick={() => navigate('/profile-edit-user/address-info')} />
        <FaTimes className="icon" onClick={() => navigate('/')} />
      </div>
      <FormikProvider value={formik}>
        <form onSubmit={formik.handleSubmit} className="profession-info-form">
          {/* Composant Profession et Company */}
          <ProfessionCompanyInfo />

          {/* Composant Social Media Links */}
          <SocialMediaLinks />

          {/* Composant Hobbies */}
          <Hobbies />

          <div className="button-container">
            <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
              {isSubmitting ? 'Saving...' : 'Save'}
            </button>
          </div>
        </form>
      </FormikProvider>
    </div>
  );
};

export default ProfessionInfo;
