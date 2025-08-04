import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit'

import { type IPaymentSystem } from '@models/IPaymentSystem'
import { type IStatus } from '@models/IStatus'
import { type IError } from '@models/IError'
import { type PaymentResponse } from '@models/response/PaymentResponse'

import PaymentService from '@services/PaymentService'

export interface IState {
	paymentUrl: string | null
  withdrawSuccess: boolean | null
  message: string | null
  newBalance: number | null
  status: IStatus
  error: IError | null
}

const initialState: IState = {
  paymentUrl: null,
  withdrawSuccess: null,
  message: null,
  newBalance: null,
  status: 'initial',
  error: null
}

export const payments = createAsyncThunk<
  PaymentResponse,
  { system: IPaymentSystem; subscription_id: number },
  { rejectValue: IError }
>(
  'payment/payments',
  async ({ system, subscription_id }, { rejectWithValue }) => {
    try {
      const response = await PaymentService.payments(system, subscription_id)
      return response.data
    } catch (error: any) {
      const status = error.response?.status || 0
      const message = error.response?.data?.detail || 'Failed to fetch payment url'
      return rejectWithValue({ message, status, error: error.response?.data || null })
    }
  }
)

export const withdraw = createAsyncThunk<
  PaymentResponse,
  { system: string; token: string; network: string; amount: number; address: string },
  { rejectValue: IError }
>(
  'payment/withdraw',
  async ({ system, token, network, amount, address }, { rejectWithValue }) => {
    try {
      const response = await PaymentService.withdraw(system, token, network, amount, address)
      return response.data
    } catch (error: any) {
      const status = error.response?.status || 0
      const message = error.response?.data?.detail || 'Failed to withdraw funds'
      return rejectWithValue({ message, status, error: error.response?.data || null })
    }
  }
)

const paymentSlice = createSlice({
  name: 'payment',
  initialState,
  reducers: {},
	extraReducers: (builder) => {
    builder
      .addCase(payments.pending, (state) => {
        state.status = 'loading'
        state.error = null
      })
      .addCase(payments.fulfilled, (state, action: PayloadAction<PaymentResponse>) => {
        state.status = 'success'
        state.paymentUrl = action.payload.payment_url
        state.error = null
      })
      .addCase(payments.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.payload || { message: action.error.message || 'Unknown error', status: 0 }
      })

      .addCase(withdraw.pending, (state) => {
        state.status = 'loading'
        state.error = null
      })
      .addCase(withdraw.fulfilled, (state, action: PayloadAction<PaymentResponse>) => {
        state.status = 'success'
        state.withdrawSuccess = action.payload.success
        state.message = action.payload.message
        state.newBalance = action.payload.new_balance
        state.error = null
      })
      .addCase(withdraw.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.payload || { message: action.error.message || 'Unknown error', status: 0 }
      })
  }
})

export const {  } = paymentSlice.actions
export default paymentSlice.reducer
