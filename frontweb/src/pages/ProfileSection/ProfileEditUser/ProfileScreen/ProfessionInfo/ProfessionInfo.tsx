import React, { useEffect, useState } from 'react';
import { useFormik, FieldArray, FormikProvider } from 'formik';
import * as Yup from 'yup';
import { useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaTimes } from 'react-icons/fa';
import 'bootstrap/dist/css/bootstrap.min.css';
import './ProfessionInfo.css';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../../../../../redux/store';
import { updateUser, getUserById } from '../../../../../redux/features/user/userSlice';

const ProfessionInfo: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const user = useSelector((state: RootState) => state.auth.user);
  const userData = useSelector((state: RootState) => state.user.user);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const formik = useFormik({
    initialValues: {
      profession: '',
      company: '',
      hobbies: [''],
      socialMediaLinks: {
        github: '',
        twitter: '',
        instagram: '',
        facebook: '',
        discord: ''
      }
    },
    validationSchema: Yup.object({
      profession: Yup.string(),
      company: Yup.string(),
      hobbies: Yup.array().of(Yup.string().required('Hobby is required')),
      socialMediaLinks: Yup.object({
        github: Yup.string().url('Invalid URL'),
        twitter: Yup.string().url('Invalid URL'),
        instagram: Yup.string().url('Invalid URL'),
        facebook: Yup.string().url('Invalid URL'),
        discord: Yup.string().url('Invalid URL')
      })
    }),
    onSubmit: async (values) => {
      if (user?._id) {
        setIsSubmitting(true);
        const updatedValues = {
          ...userData,
          profession: values.profession,
          company: values.company,
          hobbies: values.hobbies.filter((hobby) => hobby.trim() !== ''),
          socialMediaLinks: values.socialMediaLinks
        };
        console.log('Updating user with profession info:', updatedValues);
        await dispatch(updateUser({ id: user._id, userData: updatedValues }));
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
      formik.setValues({
        profession: userData.profession || '',
        company: userData.company || '',
        hobbies: userData.hobbies && userData.hobbies.length > 0 ? userData.hobbies : [''],
        socialMediaLinks: {
          github: userData.socialMediaLinks?.github || '',
          twitter: userData.socialMediaLinks?.twitter || '',
          instagram: userData.socialMediaLinks?.instagram || '',
          facebook: userData.socialMediaLinks?.facebook || '',
          discord: userData.socialMediaLinks?.discord || ''
        }
      });
    }
  }, [userData]);

  const handleSave = async () => {
    console.log('Saved Profession Info:', formik.values);
    if (user?._id) {
      const updatedValues = {
        ...userData,
        profession: formik.values.profession,
        company: formik.values.company,
        hobbies: formik.values.hobbies.filter((hobby) => hobby.trim() !== ''),
        socialMediaLinks: formik.values.socialMediaLinks
      };
      await dispatch(updateUser({ id: user._id, userData: updatedValues }));
    }
  };

  return (
    <div className="profession-info-container">
      <div className="header-icons">
        <FaArrowLeft className="icon" onClick={() => navigate('/profile-edit-user/address-info')} />
        <FaTimes className="icon" onClick={() => navigate('/')} />
      </div>
      <FormikProvider value={formik}>
        <form onSubmit={formik.handleSubmit} className="profession-info-form">
          <div className="form-group">
            <label htmlFor="profession">Profession</label>
            <input type="text" id="profession" {...formik.getFieldProps('profession')} className="form-control" />
            {formik.touched.profession && formik.errors.profession ? <div className="text-danger">{formik.errors.profession}</div> : null}
          </div>

          <div className="form-group">
            <label htmlFor="company">Company</label>
            <input type="text" id="company" {...formik.getFieldProps('company')} className="form-control" />
            {formik.touched.company && formik.errors.company ? <div className="text-danger">{formik.errors.company}</div> : null}
          </div>

          <div className="form-group">
            <label htmlFor="socialMediaLinks.github">Github</label>
            <input type="text" id="socialMediaLinks.github" {...formik.getFieldProps('socialMediaLinks.github')} className="form-control" />
            {formik.touched.socialMediaLinks?.github && formik.errors.socialMediaLinks?.github ? <div className="text-danger">{formik.errors.socialMediaLinks.github}</div> : null}
          </div>

          <div className="form-group">
            <label htmlFor="socialMediaLinks.twitter">Twitter</label>
            <input type="text" id="socialMediaLinks.twitter" {...formik.getFieldProps('socialMediaLinks.twitter')} className="form-control" />
            {formik.touched.socialMediaLinks?.twitter && formik.errors.socialMediaLinks?.twitter ? <div className="text-danger">{formik.errors.socialMediaLinks.twitter}</div> : null}
          </div>

          <div className="form-group">
            <label htmlFor="socialMediaLinks.instagram">Instagram</label>
            <input type="text" id="socialMediaLinks.instagram" {...formik.getFieldProps('socialMediaLinks.instagram')} className="form-control" />
            {formik.touched.socialMediaLinks?.instagram && formik.errors.socialMediaLinks?.instagram ? <div className="text-danger">{formik.errors.socialMediaLinks.instagram}</div> : null}
          </div>

          <div className="form-group">
            <label htmlFor="socialMediaLinks.facebook">Facebook</label>
            <input type="text" id="socialMediaLinks.facebook" {...formik.getFieldProps('socialMediaLinks.facebook')} className="form-control" />
            {formik.touched.socialMediaLinks?.facebook && formik.errors.socialMediaLinks?.facebook ? <div className="text-danger">{formik.errors.socialMediaLinks.facebook}</div> : null}
          </div>

          <div className="form-group">
            <label htmlFor="socialMediaLinks.discord">Discord</label>
            <input type="text" id="socialMediaLinks.discord" {...formik.getFieldProps('socialMediaLinks.discord')} className="form-control" />
            {formik.touched.socialMediaLinks?.discord && formik.errors.socialMediaLinks?.discord ? <div className="text-danger">{formik.errors.socialMediaLinks.discord}</div> : null}
          </div>

          <div className="form-group">
            <label htmlFor="hobbies">Hobbies</label>
            <FieldArray
              name="hobbies"
              render={(arrayHelpers) => (
                <div>
                  {formik.values.hobbies.map((hobby, index) => (
                    <div key={index} className="mb-2">
                      <input type="text" {...formik.getFieldProps(`hobbies.${index}`)} className="form-control mb-1" />
                      <button type="button" className="btn btn-danger me-2" onClick={() => arrayHelpers.remove(index)}>
                        Remove
                      </button>
                      <button type="button" className="btn btn-secondary" onClick={() => arrayHelpers.insert(index + 1, '')}>
                        Add
                      </button>
                    </div>
                  ))}
                </div>
              )}
            />
          </div>

          <div className="button-container">
            <button type="button" className="btn btn-secondary" onClick={handleSave} disabled={isSubmitting}>
              {isSubmitting ? 'Saving...' : 'Save'}
            </button>
            <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
              {isSubmitting ? 'Saving...' : 'Continue'}
            </button>
          </div>
        </form>
      </FormikProvider>
    </div>
  );
};

export default ProfessionInfo;
