import React, { forwardRef, type ChangeEventHandler, type InputHTMLAttributes, useEffect, useRef } from 'react'
import clsx from 'clsx'

import Icon from '../Icon/Icon'

import styles from './ToggleInput.module.scss'

export type ToggleType = 'checkbox' | 'radio'

export interface Props extends Omit<InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
	type?: ToggleType
	id?: string
	className?: string
	label?: string
	checked?: boolean
	indeterminate?: boolean
	disabled?: boolean
	wrapperOnly?: boolean
	onChange?: ChangeEventHandler<HTMLInputElement>
}

const ToggleInput = forwardRef<HTMLInputElement, Props>(({
	type = 'checkbox',
	id,
	className,
	label,
	checked,
	indeterminate = false,
	disabled = false,
	wrapperOnly = false,
	onChange,
	...rest
}, ref) => {
	const innerRef = useRef<HTMLInputElement>(null)
	const resolvedRef = (ref as React.RefObject<HTMLInputElement>) || innerRef

	useEffect(() => {
		if (resolvedRef.current) {
			resolvedRef.current.indeterminate = indeterminate
		}
	}, [indeterminate, resolvedRef])

	const iconName = type === 'checkbox' ? 'checkFill' : 'radioFill'

	const wrapper = (
		<div className={clsx(
			styles.checkboxContainer,
			type === 'radio' && styles.radioContainer,
			className)}>
			<div className={styles.checkboxWrapper}>
				<input
					{...rest}
					id={id}
					type={type}
					ref={resolvedRef}
					checked={checked}
					disabled={disabled}
					onChange={onChange}
					className={styles.checkbox}
				/>
				<Icon name={iconName} className={styles.checkboxIcon} />
			</div>
		</div>
	)

	if (wrapperOnly) {
		return wrapper
	}

	return (
		<label className={clsx(
			styles.checkboxContainer,
			type === 'radio' && styles.radioContainer,
			className)}>
			{wrapper}
			{label && <span className={styles.checkboxLabel}>{label}</span>}
		</label>
	)
})

ToggleInput.displayName = 'ToggleInput'
export default ToggleInput
