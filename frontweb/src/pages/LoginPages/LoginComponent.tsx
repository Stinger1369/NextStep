// src/components/LoginComponent.tsx

import React from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../redux/store';
import { login } from '../../redux/features/auth/authSlice';
import { createUserAndSetCurrent } from '../../redux/features/websocket/users/userWebsocketThunks/userWebsocketThunks';
import { AxiosError } from 'axios';
import './LoginComponent.css';

const LoginComponent: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const user = useSelector((state: RootState) => state.auth.user);
  const navigate = useNavigate();

  const handleLogin = async (
    values: { email: string; password: string },
    setSubmitting: (isSubmitting: boolean) => void,
    setErrors: (errors: Partial<{ email?: string; password?: string }>) => void
  ) => {
    try {
      const resultAction = await dispatch(
        login({
          email: values.email,
          password: values.password
        })
      ).unwrap();

      if (resultAction.user) {
        await handleCreateUser(resultAction.user);
        navigate('/');
      }
    } catch (error) {
      handleLoginError(error, setErrors);
      setSubmitting(false);
    }
  };

  const handleCreateUser = async (user: { email: string; firstName?: string; lastName?: string }) => {
    const createdUser = await dispatch(
      createUserAndSetCurrent({
        email: user.email,
        firstName: user.firstName ?? 'DefaultFirstName',
        lastName: user.lastName ?? 'DefaultLastName'
      })
    ).unwrap();

    // Stocker les informations utilisateur dans localStorage
    console.log('createdUser:', createdUser); // Ajouter un log pour vérifier la structure de createdUser
    localStorage.setItem('currentUserId', createdUser.id); // Utilisez createdUser.id
    localStorage.setItem('currentUserFirstName', createdUser.firstName);
    localStorage.setItem('currentUserLastName', createdUser.lastName);

    console.log('User created on the server: Java Websocket', createdUser, 'User ID for already exists:', createdUser.id);
  };

  const handleLoginError = (error: unknown, setErrors: (errors: Partial<{ email?: string; password?: string }>) => void) => {
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
          state: { email: formik.values.email }
        });
      } else {
        setErrors({ email: 'An error occurred. Please try again.' });
      }
    } else {
      setErrors({ email: 'An error occurred. Please try again.' });
    }
  };

  const formik = useFormik({
    initialValues: {
      email: '',
      password: ''
    },
    validationSchema: Yup.object({
      email: Yup.string().required('Required'),
      password: Yup.string().min(6, 'Password must be at least 6 characters').required('Required')
    }),
    onSubmit: (values, { setSubmitting, setErrors }) => {
      handleLogin(values, setSubmitting, setErrors);
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
