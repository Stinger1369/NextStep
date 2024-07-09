// src/redux/features/conversation/conversationSlice.ts

import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Conversation } from '../../../../types';

interface ConversationState {
  conversations: Conversation[];
  loading: boolean;
  error: string | null;
}

const initialState: ConversationState = {
  conversations: [],
  loading: false,
  error: null
};

const conversationSlice = createSlice({
  name: 'conversation',
  initialState,
  reducers: {
    fetchConversationsStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    fetchConversationsSuccess: (state, action: PayloadAction<Conversation[]>) => {
      state.loading = false;
      state.conversations = action.payload;
    },
    fetchConversationsFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
    }
  }
});

export const { fetchConversationsStart, fetchConversationsSuccess, fetchConversationsFailure } = conversationSlice.actions;
export default conversationSlice.reducer;
