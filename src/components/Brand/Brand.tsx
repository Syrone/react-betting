import { ButtonLink } from '../Button/Button'

import Logo from '../../assets/img/logo--light.png'

import styles from './Brand.module.scss'

type Props = {}

export default function Brand({ }: Props) {
	return (
		<div className={styles.brand}>
			<ButtonLink className={styles.brandLink}>
				<img src={Logo} loading='lazy' width={81} height={28} alt="Logo" />
			</ButtonLink>
		</div>
	)
}