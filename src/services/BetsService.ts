import { type AxiosResponse } from 'axios'

import $authApi from '@api/authApi'

import { type BetsResponse } from '@models/response/BetsResponse'

export default class UserService {
	static async bets(): Promise<AxiosResponse<BetsResponse[]>> {
		return $authApi.get(`/bets`)
	}
}