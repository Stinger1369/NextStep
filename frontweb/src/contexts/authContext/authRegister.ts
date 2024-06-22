// src/contexts/authContext/authRegister.ts
import axiosInstance from "../../axiosConfig";
import { User } from "../AuthContext";

export const register = async (
  formData: FormData,
  setUser: (user: User | null) => void
) => {
  try {
    const response = await axiosInstance.post("/auth/register", formData);
    const { user } = response.data;
    setUser(user);
    localStorage.setItem("user", JSON.stringify(user));
  } catch (error) {
    console.error("Register error:", error);
  }
};
