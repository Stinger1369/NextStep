import React, { useState, useEffect } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { AppDispatch } from '../../../redux/store';
import { performResetPassword } from '../../../redux/features/auth/authPasswordReset';
import './PasswordResetComponent.css';

const PasswordResetComponent: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const [message, setMessage] = useState<string | null>(null);
  const [email, setEmail] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedEmail = localStorage.getItem('resetEmai');
    if (storedEmail) {
      setEmail(storedEmail);
    } else {
      setMessage('No email found. Please request a password reset first.');
    }
  }, []);

  const formik = useFormik({
    initialValues: {
      code: '',
      newPassword: ''
    },
    validationSchema: Yup.object({
      code: Yup.string().required('Required'),
      newPassword: Yup.string().min(6, 'Password must be at least 6 characters').required('Required')
    }),
    onSubmit: async (values, { setSubmitting }) => {
      if (!email) {
        setMessage('No email found. Please request a password reset first.');
        setSubmitting(false);
        return;
      }
      try {
        await dispatch(performResetPassword(email, values.code, values.newPassword));
        setMessage('Password reset successfully. You will be redirected to the login page.');
        setTimeout(() => {
          navigate('/login');
        }, 1000);
      } catch (error) {
        console.error('Password reset error:', error);
        setMessage('Error resetting password.');
      } finally {
        setSubmitting(false);
      }
    }
  });

  return (
    <div className="password-reset-container">
      <h2>Reset Password</h2>
      {message && <div className="message">{message}</div>}
      <form onSubmit={formik.handleSubmit} className="password-reset-form">
        <div className="form-field">
          <input type="text" id="code" {...formik.getFieldProps('code')} placeholder="Verification Code" className={`input ${formik.touched.code && formik.errors.code ? 'error-input' : ''}`} />
          {formik.touched.code && formik.errors.code ? <div className="error">{formik.errors.code}</div> : null}
        </div>
        <div className="form-field">
          <input
            type="password"
            id="newPassword"
            {...formik.getFieldProps('newPassword')}
            placeholder="New Password"
            className={`input ${formik.touched.newPassword && formik.errors.newPassword ? 'error-input' : ''}`}
          />
          {formik.touched.newPassword && formik.errors.newPassword ? <div className="error">{formik.errors.newPassword}</div> : null}
        </div>
        <button type="submit" className="submit-button" disabled={formik.isSubmitting}>
          {formik.isSubmitting ? 'Submitting...' : 'Submit'}
        </button>
      </form>
    </div>
  );
};

export default PasswordResetComponent;
