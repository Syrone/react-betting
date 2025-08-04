import { type InputHTMLAttributes, useState, useRef, forwardRef, useImperativeHandle } from 'react'
import clsx from 'clsx'

import { Button } from '@components/Button/Button'
import Icon from '@components/Icon/Icon'
import Error from '@components/Forms/Error/Error'

import styles from './Input.module.scss'

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
	prefixIcon?: string
	suffixIcon?: string
	inputType?: 'readonly' | 'default'
	inputSize?: string
	inputPlaceholder?: string
	inputError?: string
	isError?: boolean
	isCopy?: boolean
	containerClassName?: string
	className?: string
	onRemove?: () => void
	onCopy?: () => void
}

const Input = forwardRef<HTMLInputElement, InputProps>(({
	prefixIcon,
	suffixIcon,
	inputType = 'default',
	inputSize,
	inputPlaceholder,
	inputError,
	isError,
	isCopy,
	containerClassName,
	className,
	onFocus,
	onBlur,
	onChange,
	onRemove,
	onCopy,
	value,
	defaultValue,
	...rest
}, ref) => {
	const [isFocused, setIsFocused] = useState(false)
	const inputRef = useRef<HTMLInputElement>(null)
	useImperativeHandle(ref, () => inputRef.current!, [])

	const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
		setIsFocused(true)
		onFocus?.(e)
	}

	const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
		setIsFocused(false)
		onBlur?.(e)
	}

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		onChange?.(e)
	}

	const handleCopy = () => {
		let textToCopy = ''

		if (typeof value === 'string') {
			textToCopy = value
		} else if (inputRef.current) {
			textToCopy = inputRef.current.value
		}

		if (!textToCopy) return

		navigator.clipboard.writeText(textToCopy)
			.then(() => onCopy?.())
			.catch(err => console.error('Copy failed', err))
	}


	return (
		<div className={clsx(
			styles.inputContainer,
			isFocused && styles.inputFocus,
			inputType === 'readonly' && styles.inputReadonly,
			inputSize && styles[`input-${inputSize}`],
			prefixIcon && styles.inputPrefix,
			(suffixIcon || isError || onRemove || isCopy) && styles.inputSuffix,
			((isError && onRemove) || (isError && isCopy)) && styles.inputSuffixError,
			isError && styles.inputError,
			isCopy && styles.inputCopy,
			containerClassName
		)}>
			<div className={styles.inputWrapper}>
				<input
					ref={inputRef}
					readOnly={inputType === 'readonly'}
					className={clsx(
						styles.input,
						inputType === 'readonly' && 'visually-hidden',
						className
					)}
					placeholder=''
					onFocus={handleFocus}
					onBlur={handleBlur}
					onChange={handleChange}
					defaultValue={defaultValue}
					value={value}
					{...rest}
				/>
				{inputType === 'readonly' && (
					<span
						className={clsx(
							styles.input,
							className
						)}>
						<span>{value}</span>
					</span>
				)}
				<span className={styles.inputPlaceholder}>
					{inputPlaceholder}
					{rest.required && <span className={styles.inputRequired}>*</span>}
				</span>
				{prefixIcon && (
					<Icon
						name={prefixIcon}
						className={styles.inputIcon} />
				)}
				{suffixIcon && (
					<Icon
						name={suffixIcon}
						className={styles.inputIcon} />
				)}
				{(rest.required && isError) && (
					<Icon
						name='danger'
						className={clsx(
							styles.inputIcon,
							styles.inputIconDanger
						)} />
				)}
				{onRemove && (
					<Button
						className={clsx(
							styles.inputRemove,
							styles.inputBtn
						)}
						icon='close'
						onClick={onRemove} />
				)}
				{isCopy && (
					<Button
						className={clsx(
							styles.inputCopy,
							styles.inputBtn
						)}
						icon='copy'
						onClick={handleCopy} />
				)}
			</div>
			{(rest.required && isError) && (
				<Error error={inputError} />
			)}
		</div>
	)
})
Input.displayName = 'Input'

export default Input
