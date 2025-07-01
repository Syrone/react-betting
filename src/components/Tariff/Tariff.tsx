import clsx from 'clsx'

import { Button } from '../Button/Button'
import Icon from '../Icon/Icon'

import styles from './Tariff.module.scss'

export interface TariffProps {
	label?: string
	name: string
	subname: string
	price: string
	list: string[]
	chosen: boolean
}

export default function Tariff({
	label,
	name,
	subname,
	price,
	list,
	chosen
}: TariffProps) {
	return (
		<article className={clsx(
			styles.tariff,
			label && styles.isLabel
		)}>
			<div className={styles.tariffTop}>
				<div className={styles.tariffHeader}>
					{label && (
						<div className={styles.tariffLabel}>
							{label}
						</div>
					)}
					<div className={styles.tariffHeaderContent}>
						<h2 className={styles.tariffName}>
							{name}
						</h2>
						<p className={styles.tariffSubname}>
							{subname}
						</p>
					</div>
				</div>

				<Button
					className={styles.tariffButton}
					size='base'
					style='primary'
					disabled={chosen}>
					{chosen ? 'Выбран' : 'Оплатить тариф'}
				</Button>

				<div className={styles.tariffPrice}>
					<p className={clsx(
						styles.tariffPriceLabel,
						price === '0' && styles.isInvisible
					)}>
						От
					</p>
					<div className={styles.tariffPriceWrapper}>
						<span className={styles.tariffPriceValue}>
							{price} $
						</span>
						<span className={styles.tariffPriceSuffix}>
							/ в месяц
						</span>
					</div>
				</div>
			</div>

			<div className={styles.tariffBottom}>
				<ul className={styles.tariffList}>
					{list.map((item, i) => (
						<li key={i} className={styles.tariffItem}>
							<Icon 
								className={styles.tariffItemIcon}
								name='check' />
							<span>
								{item}
							</span>
						</li>
					))}
				</ul>
			</div>
		</article>
	)
}