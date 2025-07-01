import { type ItemProps } from '../Item/Item'

import Section from '../Section/Section'
import Filters from '../Filters/Filters'
import Item from '../Item/Item'

import styles from './Items.module.scss'

const ITEMS: ItemProps[] = [
	{
		date: '28.05, 02:00',
		sport: 'Футбол',
		title: 'Palestino — Mushuc',
		live: true,
		time: '10 м',
		profit: '4,21',
		bookies: [
			{
				name: { label: 'Pixbet285', href: '#' },
				outcome: 'Ф1 (+2)',
				odds: {
					index: '1',
					label: '24.030',
					direction: 'up'
				}
			},
			{
				name: { label: 'FavBet', href: '#' },
				outcome: 'Ф1 (+2)',
				odds: {
					index: 'x',
					label: '24.030',
					direction: 'down'
				}
			},
			{
				name: { label: 'William Hill', href: '#' },
				outcome: 'Ф1 (+2)',
				odds: {
					index: '2',
					label: '24.030',
					direction: 'up'
				}
			},
		],
		status: 'free'
	},
	{
		date: '28.05, 02:00',
		sport: 'Футбол',
		title: 'Sao Paulo — CA Talleres de Córdoba',
		live: false,
		time: '10 м',
		profit: '4,21',
		bookies: [
			{
				name: { label: 'Pixbet285', href: '#' },
				outcome: 'Ф1 (+2)',
				odds: {
					index: '1',
					label: '24.030',
					direction: 'up'
				}
			},
			{
				name: { label: 'FavBet', href: '#' },
				outcome: 'Ф1 (+2)',
				odds: {
					index: 'x',
					label: '24.030',
					direction: 'down'
				}
			},
			{
				name: { label: 'William Hill', href: '#' },
				outcome: 'Ф1 (+2)',
				odds: {
					index: '2',
					label: '24.030',
					direction: 'up'
				}
			},
		],
		status: 'free'
	},
	{
		date: '28.05, 02:00',
		sport: 'Футбол',
		title: 'Talaea El Gaish — Modern Sport FC',
		live: true,
		time: '10 м',
		profit: '4,21',
		bookies: [
			{
				name: { label: 'Pixbet285', href: '#' },
				outcome: 'Ф1 (+2)',
				odds: {
					index: '1',
					label: '24.030',
					direction: 'up'
				}
			},
			{
				name: { label: 'William Hill', href: '#' },
				outcome: 'Ф1 (+2)',
				odds: {
					index: '2',
					label: '24.030',
					direction: 'up'
				}
			}
		],
		status: 'free'
	},
	{
		live: true,
		status: 'paid'
	},
	{
		date: '28.05, 02:00',
		sport: 'Футбол',
		title: 'Palestino — Mushuc',
		live: true,
		time: '10 м',
		profit: '4,21',
		bookies: [
			{
				name: { label: 'Pixbet285', href: '#' },
				outcome: 'Ф1 (+2)',
				odds: {
					index: '1',
					label: '24.030',
					direction: 'up'
				}
			},
			{
				name: { label: 'FavBet', href: '#' },
				outcome: 'Ф1 (+2)',
				odds: {
					index: '2',
					label: '24.030',
					direction: 'down'
				}
			},
		],
		status: 'free'
	},
	{
		date: '28.05, 02:00',
		sport: 'Футбол',
		title: 'Sao Paulo — CA Talleres de Córdoba',
		live: true,
		time: '10 м',
		profit: '4,21',
		bookies: [
			{
				name: { label: 'Pixbet285', href: '#' },
				outcome: 'Ф1 (+2)',
				odds: {
					index: '1',
					label: '24.030',
					direction: 'up'
				}
			},
			{
				name: { label: 'FavBet', href: '#' },
				outcome: 'Ф1 (+2)',
				odds: {
					index: 'x',
					label: '24.030',
					direction: 'down'
				}
			},
			{
				name: { label: 'William Hill', href: '#' },
				outcome: 'Ф1 (+2)',
				odds: {
					index: '2',
					label: '24.030',
					direction: 'up'
				}
			},
		],
		status: 'free'
	},
	{
		date: '28.05, 02:00',
		sport: 'Футбол',
		title: 'Sao Paulo — CA Talleres de Córdoba',
		live: true,
		time: '10 м',
		profit: '4,21',
		bookies: [
			{
				name: { label: 'Pixbet285', href: '#' },
				outcome: 'Ф1 (+2)',
				odds: {
					index: '1',
					label: '24.030',
					direction: 'up'
				}
			},
			{
				name: { label: 'FavBet', href: '#' },
				outcome: 'Ф1 (+2)',
				odds: {
					index: 'x',
					label: '24.030',
					direction: 'down'
				}
			},
			{
				name: { label: 'William Hill', href: '#' },
				outcome: 'Ф1 (+2)',
				odds: {
					index: '2',
					label: '24.030',
					direction: 'up'
				}
			},
		],
		status: 'free'
	},
]

type Props = {}

export default function Items({ }: Props) {
	return (
		<Section className={styles.items}>
			<Filters />
			<ul className={styles.itemsList}>
					{ITEMS.map((item, i) => (
						<li key={i} className={styles.itemsListItem}>
							<Item {...item} />
						</li>
					))}
			</ul>
		</Section>
	)
}