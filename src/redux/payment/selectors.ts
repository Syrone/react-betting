import { type RootState } from "@redux/store"

export const selectorPayment = (state: RootState) => state.payment
export const selectorPaymentURL = (state: RootState) => state.payment.paymentUrl