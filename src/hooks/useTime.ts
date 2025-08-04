import { useMemo } from 'react'

type FormatType = 'short' | 'full' | 'remaining'

/**
 * Форматирует UNIX timestamp в строку по МСК в трех форматах
 * @param unixTime - timestamp в сек или мс
 * @param format - 'short' | 'full' | 'remaining'
 * @returns строка формата даты/времени или оставшегося времени
 */
export function useTime(
	unixTime: number | null | undefined,
	format: FormatType = 'short',
): string {
	return useMemo(() => {
		if (!unixTime) return ''

		const isMs = unixTime > 1e12
		const timeMs = isMs ? unixTime : unixTime * 1000
		const date = new Date(timeMs)

		const now = new Date()

		// Для вычисления в формате оставшегося времени
		if (format === 'remaining') {
			const diffMs = timeMs - now.getTime()
			if (diffMs <= 0) return '0 дн, 0 ч'

			const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
			const days = Math.floor(diffHours / 24)
			const hours = diffHours % 24

			return `${days} дн, ${hours} ч`
		}

		// Для остальных форматов: получаем части даты/времени в МСК
		const opts = { timeZone: 'Europe/Moscow' }

		const day = date.toLocaleString('ru-RU', { ...opts, day: '2-digit' })
		const month = date.toLocaleString('ru-RU', { ...opts, month: '2-digit' })
		const yearFull = date.toLocaleString('ru-RU', { ...opts, year: 'numeric' })
		const yearShort = yearFull.slice(2)

		const hour = date.toLocaleString('ru-RU', { ...opts, hour: '2-digit', hour12: false })
		const minute = date.toLocaleString('ru-RU', { ...opts, minute: '2-digit' })

		if (format === 'short') {
			// "28.05, 13:23"
			return `${day}.${month}, ${hour}:${minute}`
		}

		if (format === 'full') {
			// "14.06.25"
			return `${day}.${month}.${yearShort}`
		}

		return ''
	}, [unixTime, format])
}
