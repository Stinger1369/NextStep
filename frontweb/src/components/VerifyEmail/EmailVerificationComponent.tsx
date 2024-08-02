import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom';
import { AppDispatch } from '../../redux/store';
import {
  performVerifyEmail,
  performResendVerificationCode
} from '../../redux/features/auth/authVerifyEmail';
//import "./VerifyEmailComponent.css";

const VerifyEmailComponent: React.FC = () => {
  const [code, setCode] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [canResend, setCanResend] = useState<boolean>(true);
  const [resendTimeout, setResendTimeout] = useState<number>(0);
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const location = useLocation();
  const email = location.state?.email;

  useEffect(() => {
    const resendTimestamp = localStorage.getItem('resendTimestamp');
    if (resendTimestamp) {
      const timePassed = Date.now() - parseInt(resendTimestamp);
      if (timePassed < 5 * 60 * 1000) {
        setCanResend(false);
        setResendTimeout(5 * 60 - Math.floor(timePassed / 1000));
      }
    }
  }, []);

  useEffect(() => {
    if (!canResend) {
      const interval = setInterval(() => {
        setResendTimeout((prev) => {
          if (prev <= 1) {
            clearInterval(interval);
            setCanResend(true);
            localStorage.removeItem('resendTimestamp');
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [canResend]);

  const handleResendCode = async () => {
    if (canResend) {
      try {
        await dispatch(performResendVerificationCode(email));
        localStorage.setItem('resendTimestamp', Date.now().toString());
        setCanResend(false);
        setResendTimeout(5 * 60); // 5 minutes
      } catch (err) {
        console.error('Error resending verification code:', err);
        setError('Error resending verification code. Please try again later.');
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setError('No email or phone found for verification.');
      return;
    }
    try {
      console.log('Submitting verification with email:', email, 'and code:', code);
      await dispatch(performVerifyEmail(email, code));
      navigate('/login');
    } catch (err) {
      console.error('Verification failed:', err);
      setError('Invalid or expired code.');
    }
  };

  return (
    <div className="verification-container">
      {error && <div className="error">{error}</div>}
      <form onSubmit={handleSubmit} className="verification-form">
        <input
          type="text"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          placeholder="Enter verification code"
          required
        />
        <button type="submit">Verify Email</button>
      </form>
      <div className="resend-container">
        <button onClick={handleResendCode} disabled={!canResend}>
          {canResend ? 'Resend Code' : `Resend in ${resendTimeout}s`}
        </button>
      </div>
    </div>
  );
};

export default VerifyEmailComponent;
