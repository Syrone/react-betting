import clsx from 'clsx'

import { ButtonLink } from '@components/Button/Button'

import Logo from '@img/logo--light.png'

import styles from './Brand.module.scss'

type Props = {
	className?: string
}

export default function Brand({ className }: Props) {
	return (
		<div className={clsx(
			styles.brand,
			className
		)}>
			<ButtonLink className={styles.brandLink}>
				<img src={Logo} loading='lazy' width={81} height={28} alt="Logo" />
			</ButtonLink>
		</div>
	)
}