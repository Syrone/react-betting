import clsx from 'clsx'

import styles from './Feedback.module.scss'

type Props = {
	className?: string
	message: string
}

export default function Feedback({ className, message }: Props) {
	return (
		<div className={clsx(
			styles.root,
			className
		)}>
			<div className={styles.content}>
				{message}
			</div>
		</div>
	)
}