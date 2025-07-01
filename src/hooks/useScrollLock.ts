import { useLayoutEffect } from 'react'

export default function useScrollLock(lock: boolean) {
	useLayoutEffect(() => {
		if (!lock) return

		const scrollBarWidth = window.innerWidth - document.documentElement.clientWidth
		const originalOverflow = document.body.style.overflow
		const originalPaddingRight = document.body.style.paddingRight

		document.body.style.overflow = 'hidden'
		if (scrollBarWidth > 0) {
			document.body.style.paddingRight = `${scrollBarWidth}px`
		}

		return () => {
			document.body.style.overflow = originalOverflow
			document.body.style.paddingRight = originalPaddingRight
		}
	}, [lock])
}
