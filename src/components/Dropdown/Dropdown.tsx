import { useState, useRef, useEffect } from 'react'
import { useFloating, offset, flip, shift, autoUpdate } from '@floating-ui/react'
import { useLocation } from 'react-router-dom'
import clsx from 'clsx'

import { Button, ButtonLink } from '@components/Button/Button'

import styles from './Dropdown.module.scss'

export type DropdownOption = {
	label: string
	href: string
	onClick?: () => void
}

type Props = {
	label?: string
	options: DropdownOption[]
}

export default function Dropdown({ label = 'Placeholder', options }: Props) {
	const [isOpen, setIsOpen] = useState(false)
	const dropdownRef = useRef<HTMLDivElement>(null)
	const { pathname } = useLocation()

	const {
		x,
		y,
		strategy,
		refs
	} = useFloating({
		placement: 'bottom-start',
		middleware: [offset(6), flip(), shift()],
		whileElementsMounted: autoUpdate,
	})

	useEffect(() => {
		const onClick = (e: MouseEvent) => {
			if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
				setIsOpen(false)
			}
		}
		const onKey = (e: KeyboardEvent) => {
			if (e.key === 'Escape') setIsOpen(false)
		}
		document.addEventListener('mousedown', onClick)
		document.addEventListener('keydown', onKey)
		return () => {
			document.removeEventListener('mousedown', onClick)
			document.removeEventListener('keydown', onKey)
		}
	}, [])

	return (
		<div className={styles.dropdown} ref={dropdownRef}>
			<Button
				ref={refs.setReference}
				className={clsx(
					styles.dropdownToggle,
					isOpen && styles.isActive
				)}
				iconClassName={styles.dropdownToggleIcon}
				icon='arrowBottom'
				onClick={() => setIsOpen(prev => !prev)}>
				{label}
			</Button>

			{isOpen && (
				<div className={styles.dropdownMenu}
					ref={refs.setFloating}
					style={{
						position: strategy,
						top: y ?? '',
						left: x ?? '',
					}}>
					<ul className={styles.dropdownList}>
						{options.map(option => (
							<li key={option.href} className={styles.dropdownItem}>
								<ButtonLink
									href={option.href}
									className={clsx(
										styles.dropdownChoice,
										{
											[styles.active]: pathname === option.href,
										}
									)}
									onClick={() => {
										option.onClick?.()
										setIsOpen(false)
									}}>
									{option.label}
								</ButtonLink>
							</li>
						))}
					</ul>
				</div>
			)}
		</div>
	)
}
