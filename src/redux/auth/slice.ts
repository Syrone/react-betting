import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit'

import { type IUser } from '@models/IUser'
import { type IStatus } from '@models/IStatus'
import { type IError } from '@models/IError'
import { type AuthResponse } from '@models/response/AuthResponse'

import AuthService from '@services/AuthService'

export interface IState {
  status: IStatus
  error: IError | null
  user: IUser | null
  isAuth: boolean
  isRefreshing: boolean
}

const initialState: IState = {
  status: 'initial',
  error: null,
  user: null,
  isAuth: false,
  isRefreshing: true,
}

export const loginUser = createAsyncThunk<
  AuthResponse,                           // return type of payloadCreator
  { email: string; password: string },    // first argument to payloadCreator
  { rejectValue: IError }                 // тип ошибки для rejectWithValue
>(
  'auth/login',
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await AuthService.login(credentials.email, credentials.password)
      return response.data
    } catch (error: any) {
      const status = error.response?.status || 0
      const message = error.response?.data?.message || 'Login failed'
      return rejectWithValue({ message, status, error: error.response?.data || null })
    }
  }
)

export const registerUser = createAsyncThunk<
  IUser,
  { username: string; email: string; password: string, referral_code?: string },
  { rejectValue: IError }
>(
  'auth/register',
  async ({ username, email, password, referral_code }, { rejectWithValue }) => {
    try {
      const response = await AuthService.registration(username, email, password, referral_code)
      return response.data as IUser
    } catch (error: any) {
      const status = error.response?.status || 0
      const message = error.response?.data?.message || 'Registration failed'
      return rejectWithValue({ message, status, error: error.response?.data || null })
    }
  }
)

export const logoutUser = createAsyncThunk('auth/logout', async () => {
  await AuthService.logout()
  localStorage.removeItem('token')
})

export const verify = createAsyncThunk<
  string,
  { token: string },
  { rejectValue: IError }
>(
  'auth/verify',
  async ({ token }, { rejectWithValue }) => {
    try {
      const response = await AuthService.verify(token)
      return response.data
    } catch (error: any) {
      const status = error.response?.status || 0
      const message = error.response?.data?.message || 'Verify Accound failed'
      return rejectWithValue({ message, status, error: error.response?.data || null })
    }
  }
)

export const refreshUser = createAsyncThunk<
  AuthResponse,
  void,
  { rejectValue: IError }
>(
  'auth/refresh',
  async (_, { rejectWithValue }) => {
    try {
      const response = await AuthService.refresh()
      return response.data
    } catch (error: any) {
      const status = error.response?.status || 0
      const message = error.response?.data?.message || 'Refresh failed'
      return rejectWithValue({ message, status, error: error.response?.data || null })
    }
  }
)

export const forgotPassword = createAsyncThunk<
  void,
  { email: string },
  { rejectValue: IError }
>(
  'auth/forgotPassword',
  async ({ email }, { rejectWithValue }) => {
    try {
      await AuthService.forgotPassword(email)
    } catch (error: any) {
      const status = error.response?.status || 0
      const message = error.response?.data?.message || 'Password reset failed'
      return rejectWithValue({ message, status, error: error.response?.data || null })
    }
  }
)

export const resetPassword = createAsyncThunk<
  void,
  { token: string; password: string },
  { rejectValue: IError }
>(
  'auth/resetPassword',
  async ({ token, password }, { rejectWithValue }) => {
    try {
      await AuthService.resetPassword(token, password)
    } catch (error: any) {
      const status = error.response?.status || 0
      const message = error.response?.data?.message || 'Password reset failed'
      return rejectWithValue({ message, status, error: error.response?.data || null })
    }
  }
)

export const resetPasswordVerify = createAsyncThunk<
  boolean,
  { token: string },
  { rejectValue: IError }
>(
  'auth/resetPasswordVerify',
  async ({ token }, { rejectWithValue }) => {
    try {
      await AuthService.resetPasswordVerify(token)
    } catch (error: any) {
      const status = error.response?.status || 0
      const message = error.response?.data?.message || 'Verify Password reset failed'
      return rejectWithValue({ message, status, error: error.response?.data || null })
    }
  }
)

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    resetError(state) {
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.status = 'loading'
        state.error = null
        state.isRefreshing = false
      })
      .addCase(loginUser.fulfilled, (state, action: PayloadAction<AuthResponse>) => {
        state.status = 'success'
        state.user = action.payload.user
        state.isAuth = true

        localStorage.setItem('token', action.payload.access_token)
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.status = 'failed'

        state.error = action.payload || { message: action.error?.message || 'Unknown error', status: 0 }
      })

    builder
      .addCase(registerUser.pending, (state) => {
        state.status = 'loading'
        state.error = null
      })
      .addCase(registerUser.fulfilled, (state, action: PayloadAction<IUser>) => {
        state.status = 'success'
        state.user = action.payload
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.payload || { message: action.error?.message || 'Unknown error', status: 0 }
      })

    builder.addCase(logoutUser.fulfilled, (state) => {
      state.status = 'initial'
      state.error = null
      state.user = null
      state.isAuth = false
    })

    builder
      .addCase(refreshUser.pending, (state) => {
        state.status = 'loading'
        state.error = null
        state.isRefreshing = true
      })
      .addCase(refreshUser.fulfilled, (state, action: PayloadAction<AuthResponse>) => {
        state.status = 'success'
        state.user = action.payload.user
        state.isAuth = true
        state.isRefreshing = false

        localStorage.setItem('token', action.payload.access_token)
      })
      .addCase(refreshUser.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.payload || { message: action.error?.message || 'Unknown error', status: 0 }
        state.user = null
        state.isAuth = false
        state.isRefreshing = false
      })
  },
})

export const { resetError } = authSlice.actions
export default authSlice.reducer
