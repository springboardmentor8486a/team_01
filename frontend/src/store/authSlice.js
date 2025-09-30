import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  email: '',
  otp: '',
  user: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setEmail(state, action) {
      state.email = action.payload;
    },
    setOtp(state, action) {
      state.otp = action.payload;
    },
    setUser(state, action) {
      state.user = action.payload;
    },
  },
});

export const { setEmail, setOtp, setUser } = authSlice.actions;
export default authSlice.reducer;
