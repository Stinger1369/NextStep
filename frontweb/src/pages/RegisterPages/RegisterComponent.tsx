import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { AppDispatch } from '../../redux/store';
import { registerUser } from '../../redux/features/auth/authRegister';
import './RegisterComponent.css';

const RegisterComponent: React.FC = () => {
  const [emailOrPhone, setEmailOrPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    const formData = new FormData();
    formData.append('emailOrPhone', emailOrPhone);
    formData.append('password', password);

    try {
      await registerUser(formData, dispatch);
      navigate('/verify-email', { state: { emailOrPhone } });
    } catch (error) {
      if (error instanceof Error) {
        console.error('Error registering user:', error.message);
        setError(error.message);
      } else {
        console.error('Unknown error registering user:', error);
        setError('Error registering user. Please check the form and try again.');
      }
    }
  };

  return (
    <div className="register-container">
      {error && <div className="error">{error}</div>}
      <form onSubmit={handleSubmit} className="register-form">
        <input type="text" value={emailOrPhone} onChange={(e) => setEmailOrPhone(e.target.value)} placeholder="Email or Phone" className="register-input" required />
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" className="register-input" required />
        <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="Confirm Password" className="register-input" required />
        <button type="submit" className="register-button">
          Register
        </button>
      </form>
    </div>
  );
};

export default RegisterComponent;
