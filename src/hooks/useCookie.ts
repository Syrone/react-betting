import { useCallback } from "react"

export default function useCookie(name: string) {
	const get = useCallback((): string | undefined => {
		const match = document.cookie.match(new RegExp("(^| )" + name + "=([^;]+)"))
		return match?.[2]
	}, [name])

	const set = useCallback((value: string, days = 365) => {
		const expires = new Date(Date.now() + days * 864e5).toUTCString()
		document.cookie = `${name}=${value}; path=/; expires=${expires}`
	}, [name])

	const remove = useCallback(() => {
		document.cookie = `${name}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT`
	}, [name])

	return { get, set, remove }
}
