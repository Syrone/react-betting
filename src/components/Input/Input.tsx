import { type InputHTMLAttributes, forwardRef } from 'react'
import clsx from 'clsx'

import Icon from '../Icon/Icon'

import styles from './Input.module.scss'

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
	prefixIcon?: string
	suffixIcon?: string
	inputSize?: string
	containerClassName?: string
	className?: string
}

const Input = forwardRef<HTMLInputElement, InputProps>(({
	prefixIcon,
	suffixIcon,
	inputSize,
	containerClassName,
	className,
	...rest
}, ref) => {
	return (
		<div className={clsx(styles.inputContainer, containerClassName)}>
			<input
				ref={ref}
				className={clsx(
					styles.input,
					prefixIcon && styles.inputPrefix,
					suffixIcon && styles.inputSuffix,
					inputSize && styles[`input-${inputSize}`],
					className
				)}
				{...rest}
			/>
			{prefixIcon && (
				<Icon name={prefixIcon} className={styles.inputIcon} />
			)}
			{suffixIcon && (
				<Icon name={suffixIcon} className={styles.inputIcon} />
			)}
		</div>
	)
})
Input.displayName = 'Input'

export default Input
