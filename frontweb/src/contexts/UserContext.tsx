import React, { createContext, useContext, useState, ReactNode } from "react";
import axios from "axios";

interface Address {
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

interface User {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  userType: string;
  phone: string;
  dateOfBirth: Date;
  age?: number;
  address: Address;
  profession?: string;
  company?: string;
  bio?: string;
  experience?: string;
  education?: string;
  skills?: string[];
}

interface UserContextType {
  users: User[];
  user: User | null;
  getUserById: (id: string) => Promise<void>;
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
      const response = await axios.get("/api/users");
      setUsers(response.data);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  const getUserById = async (id: string) => {
    if (!id) return; // Ne pas faire de requête si l'ID est undefined
    try {
      const response = await axios.get(`/api/users/${id}`);
      setUser(response.data);
    } catch (error) {
      console.error("Error fetching user:", error);
    }
  };

  const updateUser = async (id: string, userData: Partial<User>) => {
    try {
      const response = await axios.put(`/api/users/${id}`, userData);
      setUser(response.data);
      await getUsers(); // Refresh the user list
    } catch (error) {
      console.error("Error updating user:", error);
    }
  };

  const deleteUser = async (id: string) => {
    try {
      await axios.delete(`/api/users/${id}`);
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
