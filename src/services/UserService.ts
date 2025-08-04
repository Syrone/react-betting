import { type AxiosResponse } from 'axios'

import $authApi from '@api/authApi'

import { IUser } from '@/models/IUser'
import { type ILastOperation } from '@models/ILastOperation'
import { type UserResponse } from '@models/response/UserResponse'

export default class UserService {
	static async referral(referral_code: string): Promise<AxiosResponse<IUser>> {
		return $authApi.post(`/referral_code`, { referral_code })
	}

	static async dashboard(): Promise<AxiosResponse<UserResponse>> {
		return $authApi.get('/dashboard')
	}

	static async operations(page = 1, per_page = 10): Promise<AxiosResponse<ILastOperation>> {
		return $authApi.get(`/operations`, { params: { page, per_page } })
	}
}