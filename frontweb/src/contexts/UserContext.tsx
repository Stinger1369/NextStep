// src/contexts/UserContext.tsx
import React, { createContext, useContext, useState, ReactNode } from "react";
import axiosInstance from "../axiosConfig"; // Utilisez l'instance Axios configurée

interface Address {
  street?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  country?: string;
}

interface User {
  _id: string;
  firstName?: string;
  lastName?: string;
  emailOrPhone: string;
  userType?: string;
  phone?: string;
  dateOfBirth?: Date;
  address?: Address;
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

interface UserContextType {
  users: User[];
  user: User | null;
  getUserById: (id: string) => Promise<User>;
  getUsers: () => Promise<void>;
  updateUser: (id: string, userData: Partial<User>) => Promise<void>;
  deleteUser: (id: string) => Promise<void>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [users, setUsers] = useState<User[]>([]);
  const [user, setUser] = useState<User | null>(null);

  const getUsers = async () => {
    try {
      const response = await axiosInstance.get("/users");
      setUsers(response.data);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  const getUserById = async (id: string): Promise<User> => {
    console.log("Fetching user by ID:", id); // Log pour vérifier l'ID
    try {
      const response = await axiosInstance.get(`/users/${id}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching user:", error);
      throw error;
    }
  };

  const updateUser = async (id: string, userData: Partial<User>) => {
    try {
      const response = await axiosInstance.put(`/users/${id}`, userData);
      setUser(response.data);
      await getUsers(); // Refresh the user list
    } catch (error) {
      console.error("Error updating user:", error);
    }
  };

  const deleteUser = async (id: string) => {
    try {
      await axiosInstance.delete(`/users/${id}`);
      await getUsers(); // Refresh the user list
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };

  return (
    <UserContext.Provider
      value={{ users, user, getUserById, getUsers, updateUser, deleteUser }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUser = (): UserContextType => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};
