import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  email: '',
  otp: '',
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
  },
});

export const { setEmail, setOtp } = authSlice.actions;
export default authSlice.reducer;
