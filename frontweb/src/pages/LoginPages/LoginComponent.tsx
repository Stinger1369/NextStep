// src/components/LoginComponent.tsx

import React from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../redux/store';
import { login } from '../../redux/features/auth/authSlice';
import { createUser } from '../../websocket/userWebSocket';
import { AxiosError } from 'axios';
import './LoginComponent.css';

const LoginComponent: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const user = useSelector((state: RootState) => state.auth.user);
  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: {
      email: '',
      password: ''
    },
    validationSchema: Yup.object({
      email: Yup.string().required('Required'),
      password: Yup.string().min(6, 'Password must be at least 6 characters').required('Required')
    }),
    onSubmit: async (values, { setSubmitting, setErrors }) => {
      try {
        const resultAction = await dispatch(
          login({
            email: values.email,
            password: values.password
          })
        ).unwrap();

        if (resultAction.user) {
          console.log('User ID:', resultAction.user._id);
          const createdUser = await createUser(resultAction.user.email, resultAction.user.firstName ?? 'DefaultFirstName', resultAction.user.lastName ?? 'DefaultLastName');
          console.log('User created on the server: Java Websocket', createdUser, 'User ID for already exists:', createdUser.userId);
          localStorage.setItem('currentUserId', createdUser.userId);
          navigate('/'); // Rediriger vers la page d'accueil après une connexion réussie
        }
      } catch (error) {
        setSubmitting(false);
        if (isAxiosError(error)) {
          if (error.message === 'Request failed with status code 404') {
            setErrors({
              email: 'Email or phone does not exist. Would you like to register?'
            });
          } else if (error.message === 'Request failed with status code 400') {
            setErrors({
              password: 'Incorrect password. Forgot your password?'
            });
          } else if (error.message === 'Request failed with status code 401' && isErrorWithResponseData(error) && error.response!.data.message === 'Email not verified') {
            setErrors({
              email: 'Your account is not verified. Please verify your account to continue.'
            });
            navigate('/verify-email', {
              state: { email: values.email }
            });
          } else {
            setErrors({ email: 'An error occurred. Please try again.' });
          }
        } else {
          setErrors({ email: 'An error occurred. Please try again.' });
        }
      }
    }
  });

  function isAxiosError(error: unknown): error is AxiosError {
    return (error as AxiosError).isAxiosError === true;
  }

  function isErrorWithResponseData(error: AxiosError): error is AxiosError<{ message: string }> {
    return (
      typeof error.response === 'object' &&
      error.response !== null &&
      'data' in error.response &&
      typeof error.response.data === 'object' &&
      error.response.data !== null &&
      'message' in error.response.data
    );
  }

  return (
    <div className="login-container">
      {user ? (
        <div>
          <p>Welcome, {user.firstName ? user.firstName : user.email}!</p>
          <button onClick={() => navigate('/role-selection')}>Complete your profile</button>
        </div>
      ) : (
        <form onSubmit={formik.handleSubmit} className="login-form">
          <div className="form-field">
            <input
              type="text"
              id="email"
              {...formik.getFieldProps('email')}
              placeholder="Email or Phone"
              className={`login-input ${formik.touched.email && formik.errors.email ? 'error-input' : ''}`}
            />
            {formik.touched.email && formik.errors.email ? (
              <div className="error">
                {formik.errors.email}
                {formik.errors.email.includes('Email or phone does not exist.') && (
                  <button type="button" className="register-button" onClick={() => navigate('/register')}>
                    Register
                  </button>
                )}
                {formik.errors.email.includes('Your account is not verified.') && (
                  <button
                    type="button"
                    className="verify-button"
                    onClick={() =>
                      navigate('/verify-email', {
                        state: { email: formik.values.email }
                      })
                    }
                  >
                    Verify Account
                  </button>
                )}
              </div>
            ) : null}
          </div>
          <div className="form-field">
            <input
              type="password"
              id="password"
              {...formik.getFieldProps('password')}
              placeholder="Password"
              className={`login-input ${formik.touched.password && formik.errors.password ? 'error-input' : ''}`}
            />
            {formik.touched.password && formik.errors.password ? <div className="error">{formik.errors.password}</div> : null}
          </div>
          <button type="submit" className="login-button" disabled={formik.isSubmitting}>
            {formik.isSubmitting ? 'Logging in...' : 'Login'}
          </button>
          <Link to="/password-request-reset" className="forgot-password-link">
            Forgot your password?
          </Link>
        </form>
      )}
    </div>
  );
};

export default LoginComponent;
