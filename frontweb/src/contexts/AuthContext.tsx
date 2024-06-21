import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";
import axiosInstance from "../axiosConfig";
import { useUser } from "./UserContext";

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
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const { getUserById } = useUser();

  const getUserFromLocalStorage = () => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      try {
        return JSON.parse(savedUser);
      } catch (error) {
        console.error("Failed to parse user from localStorage", error);
        return null;
      }
    }
    return null;
  };

  const getTokenFromLocalStorage = () => {
    return localStorage.getItem("token");
  };

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
          logout();
        }
      }
    };
    if (token) {
      fetchUser();
    }
  }, [token]);

  const login = async (emailOrPhone: string, password: string) => {
    const response = await axiosInstance.post("/auth/login", {
      emailOrPhone,
      password,
    });
    setToken(response.data.token);
    setUser(response.data.user);
    localStorage.setItem("token", response.data.token);
    localStorage.setItem("user", JSON.stringify(response.data.user));
    axiosInstance.defaults.headers.common[
      "Authorization"
    ] = `Bearer ${response.data.token}`;
  };

  const register = async (formData: FormData) => {
    try {
      await axiosInstance.post("/auth/register", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
    } catch (error) {
      console.error("Error registering user:", error);
      throw error;
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    delete axiosInstance.defaults.headers.common["Authorization"];
  };

  return (
    <AuthContext.Provider value={{ user, token, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

const parseJwt = (token: string) => {
  try {
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => {
          return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
        })
        .join("")
    );
    return JSON.parse(jsonPayload);
  } catch (e) {
    console.error("Failed to parse JWT", e);
    return null;
  }
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
