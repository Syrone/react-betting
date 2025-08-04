import clsx from 'clsx'

import { useTime } from '@hooks/useTime'

import { IOperationItem } from '@/models/IOperationItem'

import Icon from '@components/Icon/Icon'

import styles from './Dashboard.module.scss'

export default function HistoryRow({ amount, created_at, id, status, type }: IOperationItem) {
	const createdAtTime = useTime(created_at, 'short')
	const createdAt2Time = useTime(created_at, 'full')

	return (
		<tr className={styles.row}>
			<td>
				<div className={styles.date}>
					<span className='d-none d-lg-block'>{createdAt2Time}</span>
					<span className={clsx(
						styles.dateContent,
						'd-lg-none'
					)}>
						<Icon name='calendar' className={styles.dateIcon} />
						{createdAtTime}
					</span>
				</div>
			</td>
			<td>
				<span className={styles.type}>
					{type}
				</span>
			</td>
			<td>
				<span className={styles.sum}>
					+{amount} ₽ <span className='d-lg-none'>ваш на баланс</span>
				</span>
			</td>
			<td>
				<div className={styles.statusWrapper}>
					<div className={clsx(
						styles.status,
						status === 'success' && styles.statusSuccess,
						status === 'pending' && styles.statusProcessing,
						status === 'failed' && styles.statusRejected
					)}>
						<span>
							{status === 'success' && 'Завершено'}
							{status === 'pending' && 'В обработке'}
							{status === 'failed' && 'Отклонено'}
						</span>
					</div>
				</div>
			</td>
		</tr>
	)
}