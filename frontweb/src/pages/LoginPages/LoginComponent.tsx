import React from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../redux/store';
import { login } from '../../redux/features/auth/authSlice';
import { AxiosError } from 'axios';
import './LoginComponent.css';

const LoginComponent: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const user = useSelector((state: RootState) => state.auth.user);
  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: {
      emailOrPhone: '',
      password: ''
    },
    validationSchema: Yup.object({
      emailOrPhone: Yup.string().required('Required'),
      password: Yup.string().min(6, 'Password must be at least 6 characters').required('Required')
    }),
    onSubmit: async (values, { setSubmitting, setErrors }) => {
      try {
        await dispatch(
          login({
            emailOrPhone: values.emailOrPhone,
            password: values.password
          })
        ).unwrap();
        navigate('/'); // Rediriger vers la page d'accueil après une connexion réussie
      } catch (error) {
        setSubmitting(false);
        if (isAxiosError(error)) {
          if (error.message === 'Request failed with status code 404') {
            setErrors({
              emailOrPhone: 'Email or phone does not exist. Would you like to register?'
            });
          } else if (error.message === 'Request failed with status code 400') {
            setErrors({
              password: 'Incorrect password. Forgot your password?'
            });
          } else if (error.message === 'Request failed with status code 401' && isErrorWithResponseData(error) && error.response!.data.message === 'Email not verified') {
            setErrors({
              emailOrPhone: 'Your account is not verified. Please verify your account to continue.'
            });
            navigate('/verify-email', {
              state: { emailOrPhone: values.emailOrPhone }
            });
          } else {
            setErrors({ emailOrPhone: 'An error occurred. Please try again.' });
          }
        } else {
          setErrors({ emailOrPhone: 'An error occurred. Please try again.' });
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
          <p>Welcome, {user.firstName ? user.firstName : user.emailOrPhone}!</p>
          <button onClick={() => navigate('/role-selection')}>Complete your profile</button>
        </div>
      ) : (
        <form onSubmit={formik.handleSubmit} className="login-form">
          <div className="form-field">
            <input
              type="text"
              id="emailOrPhone"
              {...formik.getFieldProps('emailOrPhone')}
              placeholder="Email or Phone"
              className={`login-input ${formik.touched.emailOrPhone && formik.errors.emailOrPhone ? 'error-input' : ''}`}
            />
            {formik.touched.emailOrPhone && formik.errors.emailOrPhone ? (
              <div className="error">
                {formik.errors.emailOrPhone}
                {formik.errors.emailOrPhone.includes('Email or phone does not exist.') && (
                  <button type="button" className="register-button" onClick={() => navigate('/register')}>
                    Register
                  </button>
                )}
                {formik.errors.emailOrPhone.includes('Your account is not verified.') && (
                  <button
                    type="button"
                    className="verify-button"
                    onClick={() =>
                      navigate('/verify-email', {
                        state: { emailOrPhone: formik.values.emailOrPhone }
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
