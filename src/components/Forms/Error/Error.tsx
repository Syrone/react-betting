import styles from './Error.module.scss'

type Props = {
	error: string
}

export default function Error({ error }: Props) {
	return (
		<div className={styles.error}>
			<p>{error}</p>
		</div>
	)
}