import { type AxiosResponse } from 'axios'

import $api from '@api/authApi'
import $plainApi from '@api/plainApi'

import { type IUser } from '@models/IUser'
import { type AuthResponse } from '@models/response/AuthResponse'

export default class AuthService {
	static async login(email: string, password: string): Promise<AxiosResponse<AuthResponse>> {
		return $api.post<AuthResponse>('/login', { email, password })
	}

	static async registration(username: string, email: string, password: string, referral_code?: string): Promise<AxiosResponse<IUser>> {
		return $api.post<IUser>('/user', { username, email, password, referral_code })
	}

	static async logout(): Promise<void> {
		return $api.post('/logout')
	}

	static async verify(token: string): Promise<AxiosResponse> {
		return $plainApi.get('/verify', { params: { token } })
	}

	static async refresh(): Promise<AxiosResponse<AuthResponse>> {
		return $plainApi.post('/refresh')
	}

	static async forgotPassword(email: string): Promise<AxiosResponse> {
		return $plainApi.post('/forgot-password', { email })
	}

	static async resetPassword(token: string, newPassword: string): Promise<AxiosResponse> {
		return $plainApi.post(`/reset-password`, { token, new_password: newPassword })
	}

	static async resetPasswordVerify(token: string): Promise<AxiosResponse> {
		return $plainApi.get(`/reset-password/${token}`)
	}
}