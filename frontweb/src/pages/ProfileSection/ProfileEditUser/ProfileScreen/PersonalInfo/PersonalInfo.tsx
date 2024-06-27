import React, { useEffect, useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaTimes } from 'react-icons/fa';
import 'bootstrap/dist/css/bootstrap.min.css';
import './PersonalInfo.css';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../../../../../redux/store';
import { updateUser, getUserById } from '../../../../../redux/features/user/userSlice';

const PersonalInfo: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const user = useSelector((state: RootState) => state.auth.user);
  const userData = useSelector((state: RootState) => state.user.user);

  const [age, setAge] = useState<number | null>(null);

  useEffect(() => {
    if (user?._id) {
      dispatch(getUserById(user._id));
    }
  }, [dispatch, user]);

  useEffect(() => {
    if (userData) {
      formik.setValues({
        firstName: userData.firstName || '',
        lastName: userData.lastName || '',
        phone: userData.phone || '',
        dateOfBirth: userData.dateOfBirth
          ? new Date(userData.dateOfBirth).toISOString().substring(0, 10)
          : '',
        sex: userData.sex || '',
        showAge: userData.showAge || false
      });
      if (userData.dateOfBirth) {
        calculateAge(userData.dateOfBirth);
      }
    }
  }, [userData]);

  const calculateAge = (dateOfBirth: Date) => {
    const birthDate = new Date(dateOfBirth);
    const now = new Date();
    let calculatedAge = now.getFullYear() - birthDate.getFullYear();
    const monthDiff = now.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && now.getDate() < birthDate.getDate())) {
      calculatedAge--;
    }
    setAge(calculatedAge);
  };

  const formik = useFormik({
    initialValues: {
      firstName: '',
      lastName: '',
      phone: '',
      dateOfBirth: '',
      sex: '',
      showAge: false
    },
    validationSchema: Yup.object({
      firstName: Yup.string(),
      lastName: Yup.string(),
      phone: Yup.string(),
      dateOfBirth: Yup.date().nullable(),
      sex: Yup.string(),
      showAge: Yup.boolean()
    }),
    onSubmit: async (values) => {
      if (user?._id) {
        const updatedValues = {
          ...values,
          dateOfBirth: values.dateOfBirth ? new Date(values.dateOfBirth) : undefined
        };
        console.log('Updating user with values:', updatedValues);
        await dispatch(updateUser({ id: user._id, userData: updatedValues }));
        navigate('/profile-edit-user/address-info');
      }
    }
  });

  return (
    <div className="personal-info-container">
      {!userData ? (
        <div>Loading user data...</div>
      ) : (
        <form onSubmit={formik.handleSubmit} className="personal-info-form container">
          <div className="header-icons">
            <FaArrowLeft className="icon" onClick={() => navigate(-1)} />
            <FaTimes className="icon" onClick={() => navigate('/')} />
          </div>
          <div className="row">
            <div className="col-md-6 form-field">
              <label htmlFor="firstName" className="form-label">
                First Name
              </label>
              <input
                type="text"
                id="firstName"
                className="form-control"
                {...formik.getFieldProps('firstName')}
              />
              {formik.touched.firstName && formik.errors.firstName ? (
                <div className="text-danger">{formik.errors.firstName}</div>
              ) : null}
            </div>
            <div className="col-md-6 form-field">
              <label htmlFor="lastName" className="form-label">
                Last Name
              </label>
              <input
                type="text"
                id="lastName"
                className="form-control"
                {...formik.getFieldProps('lastName')}
              />
              {formik.touched.lastName && formik.errors.lastName ? (
                <div className="text-danger">{formik.errors.lastName}</div>
              ) : null}
            </div>
            <div className="col-md-6 form-field">
              <label htmlFor="phone" className="form-label">
                Phone
              </label>
              <input
                type="text"
                id="phone"
                className="form-control"
                {...formik.getFieldProps('phone')}
              />
              {formik.touched.phone && formik.errors.phone ? (
                <div className="text-danger">{formik.errors.phone}</div>
              ) : null}
            </div>
            <div className="col-md-6 form-field">
              <label htmlFor="dateOfBirth" className="form-label">
                Date of Birth
              </label>
              <input
                type="date"
                id="dateOfBirth"
                className="form-control"
                {...formik.getFieldProps('dateOfBirth')}
              />
              {formik.touched.dateOfBirth && formik.errors.dateOfBirth ? (
                <div className="text-danger">{formik.errors.dateOfBirth}</div>
              ) : null}
            </div>
            <div className="col-md-6 form-field">
              <label htmlFor="sex" className="form-label">
                Sex
              </label>
              <select id="sex" className="form-control" {...formik.getFieldProps('sex')}>
                <option value="" label="Select sex" />
                <option value="male" label="Male" />
                <option value="female" label="Female" />
                <option value="other" label="Other" />
              </select>
              {formik.touched.sex && formik.errors.sex ? (
                <div className="text-danger">{formik.errors.sex}</div>
              ) : null}
            </div>
            <div className="col-md-6 form-field">
              <label htmlFor="age" className="form-label">
                Your Have
              </label>
              <input
                type="text"
                id="age"
                className="form-control"
                value={age !== null ? age : ''}
                readOnly
              />
              <label htmlFor="showAge" className="form-label">
                Show Age
              </label>
              <input type="checkbox" id="showAge" {...formik.getFieldProps('showAge')} />
            </div>
          </div>
          <div className="button-container mt-3">
            <button type="button" className="btn btn-secondary me-2" onClick={formik.submitForm}>
              Save
            </button>
            <button type="submit" className="btn btn-primary">
              Continue
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default PersonalInfo;
