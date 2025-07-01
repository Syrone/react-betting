import clsx from 'clsx'

import styles from './Section.module.scss'

type Props = {
	className?: string,
	containerClassName?: string,
	children: React.ReactNode,
}

export default function Section({ className, containerClassName, children }: Props) {
	return (
		<section className={clsx(
			styles.section,
			className,
		)}>
			<div className={clsx(
				'container',
				styles.sectionContainer,
				containerClassName,
			)}>
				{children}
			</div>
		</section>
	)
}