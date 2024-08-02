import { createAsyncThunk } from '@reduxjs/toolkit';
import {
  fetchUserRequest,
  fetchUserSuccess,
  fetchUserFailure,
  createUserRequest,
  createUserSuccess,
  createUserFailure,
  setCurrentUser
} from '../userWebSocketSlice';
import { getUserById, createUser } from '../../../../../websocket/userWebSocket';
import { User, Post, Notification, Conversation } from '../../../../../types';

interface RawUser {
  _id: string;
  email: string;
  firstName: string;
  lastName: string;
  apiKey: string;
  posts?: Post[];
  notifications?: Notification[];
  conversations?: Conversation[];
  likes?: string[];
  unlikes?: string[];
  friends?: string[];
  friendRequests?: string[];
  following?: string[];
  followers?: string[];
  profileVisits?: { userId: string; visitDate: string }[];
  blocks?: string[];
}

export const fetchUser = createAsyncThunk(
  'user/fetchUser',
  async (userId: string, { dispatch }) => {
    dispatch(fetchUserRequest());
    try {
      const user = await getUserById(userId);
      dispatch(fetchUserSuccess(user));
      return user;
    } catch (error) {
      if (error instanceof Error) {
        dispatch(fetchUserFailure(error.message));
      } else {
        dispatch(fetchUserFailure('An unknown error occurred'));
      }
      throw error;
    }
  }
);

export const createUserAndSetCurrent = createAsyncThunk(
  'user/createAndSetCurrent',
  async (userData: { email: string; firstName: string; lastName: string }, { dispatch }) => {
    dispatch(createUserRequest());
    try {
      console.log('Creating user with data:', userData);
      const user = await createUser(userData.email, userData.firstName, userData.lastName);
      console.log('User created:', user);

      // Vérifiez que toutes les informations nécessaires sont présentes
      if (user && user.id && user.email && user.firstName && user.lastName && user.apiKey) {
        const adaptedUser: User = {
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          apiKey: user.apiKey,
          posts: user.posts || [],
          notifications: user.notifications || [],
          conversations: user.conversations || [],
          likes: user.likes || [],
          unlikes: user.unlikes || [],
          friends: user.friends || [],
          friendRequests: user.friendRequests || [],
          following: user.following || [],
          followers: user.followers || [],
          profileVisits: user.profileVisits || [],
          blocks: user.blocks || []
        };

        dispatch(createUserSuccess(adaptedUser));
        dispatch(setCurrentUser(adaptedUser));

        // Stockage des informations de l'utilisateur dans le localStorage
        localStorage.setItem('currentUserId', adaptedUser.id);
        localStorage.setItem('currentUserEmail', adaptedUser.email);
        localStorage.setItem('currentUserFirstName', adaptedUser.firstName);
        localStorage.setItem('currentUserLastName', adaptedUser.lastName);
        localStorage.setItem('currentUserApiKey', adaptedUser.apiKey);

        console.log('User data stored in localStorage');

        return adaptedUser;
      } else {
        console.error('Incomplete user data:', user);
        throw new Error('Incomplete user data received from server');
      }
    } catch (error) {
      console.error('Error creating user:', error);
      if (error instanceof Error) {
        dispatch(createUserFailure(error.message));
      } else {
        dispatch(createUserFailure('An unknown error occurred'));
      }
      throw error;
    }
  }
);
