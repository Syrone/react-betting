import { useRef } from 'react'
import { createPortal } from 'react-dom'
import clsx from 'clsx'

import useEscapeClose from '../../hooks/useEscapeClose'
import useScrollLock from '../../hooks/useScrollLock'

import styles from './Offcanvas.module.scss'

type OffcanvasState = 'opening' | 'open' | 'closing' | 'closed'

interface OffcanvasProps {
	state: OffcanvasState,
	className?: string,
	onClose: () => void,
	children: React.ReactNode,
}

type Compound = React.FC<OffcanvasProps> & {
  Header: React.FC<{ children: React.ReactNode }>
  Body: React.FC<{ children: React.ReactNode }>
  Footer: React.FC<{ children: React.ReactNode }>
}

const Offcanvas = (({ state, className, onClose, children }) => {
	const ref = useRef<HTMLDivElement>(null)

	const handleClickOutside = (e: React.MouseEvent) => {
		if (ref.current && !ref.current.contains(e.target as Node)) {
			onClose()
		}
	}

	useScrollLock(state === 'open')
	useEscapeClose(state === 'open', onClose)

	if (state === 'closed') return null

	return createPortal(
		<>
			<div 
				className={clsx(
					styles.offcanvasBackdrop,
					state === 'open' && styles.isOpen,
					state === 'closing' && styles.isClosing,
				)}
				onClick={handleClickOutside} />

			<div
        role="dialog"
        aria-modal="true"
				ref={ref}
				className={clsx(
					styles.offcanvas,
					className,
					state === 'opening' && styles.isOpening,
					state === 'open' && styles.isOpen,
					state === 'closing' && styles.isClosing,
				)}
				onClick={handleClickOutside}>
				{children}
			</div>
		</>,
		document.getElementById('root') || document.body
	)
}) as Compound

Offcanvas.Header = ({ children }) => (
  <div className={styles.offcanvasHeader}>{children}</div>
)
Offcanvas.Body = ({ children }) => (
  <div className={styles.offcanvasBody}>{children}</div>
)
Offcanvas.Footer = ({ children }) => (
  <div className={styles.offcanvasFooter}>{children}</div>
)

export default Offcanvas