import { useMemo } from 'react'

type FormatType = 'minutes' | 'date-time' | 'date' | 'remaining'

/**
 * Форматирует UNIX timestamp в строку по МСК в трех форматах
 * @param unixTime - timestamp в сек или мс
 * @param format - 'short' | 'full' | 'remaining'
 * @returns строка формата даты/времени или оставшегося времени
 */
export function useTime(
	unixTime: number | null | undefined,
	format: FormatType = 'date-time',
): string {
	return useMemo(() => {
		if (!unixTime) return ''

		const isMs = unixTime > 1e12
		const timeMs = isMs ? unixTime : unixTime * 1000
		const date = new Date(timeMs)

		const now = new Date()

		if (format === 'minutes') {
			const diffMs = timeMs - now.getTime()
			if (diffMs <= 0) return '0 мин'

			const diffMinutes = Math.floor(diffMs / (1000 * 60))
			return `${diffMinutes} мин`
		}

		if (format === 'remaining') {
			const diffMs = timeMs - now.getTime()
			if (diffMs <= 0) return '0 дн, 0 ч'

			const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
			const days = Math.floor(diffHours / 24)
			const hours = diffHours % 24

			return `${days} дн, ${hours} ч`
		}

		const opts = { timeZone: 'Europe/Moscow' }

		const day = date.toLocaleString('ru-RU', { ...opts, day: '2-digit' })
		const month = date.toLocaleString('ru-RU', { ...opts, month: '2-digit' })
		const yearFull = date.toLocaleString('ru-RU', { ...opts, year: 'numeric' })
		const yearShort = yearFull.slice(2)

		const hour = date.toLocaleString('ru-RU', {
			timeZone: 'Europe/Moscow',
			hour: 'numeric',
			hour12: false,
		})
		const minuteRaw = date.toLocaleString('ru-RU', {
			timeZone: 'Europe/Moscow',
			minute: 'numeric',
		})
		const minute = minuteRaw.toString().padStart(2, '0')

		if (format === 'date-time') {
			return `${day}.${month}, ${hour}:${minute}`
		}

		if (format === 'date') {
			return `${day}.${month}.${yearShort}`
		}

		return ''
	}, [unixTime, format])
}
