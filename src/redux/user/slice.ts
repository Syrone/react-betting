import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit'

import { type IStatus } from '@models/IStatus'
import { type IError } from '@models/IError'
import { type UserResponse } from '@models/response/UserResponse'

import UserService from '@services/UserService'
import { IUser } from '@models/IUser'
import { ILastOperation } from '@models/ILastOperation'

export interface IState {
  status: IStatus
  error: IError | null
  data: UserResponse | null
  operationsPage: number;
  opeartionsStatus: IStatus
  refreshStatus: IStatus
}

const initialState: IState = {
  status: 'initial',
  error: null,
  data: null,
  operationsPage: 1,
  opeartionsStatus: 'initial',
  refreshStatus: 'initial'
}

export const referral = createAsyncThunk<
	IUser,
	{ referral_code: string },
	{ rejectValue: IError }
>(
	'user/referral',
	async ({ referral_code }, { rejectWithValue }) => {
		try {
			const response = await UserService.referral(referral_code)
			return response.data
		} catch (error: any) {
			const status = error.response?.status || 0
			const message = error.response?.data?.message || 'Failed to fetch refresh referral code'
			return rejectWithValue({ message, status, error: error.response?.data || null })
		}
	}
)

export const dashboard = createAsyncThunk<
	UserResponse,
	void,
	{ rejectValue: IError }
>(
	'user/dashboard',
	async (_, { rejectWithValue }) => {
		try {
			const response = await UserService.dashboard()
			return response.data
		} catch (error: any) {
			const status = error.response?.status || 0
			const message = error.response?.data?.message || 'Failed to fetch dashboard data'
			return rejectWithValue({ message, status, error: error.response?.data || null })
		}
	}
)

export const operations = createAsyncThunk<
	ILastOperation,
	{ page: number, per_page: number },
	{ rejectValue: IError }
>(
	'user/operations',
	async ({ page, per_page = 10 }, { rejectWithValue }) => {
		try {
			const response = await UserService.operations(page, per_page)
			return response.data
		} catch (error: any) {
			const status = error.response?.status || 0
			const message = error.response?.data?.message || 'Failed to fetch dashboard data'
			return rejectWithValue({ message, status, error: error.response?.data || null })
		}
	}
)

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(referral.pending, (state) => {
        state.refreshStatus = 'loading'
        state.error = null
      })
      .addCase(referral.fulfilled, (state, action: PayloadAction<IUser>) => {
        state.refreshStatus = 'success'

        if (state.data && state.data.referral) {
          state.data.referral.referral_code = action.payload.referral_code
        }
      })
      .addCase(referral.rejected, (state, action) => {
        state.refreshStatus = 'failed'
        state.error = action.payload || { message: action.error.message || 'Unknown error', status: 0 }
        if (state.data && state.data.referral) {
          state.data.referral.referral_code = null
        }
      })

    builder
      .addCase(dashboard.pending, (state) => {
        state.status = 'loading'
        state.error = null
      })
      .addCase(dashboard.fulfilled, (state, action: PayloadAction<UserResponse>) => {
        state.status = 'success'
        state.data = action.payload
      })
      .addCase(dashboard.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.payload || { message: action.error.message || 'Unknown error', status: 0 }
        state.data = null
      })

    builder
      .addCase(operations.pending, (state) => {
        state.opeartionsStatus = 'loading'
        state.error = null
      })
      .addCase(operations.fulfilled, (state, action: PayloadAction<ILastOperation>) => {
        state.opeartionsStatus = 'success'
        const { items, total_count } = action.payload

        if (!state.data) return
          state.data.last_operations.items = [
            ...(state.data.last_operations?.items || []),
            ...items
          ]

        state.data.last_operations.total_count = total_count
        state.operationsPage += 1
      })
      .addCase(operations.rejected, (state, action) => {
        state.opeartionsStatus = 'failed'
        state.error = action.payload || { message: action.error.message || 'Unknown error', status: 0 }
        state.data.last_operations = null
      })
  }
})

export const {  } = userSlice.actions
export default userSlice.reducer
