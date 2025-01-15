import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AuthState, AuthView } from './types';

const initialState: AuthState = {
  currentView: 'init',
};

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setView: (state, action: PayloadAction<AuthView>) => {
      state.currentView = action.payload;
    },
  },
});

export const { setView } = authSlice.actions;
export default authSlice.reducer;
