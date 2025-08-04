import { useSelector } from 'react-redux'

import clsx from 'clsx'

import { useAppDispatch } from '@redux/store'
import { operations } from '@redux/user/slice'
import { selectorLastOperation, selectorOperationPage, selectorOperationStatus } from '@redux/user/selectors'

import { type IOperationItem } from '@models/IOperationItem'

import { Button } from '@components/Button/Button'
import Icon from '@components/Icon/Icon'
import HistoryRow from '@components/Dashboard/HistoryRow'

import styles from './Dashboard.module.scss'

type Props = {}

export default function History({ }: Props) {
	const dispatch = useAppDispatch()
	const { items, total_count } = useSelector(selectorLastOperation)
	const operationsPage = useSelector(selectorOperationPage)
	const operationsStatus = useSelector(selectorOperationStatus)

  const isEmpty = items.length === 0
  const allLoaded = items.length >= total_count

	return (
		<div className={styles.history}>
			<div className={styles.historyHeader}>
				<h3 className={styles.historyTitle}>
					История операций
				</h3>
			</div>

			<div className={clsx(
				styles.historyMain,
				isEmpty && styles.historyMainEmpty
			)}>
				{isEmpty ? (
					<div className={styles.historyEmpty}>
						<Icon name='empty' className={styles.historyEmptyIcon} />
						<p>Здесь пока что пусто</p>
					</div>
				) : (
					<>
						<div className={styles.historyWrapper}>
							<table className={styles.historyTable}>
								<thead className={styles.historyTableThead}>
									<tr>
										<th className={styles.historyTableTh}>Дата</th>
										<th className={styles.historyTableTh}>Тип</th>
										<th className={styles.historyTableTh}>Сумма</th>
										<th className={styles.historyTableTh}>Статус</th>
									</tr>
								</thead>
								<tbody className={styles.historyTableTbody}>
									{items.map((item: IOperationItem) => (
										<HistoryRow key={item.id} {...item} />
									))}
								</tbody>
							</table>
						</div>
						{!isEmpty && !allLoaded && (
							<div className={styles.historyActions}>
								<Button 
									size='base' 
									style='dark' 
									className={styles.historyMore}
									onClick={() => dispatch(operations({ page: operationsPage, per_page: 10 }))}>
									{operationsStatus === 'loading' ? 'Загрузка...' : 'Показать еще'}
								</Button>
							</div>
						)}
					</>
				)}
			</div>
		</div>
	)
}