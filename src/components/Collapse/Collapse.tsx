import { useState, type ReactNode } from 'react'
import clsx from 'clsx'

import { Button } from '@components/Button/Button'

import styles from './Collapse.module.scss'

export type State = 'closed' | 'opening' | 'open' | 'closing'

interface Props {
	className?: string
	btnClassName?: string
	collapseClassName?: string
	btnText: string
	children: ReactNode
	initialOpen?: boolean
	onToggle?: (open: boolean) => void
}

type Compound = React.FC<Props> & {
	Body: React.FC<{ children: React.ReactNode, className?: string }>
}

const Collapse = (({
	className,
	btnClassName,
	collapseClassName,
	btnText,
	children,
	initialOpen = false,
	onToggle
}: Props) => {
	const [state, setState] = useState<State>(initialOpen ? 'open' : 'closed')
	const isOpen = state === 'opening' || state === 'open'

	const open = () => {
		setState('opening')
		requestAnimationFrame(() => setState('open'))
		onToggle?.(true)
	}

	const close = () => {
		setState('closing')
		setTimeout(() => setState('closed'), 300)
		onToggle?.(false)
	}

	const toggle = () => {
		isOpen ? close() : open()
	}

	return (
		<div className={clsx(styles.collapse, className)}>
			<Button
				className={clsx(
					btnClassName,
					styles.collapseButton,
					isOpen && styles.isActive
				)}
				iconClassName={styles.collapseButtonIcon}
				icon='arrowBottom'
				isActive={isOpen}
				onClick={toggle}>
				{btnText}
			</Button>
			{
				state !== 'closed' && (
					<div
						className={clsx(
							collapseClassName,
							styles.collapseContent,
							state === 'opening' && styles.isOpening,
							state === 'open' && styles.isOpen,
							state === 'closing' && styles.isClosing
						)}>
						{children}
					</div>
				)
			}
		</div>
	)
}) as Compound

Collapse.Body = ({ children, className }) => (
	<div className={styles.collapseBody}>
		<div className={clsx(
			className,
			styles.collapseInner
		)}>
			{children}
		</div>
	</div>
)

Collapse.displayName = 'Collapse'
export default Collapse
