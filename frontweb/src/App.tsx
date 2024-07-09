// src/App.tsx
import React, { useEffect } from 'react';
import './App.css';
import AppRoutes from './routes/AppRoutes';
import { useDispatch } from 'react-redux';
import { refreshToken } from './redux/features/auth/authSlice';
import { AppDispatch } from './redux/store';
import { initializeWebSocket } from './websocket/websocket';

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

  useEffect(() => {
    initializeWebSocket(); // Initialize WebSocket connection
  }, []);

  return (
    <div className="App">
      <AppRoutes />
    </div>
  );
};

export default App;
