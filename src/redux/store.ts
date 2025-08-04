import { configureStore } from '@reduxjs/toolkit'
import { useDispatch } from 'react-redux'

import authSlice from '@redux/auth/slice'
import userSlice from '@redux/user/slice'
import paymentSlice from '@redux/payment/slice'

export const store = configureStore({
  reducer: {
    auth: authSlice,
    user: userSlice,
    payment: paymentSlice,
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

export const useAppDispatch = () => useDispatch<AppDispatch>()