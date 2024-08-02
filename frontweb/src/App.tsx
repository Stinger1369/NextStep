import React, { useEffect } from 'react';
import './App.css';
import AppRoutes from './routes/AppRoutes';
import { useDispatch } from 'react-redux';
import { initializeAuthState, refreshToken } from './redux/features/auth/authSlice';
import { AppDispatch } from './redux/store';
import Cookies from 'js-cookie';
import 'bootstrap/dist/css/bootstrap.min.css';

const App: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    // Initialisation de l'état à partir des cookies
    const user = Cookies.get('user');
    const token = Cookies.get('token');
    const refreshToken = Cookies.get('refreshToken');
    if (user && token && refreshToken) {
      localStorage.setItem('user', user);
      localStorage.setItem('token', token);
      localStorage.setItem('refreshToken', refreshToken);
    }
    dispatch(initializeAuthState());
  }, [dispatch]);

  useEffect(() => {
    const interval = setInterval(
      () => {
        dispatch(refreshToken());
      },
      55 * 60 * 1000
    );

    return () => clearInterval(interval);
  }, [dispatch]);

  return (
    <div className="app">
      <div className="content">
        <AppRoutes />
      </div>
    </div>
  );
};

export default App;
