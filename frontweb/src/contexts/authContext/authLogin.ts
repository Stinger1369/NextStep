// src/contexts/authContext/authLogin.ts
import axiosInstance from "../../axiosConfig";

export const login = async (
  emailOrPhone: string,
  password: string,
  setUser: any,
  setToken: any,
  setRefreshToken: any
) => {
  const response = await axiosInstance.post("/auth/login", {
    emailOrPhone,
    password,
  });
  const { token, refreshToken, user } = response.data;
  setUser(user);
  setToken(token);
  setRefreshToken(refreshToken);
  localStorage.setItem("token", token);
  localStorage.setItem("refreshToken", refreshToken);
};
