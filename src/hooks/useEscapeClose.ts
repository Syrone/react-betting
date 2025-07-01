import { useEffect } from 'react'

export default function useEscapeClose(active: boolean, onClose: () => void) {
	useEffect(() => {
		if (!active) return

		const handler = (e: KeyboardEvent) => {
			if (e.key === 'Escape') {
				onClose()
			}
		}

		window.addEventListener('keydown', handler)
		return () => window.removeEventListener('keydown', handler)
	}, [active, onClose])
}
