export interface PaymentResponse {
	payment_url: string
	success: boolean
  message: string
  new_balance: number
}