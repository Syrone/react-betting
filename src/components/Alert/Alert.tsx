import React from "react"
import clsx from 'clsx'

import useEscapeClose from '@hooks/useEscapeClose'

import { Button } from '@components/Button/Button'
import Icon from '@components/Icon/Icon'

import styles from './Alert.module.scss'

export type AlertState = 'opening' | 'open' | 'closing' | 'closed'
type AlertType = "success" | "error" | "cookie"

interface AlertProps {
	state: AlertState
	type?: AlertType
	title?: string
	children: React.ReactNode
	className?: string,
	onClose: () => void
}

const typeStyles: Record<AlertType, { style: string, icon?: string }> = {
	success: {
		style: 'isSuccess',
		icon: 'check',
	},
	error: {
		style: 'isError',
		icon: 'check',
	},
	cookie: {
		style: 'isCookie',
	},
}

const Alert: React.FC<AlertProps> = ({
	state,
	type = "success",
	title,
	children,
	className,
	onClose
}) => {
	const { style, icon } = typeStyles[type]

	useEscapeClose(state === 'open', onClose)

	if (state === 'closed') return null

	return (
		<div
			className={clsx(
				className,
				style,
				styles.alert,
				state === 'opening' && styles.isOpening,
				state === 'open' && styles.isOpen,
				state === 'closing' && styles.isClosing,
			)}
			role="alert"
		>
			{icon && (
				<Icon name={icon} className={styles.alertIcon} />
			)}
			<div className={styles.alertBody}>
				<div className={styles.alertContent}>
					{title && (
						<h5 className={styles.alertTitle}>{title}</h5>
					)}
					{children}
				</div>
				<Button
					className={styles.alertClose}
					size='base'
					style='primary'
					onClick={onClose}>
					Принять
				</Button>
			</div>
		</div>
	)
}

export default Alert