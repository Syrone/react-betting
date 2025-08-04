import clsx from 'clsx'

import styles from './SwitchInput.module.scss'

interface Props {
	classNameContainer?: string
	className?: string
	label?: string
	checked: boolean
	disabled?: boolean
	onChange: () => void
}

export default function SwitchInput({ classNameContainer, className, label, checked, disabled, onChange }: Props) {
	return (
		<label className={clsx(styles.switch, classNameContainer)}>
			<input
				type="checkbox"
				className={clsx('visually-hidden', styles.switchInput, className)}
				checked={checked}
				disabled={disabled}
				onChange={onChange}
			/>
			<span className={styles.switchSlider} />
			{label && <span className={styles.switchLabel}>{label}</span>}
		</label>
	)
}
