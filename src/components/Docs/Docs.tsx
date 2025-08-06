import { type ReactNode } from 'react'

import Section from '@components/Section/Section'

import styles from './Docs.module.scss'

type Props = {
	title: string
	children: ReactNode
}

export default function Docs({ title, children }: Props) {
	return (
		<Section>
			<div className={styles.root}>
				<div className={styles.header}>
					<h1>
						{title}
					</h1>
				</div>
				<div className={styles.body}>
					{children}
				</div>
			</div>
		</Section>
	)
}