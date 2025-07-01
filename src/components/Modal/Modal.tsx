import { useRef } from 'react'
import { createPortal } from 'react-dom'
import clsx from 'clsx'

import useEscapeClose from '../../hooks/useEscapeClose'
import useScrollLock from '../../hooks/useScrollLock'

import { Button } from '../Button/Button'

import styles from './Modal.module.scss'

export type ModalState = 'opening' | 'open' | 'closing' | 'closed'

interface ModalProps {
	state: ModalState,
	className?: string,
	onClose: () => void,
	children: React.ReactNode,
}

type Compound = React.FC<ModalProps> & {
	Header: React.FC<{ children?: React.ReactNode, title: string, onClose: () => void }>
	Body: React.FC<{ children: React.ReactNode }>
	Footer?: React.FC<{ children: React.ReactNode }>
}

const Modal = (({ state, className, onClose, children }) => {
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
					styles.modalBackdrop,
					state === 'open' && styles.isOpen,
					state === 'closing' && styles.isClosing
				)}
				onClick={handleClickOutside} />

			<div
				role="dialog"
				aria-modal="true"
				ref={ref}
				className={clsx(
					styles.modal,
					className,
					state === 'opening' && styles.isOpening,
					state === 'open' && styles.isOpen,
					state === 'closing' && styles.isClosing
				)}
			>
				<div className={styles.modalDialog}>
					<div className={styles.modalContent}>
						{children}
					</div>
				</div>
			</div>
		</>,
		document.getElementById('root') || document.body
	)
}) as Compound

Modal.Header = ({ children, title, onClose }) => (
	<div className={styles.modalHeader}>
		<h4 className={styles.modalTitle}>{title}</h4>
		{children}
		<Button
			className={styles.modalClose}
			style='icon'
			icon='close'
			onClick={onClose} />
	</div>
)
Modal.Body = ({ children }) => (
	<div className={styles.modalBody}>{children}</div>
)
Modal.Footer = ({ children }) => (
	<div className={styles.modalFooter}>{children}</div>
)

export default Modal
