import clsx from 'clsx'

import styles from './BlockBlur.module.scss'

type Props = {
	content?: string
	className?: string
}

export default function BlockBlur({ content, className }: Props) {
	return (
		<div className={clsx(
			styles.root,
			className
		)}>
			<div className={styles.content}>
				{content && (
					<p>
						Доступ только по подписке
					</p>
				)}
			</div>
		</div>
	)
}