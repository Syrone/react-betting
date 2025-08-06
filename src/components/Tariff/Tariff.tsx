import clsx from 'clsx'

import BlockBlur from '@components/BlockBlur/BlockBlur'
import { Button } from '@components/Button/Button'
import Icon from '@components/Icon/Icon'

import styles from './Tariff.module.scss'

export interface TariffProps {
	subscription_id: number
	label?: string
	name: string
	subname: string
	price: number
	list: string[]
	chosen: boolean
	disabled?: boolean
	onOpenModal?: () => void
}

export default function Tariff({
	label,
	name,
	subname,
	price,
	list,
	chosen,
	disabled = false,
	onOpenModal
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
					btnStyle='primary'
					onClick={onOpenModal}
					disabled={chosen || disabled}>
					{chosen ?
              'Выбран' : disabled ?
              'Недоступно' :
              'Оплатить тариф'
            }
				</Button>

				<div className={clsx(
					styles.tariffPrice,
					disabled && styles.blurWrapper
				)}>
					{disabled && <BlockBlur className={styles.blur} />}
					<p className={clsx(
						styles.tariffPriceLabel,
						price === 0 && styles.isInvisible
					)}>
						От
					</p>
					<div className={styles.tariffPriceWrapper}>
						<span className={styles.tariffPriceValue}>
							{price} ₽
						</span>
						<span className={styles.tariffPriceSuffix}>
							/ в месяц
						</span>
					</div>
				</div>
			</div>

			<div className={clsx(
				styles.tariffBottom,
				disabled && styles.blurWrapper
			)}>
				{disabled && <BlockBlur className={styles.blur} />}
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