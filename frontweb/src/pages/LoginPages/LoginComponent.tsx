import React, { useEffect, useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../redux/store';
import { login } from '../../redux/features/auth/authSlice';
import { createUserAndSetCurrent } from '../../redux/features/websocket/users/userWebsocketThunks/userWebsocketThunks';
import { AxiosError } from 'axios';
import Cookies from 'js-cookie';
import './LoginComponent.css';

// Importer l'interface User depuis authSlice ou userSlice
import { User } from '../../redux/features/auth/authSlice'; // Ou userSlice si nécessaire

const LoginComponent: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const user = useSelector((state: RootState) => state.auth.user);
  const navigate = useNavigate();
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [welcomeMessage, setWelcomeMessage] = useState<string | null>(null);

  useEffect(() => {
    const userName = Cookies.get('userName');
    if (userName) {
      setWelcomeMessage(`Welcome back, ${userName}!`);
    }
  }, []);

  useEffect(() => {
    if (user?.images && user.images.length > 0) {
      setProfileImage(user.images[0]); // Set the first image as profile image
    }
  }, [user]);

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
        const createdUser = await handleCreateUser(resultAction.user);
        storeUserInfo(createdUser);
        navigate('/');
      }
    } catch (error) {
      handleLoginError(error, setErrors);
      setSubmitting(false);
    }
  };

  const handleCreateUser = async (user: { email: string; firstName?: string; lastName?: string }) => {
    try {
      const createdUser = await dispatch(
        createUserAndSetCurrent({
          email: user.email,
          firstName: user.firstName ?? 'DefaultFirstName',
          lastName: user.lastName ?? 'DefaultLastName'
        })
      ).unwrap();

      return createdUser;
    } catch (error) {
      console.error('Error creating user:', error);
      throw error;
    }
  };

  const storeUserInfo = (user: { id: string; email: string; firstName: string; lastName: string; apiKey: string }) => {
    localStorage.setItem('currentUserId', user.id);
    localStorage.setItem('currentUserEmail', user.email);
    localStorage.setItem('currentUserFirstName', user.firstName);
    localStorage.setItem('currentUserLastName', user.lastName);
    localStorage.setItem('currentUserApiKey', user.apiKey);
    console.log('User info stored in localStorage:', user);
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

  const isProfileComplete = (user: User): boolean => {
    const requiredFields: (keyof User)[] = ['firstName', 'lastName', 'email', 'profession', 'phone', 'dateOfBirth', 'bio'];
    const addressFields: (keyof NonNullable<User['address']>)[] = ['street', 'city', 'state', 'zipCode', 'country'];

    const hasRequiredFields = requiredFields.every((field) => !!user[field]);
    const hasAddressFields = user.address && addressFields.every((field) => user.address && !!user.address[field]);
    const hasMedia = user.images && user.images.length > 0;
    const hasExperience = user.experience && user.experience.length > 0;
    const hasEducation = user.education && user.education.length > 0;
    const hasSkills = user.skills && user.skills.length > 0;

    return (
      hasRequiredFields !== undefined &&
      hasAddressFields !== undefined &&
      hasMedia !== undefined &&
      hasExperience !== undefined &&
      hasEducation !== undefined &&
      hasSkills !== undefined &&
      hasRequiredFields &&
      hasAddressFields &&
      hasMedia &&
      hasExperience &&
      hasEducation &&
      hasSkills
    );
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
    <div className="LoginComponent-container">
      {welcomeMessage && <p className="LoginComponent-welcome-message">{welcomeMessage}</p>}
      {user ? (
        <div className="LoginComponent-user-info">
          {profileImage && <img src={profileImage} alt="Profile" className="LoginComponent-profile-image" />}
          <p className="LoginComponent-welcome-text">Welcome, {user.firstName ? user.firstName : user.email}!</p>
          <p className="LoginComponent-profession">Profession: {user.profession || 'Not specified'}</p>
          <div className="LoginComponent-counters">
            <div className="LoginComponent-counter">
              <p>Profile Pro Visits</p>
              <p>123</p>
            </div>
            <div className="LoginComponent-counter">
              <p>Profile Member Visits</p>
              <p>456</p>
            </div>
            <div className="LoginComponent-counter">
              <p>Other Visits</p>
              <p>789</p>
            </div>
          </div>
          <button className="LoginComponent-complete-profile-button" onClick={() => navigate(isProfileComplete(user) ? '/profile-edit-user/personal-info' : '/role-selection')}>
            {isProfileComplete(user) ? 'Edit your profile' : 'Complete your profile'}
          </button>
        </div>
      ) : (
        <form onSubmit={formik.handleSubmit} className="LoginComponent-form">
          <div className="LoginComponent-form-field">
            <input
              type="text"
              id="email"
              {...formik.getFieldProps('email')}
              placeholder="Email or Phone"
              className={`LoginComponent-input ${formik.touched.email && formik.errors.email ? 'LoginComponent-error-input' : ''}`}
            />
            {formik.touched.email && formik.errors.email ? (
              <div className="LoginComponent-error">
                {formik.errors.email}
                {formik.errors.email.includes('Email or phone does not exist.') && (
                  <button type="button" className="LoginComponent-register-button" onClick={() => navigate('/register')}>
                    Register
                  </button>
                )}
                {formik.errors.email.includes('Your account is not verified.') && (
                  <button
                    type="button"
                    className="LoginComponent-verify-button"
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
          <div className="LoginComponent-form-field">
            <input
              type="password"
              id="password"
              {...formik.getFieldProps('password')}
              placeholder="Password"
              className={`LoginComponent-input ${formik.touched.password && formik.errors.password ? 'LoginComponent-error-input' : ''}`}
            />
            {formik.touched.password && formik.errors.password ? <div className="LoginComponent-error">{formik.errors.password}</div> : null}
          </div>
          <button type="submit" className="LoginComponent-button" disabled={formik.isSubmitting}>
            {formik.isSubmitting ? 'Logging in...' : 'Login'}
          </button>
          <Link to="/password-request-reset" className="LoginComponent-forgot-password-link">
            Forgot your password?
          </Link>
        </form>
      )}
    </div>
  );
};

export default LoginComponent;
