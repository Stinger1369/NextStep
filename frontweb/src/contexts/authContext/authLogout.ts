// src/contexts/authContext/authLogout.ts
import { User } from "../AuthContext";

export const logout = (
  setUser: React.Dispatch<React.SetStateAction<User | null>>,
  setToken: React.Dispatch<React.SetStateAction<string | null>>,
  setRefreshToken: React.Dispatch<React.SetStateAction<string | null>>
) => {
  setUser(null);
  setToken(null);
  setRefreshToken(null);
  localStorage.removeItem("user");
  localStorage.removeItem("token");
  localStorage.removeItem("refreshToken");
};
