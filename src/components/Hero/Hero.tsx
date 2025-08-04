import Image from '@img/hero/image.png'

import { ButtonLink } from '@components/Button/Button'
import Section from '@components/Section/Section'

import styles from './Hero.module.scss'

type Props = {}

export default function Hero({ }: Props) {
	return (
		<Section className={styles.hero}>
			<div className={styles.heroInner}>
				<div className={styles.heroContent}>
					<h1>
						Доход от ставок при любом результате матча
					</h1>
					<p>
						Беспроигрышная букмекерская вилка возникает из-за разницы коэффициентов на одну игру у разных букмекеров
					</p>

					<ButtonLink
						href='/tariffs'
						className={styles.heroButton}
						size='base'
						style='primary'>
						Посмотреть тарифы
					</ButtonLink>
				</div>

				<div className={styles.heroPicture}>
					<img
						src={Image}
						loading="lazy"
						width={475}
						height={320}
						alt="Картинка"
					/>
				</div>
			</div>
		</Section>
	)
}