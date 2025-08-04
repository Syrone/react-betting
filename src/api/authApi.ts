import axios from 'axios'

import $plainApi from '@api/plainApi'

const $api = axios.create({
	withCredentials: true,
	baseURL: import.meta.env.VITE_API_URL
})

$api.interceptors.request.use((config) => {
	const token = localStorage.getItem('token')
	if (token) {
		config.headers.Authorization = `Bearer ${token}`
	}

	return config
})

$api.interceptors.response.use((config) => {
	return config
}, async (error) => {
	const originalRequest = error.config
	if (error.response.status == 401) {
		try {
			const response = await $plainApi.post('/refresh')
			localStorage.setItem('token', response.data.access_token)
			return $api.request(originalRequest)
		} catch (e) {
			console.log('Not authorized')
		}
	}
})

export default $api