import React ,{ useEffect } from "react";
import "./App.css";
import AppRoutes from "./routes/AppRoutes";
import { useAuth } from "./contexts/AuthContext";


const App: React.FC = () => {
  const { refresh } = useAuth();

  useEffect(() => {
    const interval = setInterval(() => {
      refresh();
    }, 55 * 60 * 1000); // Rafraîchit le token toutes les 55 minutes

    return () => clearInterval(interval);
  }, [refresh]);
  return (
    <div className="App">
      <AppRoutes />
    </div>
  );
};

export default App;
