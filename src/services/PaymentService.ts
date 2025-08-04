import { type AxiosResponse } from 'axios'

import $authApi from '@api/authApi'

import { type PaymentResponse } from '@models/response/PaymentResponse'
import { type IPaymentSystem } from '@models/IPaymentSystem'

export default class PaymentService {
	static async payments(system: IPaymentSystem, subscription_id: number): Promise<AxiosResponse<PaymentResponse>> {
		return $authApi.post(`/payments/${system}`, { subscription_id }, { params: { system } })
	}

	static async withdraw(system: string, token: string, network: string, amount: number, address: string): Promise<AxiosResponse<PaymentResponse>> {
		return $authApi.post(`/withdraw`, { amount, address }, { params: { system, token, network } })
	}
}