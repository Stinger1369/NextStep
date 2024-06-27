// src/App.tsx
import React, { useEffect } from 'react';
import './App.css';
import AppRoutes from './routes/AppRoutes';
import { useDispatch } from 'react-redux';
import { refreshToken } from './redux/features/auth/authSlice';
import { AppDispatch } from './redux/store'; // Import AppDispatch

const App: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>(); // Use AppDispatch to type the dispatch function

  useEffect(() => {
    const interval = setInterval(
      () => {
        dispatch(refreshToken());
      },
      55 * 60 * 1000
    ); // Refresh the token every 55 minutes

    return () => clearInterval(interval);
  }, [dispatch]);

  return (
    <div className="App">
      <AppRoutes />
    </div>
  );
};

export default App;
