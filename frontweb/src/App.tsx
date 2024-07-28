// src/App.tsx
import React, { useEffect } from 'react';
import './App.css';
import AppRoutes from './routes/AppRoutes';
import { useDispatch } from 'react-redux';
import { refreshToken } from './redux/features/auth/authSlice';
import { AppDispatch } from './redux/store';
import 'bootstrap/dist/css/bootstrap.min.css';

const App: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();

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
    <div className="App">
      <div className="content">
        <AppRoutes />
      </div>
    </div>
  );
};

export default App;
