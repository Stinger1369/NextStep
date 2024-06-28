import React, { useEffect } from 'react';
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

  const formik = useFormik({
    initialValues: {
      profession: '',
      company: '',
      hobbies: [''],
      socialLinks: {
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
      socialLinks: Yup.object({
        github: Yup.string().url('Invalid URL'),
        twitter: Yup.string().url('Invalid URL'),
        instagram: Yup.string().url('Invalid URL'),
        facebook: Yup.string().url('Invalid URL'),
        discord: Yup.string().url('Invalid URL')
      })
    }),
    onSubmit: async (values) => {
      if (user?._id) {
        const updatedValues = {
          ...userData,
          profession: values.profession,
          company: values.company,
          hobbies: values.hobbies.filter((hobby) => hobby.trim() !== ''),
          socialLinks: values.socialLinks
        };
        console.log('Updating user with profession info:', updatedValues);
        await dispatch(updateUser({ id: user._id, userData: updatedValues }));
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
        socialLinks: {
          github: userData.socialLinks?.github || '',
          twitter: userData.socialLinks?.twitter || '',
          instagram: userData.socialLinks?.instagram || '',
          facebook: userData.socialLinks?.facebook || '',
          discord: userData.socialLinks?.discord || ''
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
        socialLinks: formik.values.socialLinks
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
            <label htmlFor="socialLinks.github">Github</label>
            <input type="text" id="socialLinks.github" {...formik.getFieldProps('socialLinks.github')} className="form-control" />
            {formik.touched.socialLinks?.github && formik.errors.socialLinks?.github ? <div className="text-danger">{formik.errors.socialLinks.github}</div> : null}
          </div>

          <div className="form-group">
            <label htmlFor="socialLinks.twitter">Twitter</label>
            <input type="text" id="socialLinks.twitter" {...formik.getFieldProps('socialLinks.twitter')} className="form-control" />
            {formik.touched.socialLinks?.twitter && formik.errors.socialLinks?.twitter ? <div className="text-danger">{formik.errors.socialLinks.twitter}</div> : null}
          </div>

          <div className="form-group">
            <label htmlFor="socialLinks.instagram">Instagram</label>
            <input type="text" id="socialLinks.instagram" {...formik.getFieldProps('socialLinks.instagram')} className="form-control" />
            {formik.touched.socialLinks?.instagram && formik.errors.socialLinks?.instagram ? <div className="text-danger">{formik.errors.socialLinks.instagram}</div> : null}
          </div>

          <div className="form-group">
            <label htmlFor="socialLinks.facebook">Facebook</label>
            <input type="text" id="socialLinks.facebook" {...formik.getFieldProps('socialLinks.facebook')} className="form-control" />
            {formik.touched.socialLinks?.facebook && formik.errors.socialLinks?.facebook ? <div className="text-danger">{formik.errors.socialLinks.facebook}</div> : null}
          </div>

          <div className="form-group">
            <label htmlFor="socialLinks.discord">Discord</label>
            <input type="text" id="socialLinks.discord" {...formik.getFieldProps('socialLinks.discord')} className="form-control" />
            {formik.touched.socialLinks?.discord && formik.errors.socialLinks?.discord ? <div className="text-danger">{formik.errors.socialLinks.discord}</div> : null}
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
            <button type="button" className="btn btn-secondary" onClick={handleSave}>
              Save
            </button>
            <button type="submit" className="btn btn-primary">
              Continue
            </button>
          </div>
        </form>
      </FormikProvider>
    </div>
  );
};

export default ProfessionInfo;
