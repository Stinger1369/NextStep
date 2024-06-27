import React, { useEffect } from 'react';
import { useFormik } from 'formik';
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

  useEffect(() => {
    if (user?._id) {
      dispatch(getUserById(user._id));
    }
  }, [dispatch, user]);

  useEffect(() => {
    if (userData) {
      formik.setValues({
        profession: userData.profession || '',
        company: userData.company || ''
      });
    }
  }, [userData]);

  const formik = useFormik({
    initialValues: {
      profession: '',
      company: ''
    },
    validationSchema: Yup.object({
      profession: Yup.string(),
      company: Yup.string()
    }),
    onSubmit: async (values) => {
      if (user?._id) {
        const updatedValues = {
          ...userData,
          profession: values.profession,
          company: values.company
        };
        console.log('Updating user with profession info:', updatedValues);
        await dispatch(updateUser({ id: user._id, userData: updatedValues }));
        navigate('/profile-edit-user/bio-skills-info');
      }
    }
  });

  const handleSave = async () => {
    console.log('Saved Profession Info:', formik.values);
    if (user?._id) {
      const updatedValues = {
        ...userData,
        profession: formik.values.profession,
        company: formik.values.company
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
      <form onSubmit={formik.handleSubmit} className="profession-info-form">
        <div className="form-group">
          <label htmlFor="profession">Profession</label>
          <input
            type="text"
            id="profession"
            {...formik.getFieldProps('profession')}
            className="form-control"
          />
          {formik.touched.profession && formik.errors.profession ? (
            <div className="text-danger">{formik.errors.profession}</div>
          ) : null}
        </div>

        <div className="form-group">
          <label htmlFor="company">Company</label>
          <input
            type="text"
            id="company"
            {...formik.getFieldProps('company')}
            className="form-control"
          />
          {formik.touched.company && formik.errors.company ? (
            <div className="text-danger">{formik.errors.company}</div>
          ) : null}
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
    </div>
  );
};

export default ProfessionInfo;
