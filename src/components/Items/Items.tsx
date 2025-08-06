import clsx from 'clsx'

import { useBetsQuery } from '@hooks/useBetsQuery'

import Loader from '@components/Loader/Loader'
import Section from '@components/Section/Section'
import Filters from '@components/Filters/Filters'
import Feedback from '@components/Feedback/Feedback'
import Item from '@components/Item/Item'

import styles from './Items.module.scss'

type Props = {}

export default function Items({ }: Props) {
	const { data, isLoading, error } = useBetsQuery()
	
	const items = data || []
	
	if (error) {
		return (
			<Section className={styles.items}>
				<Feedback message="Ошибка загрузки" />
			</Section>
		)
	}
	
	return (
		<Section className={styles.items}>
			<Filters />
			<ul className={styles.root}>
				{isLoading ? (
					<li className={clsx(
						styles.item,
						styles.feedback
					)}>
						<Loader type='component' />
					</li>
				) : (
					items.map((item) => (
						<li key={item.id} className={styles.item}>
							<Item {...item} />
						</li>
					))
				)}
			</ul>
		</Section>
	)
}