// src/contexts/authContext/authLogin.ts
import axiosInstance from "../../axiosConfig";
import { User } from "../AuthContext";

export const login = async (
  emailOrPhone: string,
  password: string,
  setUser: (user: User | null) => void,
  setToken: (token: string | null) => void,
  setRefreshToken: (refreshToken: string | null) => void
) => {
  try {
    const response = await axiosInstance.post("/auth/login", {
      emailOrPhone,
      password,
    });
    const { token, refreshToken, user } = response.data;
    setUser(user);
    setToken(token);
    setRefreshToken(refreshToken);
    localStorage.setItem("user", JSON.stringify(user));
    localStorage.setItem("token", token);
    localStorage.setItem("refreshToken", refreshToken);
  } catch (error) {
    throw error;
  }
};
