import { useRef } from 'react'
import { createPortal } from 'react-dom'
import clsx from 'clsx'

import useEscapeClose from '@hooks/useEscapeClose'
import useScrollLock from '@hooks/useScrollLock'

import Brand from '@components/Brand/Brand'
import { Button } from '@components/Button/Button'
import Icon from '@components/Icon/Icon'

import styles from './Modal.module.scss'

export type ModalState = 'opening' | 'open' | 'closing' | 'closed'

interface ModalProps {
	state: ModalState,
	type?: string,
	className?: string,
	onClose: () => void,
	children: React.ReactNode,
}

type Compound = React.FC<ModalProps> & {
	Header: React.FC<{ custom?: boolean, children?: React.ReactNode, brand?: boolean, title?: string, titleIcon?: string, subtitle?: string, onClose: () => void }>
	Body: React.FC<{ children: React.ReactNode }>
	Footer?: React.FC<{ children: React.ReactNode }>
}

const Modal = (({ state, type, className, onClose, children }) => {
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
					type === 'form' && styles.modalForm,
					type === 'dashboard' && styles.modalDashboard,
					type === 'dashboard-bigger' && styles.modalDashboardBigger,
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

Modal.Header = ({ custom = false, children, brand, title, titleIcon, subtitle, onClose }) => {
	if (custom) {
		return (
			<div className={styles.modalHeader}>
				{children}

				{brand && <Brand className={styles.modalBrand} />}
				<Button
					className={styles.modalClose}
					btnStyle='icon'
					icon='close'
					onClick={onClose} />
			</div>
		)
	}

	return (
		<div className={styles.modalHeader}>
			{brand && <Brand className={styles.modalBrand} />}
			<div className={styles.modalHeaderContent}>
				<h4 className={styles.modalTitle}>
					{titleIcon && <Icon name={titleIcon} className={styles.modalTitleIcon} />}
					{title}
				</h4>
				{subtitle && <p className={styles.modalSubtitle}>{subtitle}</p>}
				{children}
			</div>
			<Button
				className={styles.modalClose}
				btnStyle='icon'
				icon='close'
				onClick={onClose} />
		</div>
	)
}
Modal.Body = ({ children }) => (
	<div className={styles.modalBody}>{children}</div>
)
Modal.Footer = ({ children }) => (
	<div className={styles.modalFooter}>{children}</div>
)

export default Modal
