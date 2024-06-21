// src/contexts/AuthContext.tsx
import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";
import axiosInstance from "../axiosConfig";
import { useUser } from "./UserContext";
import { login } from "./authContext/authLogin";
import { register } from "./authContext/authRegister";
import { verifyEmail } from "./authContext/authVerifyEmail";
import { resendVerificationCode } from "./authContext/authResendVerificationCode";
import { requestPasswordReset } from "./authContext/authRequestPasswordReset"; // Import the requestPasswordReset function
import { resetPassword } from "./authContext/authResetPassword"; // Import the resetPassword function
import { logout } from "./authContext/authLogout";
import {
  getUserFromLocalStorage,
  getTokenFromLocalStorage,
  parseJwt,
} from "./authContext/authUtils";

interface User {
  _id: string;
  firstName?: string;
  lastName?: string;
  emailOrPhone: string;
  userType?: string;
  phone?: string;
  dateOfBirth?: Date;
  address?: {
    street?: string;
    city?: string;
    state?: string;
    zipCode?: string;
    country?: string;
  };
  age?: number;
  profession?: string;
  company?: string;
  bio?: string;
  experience?: string;
  education?: string;
  skills?: string[];
  images: string[];
  videos: string[];
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (emailOrPhone: string, password: string) => Promise<void>;
  register: (formData: FormData) => Promise<void>;
  verifyEmail: (emailOrPhone: string, code: string) => Promise<void>;
  resendVerificationCode: (emailOrPhone: string) => Promise<void>;
  requestPasswordReset: (emailOrPhone: string) => Promise<void>;
  resetPassword: (
    emailOrPhone: string,
    code: string,
    newPassword: string
  ) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const { getUserById } = useUser();

  const [user, setUser] = useState<User | null>(getUserFromLocalStorage);
  const [token, setToken] = useState<string | null>(getTokenFromLocalStorage);

  useEffect(() => {
    const fetchUser = async () => {
      if (token) {
        axiosInstance.defaults.headers.common[
          "Authorization"
        ] = `Bearer ${token}`;
        try {
          const parsedToken = parseJwt(token);
          const userId = parsedToken?.id;
          if (userId) {
            const fetchedUser = await getUserById(userId);
            setUser(fetchedUser);
            localStorage.setItem("user", JSON.stringify(fetchedUser));
          } else {
            throw new Error("User ID not found in token");
          }
        } catch (error) {
          console.error("Error fetching user:", error);
          logout(setUser, setToken);
        }
      }
    };
    if (token) {
      fetchUser();
    }
  }, [token]);

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        login: (emailOrPhone, password) =>
          login(emailOrPhone, password, setUser, setToken),
        register: (formData) => register(formData, setUser),
        verifyEmail,
        resendVerificationCode,
        requestPasswordReset, // Add the requestPasswordReset function to the context
        resetPassword, // Add the resetPassword function to the context
        logout: () => logout(setUser, setToken),
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
