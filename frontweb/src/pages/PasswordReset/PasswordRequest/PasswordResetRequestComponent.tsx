import React, { useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { AppDispatch } from '../../../redux/store';
import { performRequestPasswordReset } from '../../../redux/features/auth/authPasswordReset';
import './PasswordResetRequestComponent.css';

const PasswordResetRequestComponent: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const [message, setMessage] = useState<string | null>(null);
  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: {
      email: ''
    },
    validationSchema: Yup.object({
      email: Yup.string().required('Required')
    }),
    onSubmit: async (values, { setSubmitting }) => {
      try {
        await dispatch(performRequestPasswordReset(values.email));
        localStorage.setItem('resetEmail', values.email); // Store email in local storage
        setMessage('Password reset link sent to your email.');
        navigate('/password-reset'); // Redirect to password reset page
      } catch (error) {
        console.error('Request password reset error:', error);
        setMessage('Error requesting password reset.');
      } finally {
        setSubmitting(false);
      }
    }
  });

  return (
    <div className="password-reset-request-container">
      <h2>Request Password Reset</h2>
      {message && <div className="message">{message}</div>}
      <form onSubmit={formik.handleSubmit} className="password-reset-request-form">
        <div className="form-field">
          <input
            type="text"
            id="email"
            {...formik.getFieldProps('email')}
            placeholder="Email or Phone"
            className={`input ${formik.touched.email && formik.errors.email ? 'error-input' : ''}`}
          />
          {formik.touched.email && formik.errors.email ? (
            <div className="error">{formik.errors.email}</div>
          ) : null}
        </div>
        <button type="submit" className="submit-button" disabled={formik.isSubmitting}>
          {formik.isSubmitting ? 'Submitting...' : 'Submit'}
        </button>
      </form>
    </div>
  );
};

export default PasswordResetRequestComponent;
