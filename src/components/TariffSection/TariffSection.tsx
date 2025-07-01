import { type TariffProps } from '../Tariff/Tariff'

import Section from '../Section/Section'
import Tariff from '../Tariff/Tariff'

import styles from './TariffSection.module.scss'

const TARIFFS:TariffProps[] = [
	{
		name: 'Бесплатный',
		subname: 'For production applications with the power to scale.',
		price: '0',
		list: [
			'Unlimited API requests',
			'50,000 monthly active users',
			'500 MB database size',
			'5 GB bandwidth',
			'1 GB file storage',
			'Community support',
		],
		chosen: true
	},
	{
		label: 'Самый популярный',
		name: 'Профессиональный',
		subname: 'For production applications with the power to scale.',
		price: '25',
		list: [
			'Unlimited API requests',
			'50,000 monthly active users',
			'500 MB database size',
			'5 GB bandwidth',
			'1 GB file storage',
			'Community support',
		],
		chosen: false
	},
	{
		name: 'Про плюс',
		subname: 'For production applications with the power to scale.',
		price: '40',
		list: [
			'Unlimited API requests',
			'50,000 monthly active users',
			'500 MB database size',
			'5 GB bandwidth',
			'1 GB file storage',
			'Community support',
		],
		chosen: false
	},
]

type Props = {}

export default function Tariffs({}: Props) {
	return (
		<Section
			className={styles.tariffs}
			containerClassName={styles.tariffsContainer}>
			<h1 className='page-title'>
				Тарифы
			</h1>

			<ul className={styles.tariffsList}>
				{TARIFFS.map((item, i) => (
					<li key={i} className={styles.tariffsItem}>
						<Tariff {...item} />
					</li>
				))}
			</ul>
		</Section>
	)
}