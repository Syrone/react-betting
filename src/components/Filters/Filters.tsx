import { useState, useEffect } from 'react'
import clsx from 'clsx'

import useMediaQuery from '@hooks/useMediaQuery'

import { Button } from '@components/Button/Button'
import Input from '@/components/Forms/Input/Input'
import Select, { type Option } from '@/components/Forms/Select/Select'
import Offcanvas from '@components/Offcanvas/Offcanvas'
import Collapse from '@components/Collapse/Collapse'
import ToggleInput from '@/components/Forms/ToggleInput/ToggleInput'

import styles from './Filters.module.scss'

type Props = {}

const SELECT_BETTING: Option[] = [
	{ icon: 'bitcoin', label: 'EsporteNetVip', value: 'betting-0' },
	{ icon: 'bitcoin', label: 'NairaBet', value: 'betting-1' },
	{ icon: 'bitcoin', label: 'Piwi247', value: 'betting-2' },
	{ icon: 'bitcoin', label: 'OrbitX', value: 'betting-3' },
	{ icon: 'bitcoin', label: 'Matchbook', value: 'betting-4' },
	{ icon: 'bitcoin', label: 'Piwi247', value: 'betting-5' },
	{ icon: 'bitcoin', label: 'EsporteNetVip', value: 'betting-6' },
	{ icon: 'bitcoin', label: 'EsporteNetVip', value: 'betting-7' },
	{ icon: 'bitcoin', label: 'NairaBet', value: 'betting-8' },
	{ icon: 'bitcoin', label: 'Piwi247', value: 'betting-9' },
	{ icon: 'bitcoin', label: 'OrbitX', value: 'betting-10' },
	{ icon: 'bitcoin', label: 'Matchbook', value: 'betting-11' },
	{ icon: 'bitcoin', label: 'Piwi247', value: 'betting-12' },
	{ icon: 'bitcoin', label: 'EsporteNetVip', value: 'betting-13' },
]

const SELECT_EVENTS: Option[] = [
	{ label: 'Все', value: 'event-all' },
	{ label: 'Обычные', value: 'event-0' },
	{ label: 'Live', value: 'event-1' },
]

export default function Filters({ }: Props) {
	const [filters, setFilters] = useState({
		betting: [] as string[],
		event: null as string | null,
		sort: {
			dateAsc: false,
			incomeAsc: true
		},
		temp: {
			betting: [] as string[],
			event: null as string | null
		}
	})
	const [searchMode, setSearchMode] = useState(false)
	const [offcanvasState, setOffcanvasState] = useState<'closed' | 'opening' | 'open' | 'closing'>('closed')
	const isDesktop = useMediaQuery('(min-width: 992px)')

	const onBettingChange = (sel: Option | Option[] | null) => {
		setFilters(prev => ({
			...prev,
			betting: Array.isArray(sel) ? sel.map(o => o.value) : []
		}))
	}
	const onEventChange = (sel: Option | Option[] | null) => {
		setFilters(prev => ({
			...prev,
			event: (sel && !Array.isArray(sel)) ? sel.value : null
		}))
	}
	const toggleDateSort = () => {
		setFilters(prev => ({
			...prev,
			sort: { ...prev.sort, dateAsc: !prev.sort.dateAsc }
		}))
	}
	const toggleIncomeSort = () => {
		setFilters(prev => ({
			...prev,
			sort: { ...prev.sort, incomeAsc: !prev.sort.incomeAsc }
		}))
	}

	useEffect(() => {
		isDesktop && setOffcanvasState('closed')
	}, [isDesktop, offcanvasState])

	const applyTempFilters = () => {
		setFilters(prev => ({
			...prev,
			betting: prev.temp.betting,
			event: prev.temp.event,
			temp: {
				betting: [],
				event: null
			}
		}))
		closeOffcanvas()
	}

	const resetTempFilters = () => {
		setFilters(prev => ({
			...prev,
			temp: {
				betting: [],
				event: null
			}
		}))
	}

	const openOffcanvas = () => {
		setFilters(prev => ({
			...prev,
			temp: {
				betting: prev.betting,
				event: prev.event
			}
		}))
		setOffcanvasState('opening')

		requestAnimationFrame(() => {
			setOffcanvasState('open')
		})
	}

	const closeOffcanvas = () => {
		setOffcanvasState('closing')
		setTimeout(() => {
			setOffcanvasState('closed')
			resetTempFilters()
		}, 300)
	}

	const sortTimeContent = (
		<Input
			type='text'
			className={styles.sortTimeInput}
			containerClassName={clsx(
				isDesktop && styles.flexLg,
				styles.sortTime
			)}
			name='spawn-time'
			inputSize='md'
			inputPlaceholder="Время появления"
			suffixIcon="error"
		/>
	)

	return (
		<>
			<div className={styles.filters}>
				{
					!searchMode && !isDesktop ? (
						<>
							<Button
								className={styles.buttonSort}
								style='secondary'
								size='md'
								icon='sort'
								onClick={offcanvasState === 'open' ? closeOffcanvas : openOffcanvas}>
								Открыть фильтры
							</Button>
							<Button
								className={styles.buttonSearch}
								style='secondary'
								size='md'
								icon='search'
								onClick={() => setSearchMode(true)} />
						</>
					) : (
						<div className={styles.sortSearchContainer}>
							<Input
								type='text'
								containerClassName={clsx(
									styles.flexFull,
									styles.sortSearch
								)}
								name='search'
								inputSize='md'
								inputPlaceholder="Поиск по событию"
								prefixIcon="search"
							/>
							<Button
								className={styles.sortSearchCancel}
								onClick={() => setSearchMode(false)}>
								Отмена
							</Button>
						</div>
					)
				}

				{isDesktop && (
					<>
						<Select
							options={SELECT_BETTING}
							className={clsx(
								isDesktop && styles.flexLg
							)}
							multiple={true}
							placeholder="Букмекеры"
							searchPlaceholder="Поиск по букмекеру"
							values={filters.betting}
							onChange={onBettingChange} />

						{sortTimeContent}

						<Select
							options={SELECT_EVENTS}
							className={clsx(
								isDesktop && styles.flexLg
							)}
							placeholder="Тип события"
							value={filters.event || undefined}
							onChange={onEventChange} />
					</>
				)}

				<div className={styles.sortButtonContainer}>
					<div className={styles.sortButtonLabel}>
						<p>Сортировать:</p>
					</div>

					<Button
						className={clsx(
							isDesktop && styles.flexMd,
							styles.sortButton
						)}
						iconClassName={styles.sortButtonIcon}
						style={isDesktop ? 'secondary' : ''}
						size={isDesktop ? 'md' : ''}
						icon={filters.sort.dateAsc ? 'sortUp' : 'sortDown'}
						onClick={toggleDateSort}>
						Дата начала
					</Button>

					<Button
						className={clsx(
							isDesktop && styles.flexMd,
							styles.sortButton
						)}
						iconClassName={styles.sortButtonIcon}
						style={isDesktop ? 'secondary' : ''}
						size={isDesktop ? 'md' : ''}
						icon={filters.sort.incomeAsc ? 'sortUp' : 'sortDown'}
						onClick={toggleIncomeSort}>
						Доход
					</Button>
				</div>
			</div>

			<Offcanvas
				state={offcanvasState}
				className={styles.filtersOffcanvas}
				onClose={closeOffcanvas}>
				<Offcanvas.Header>
					<div className={styles.filtersOffcanvasHeader}>
						<Button
							className={styles.filtersOffcanvasClose}
							icon='arrowLeft'
							onClick={closeOffcanvas}>
							Назад
						</Button>
						<h3 className={clsx(
							'h5',
							styles.filtersOffcanvasTitle
						)}>
							Фильтры
						</h3>
					</div>
				</Offcanvas.Header>
				<Offcanvas.Body>
					<div className={styles.filtersOffcanvasBody}>
						{sortTimeContent}
						<Collapse
							className={styles.filtersCollapse}
							btnText='Тип события'
							initialOpen={true}>
							<Collapse.Body className={styles.filtersCollapseInner}>
								<ul className={styles.filtersCollapseList}>
									{SELECT_EVENTS.map(item => (
										<li key={item.value}>
											<ToggleInput
												type='radio'
												className={styles.filtersCollapseChoice}
												label={item.label}
												checked={filters.temp.event === item.value}
												onChange={() => setFilters(prev => ({
													...prev,
													temp: { ...prev.temp, event: item.value }
												}))} />
										</li>
									))}
								</ul>
							</Collapse.Body>
						</Collapse>
						<Collapse
							className={styles.filtersCollapse}
							btnText='Букмекеры'
							initialOpen={true}>
							<Collapse.Body className={styles.filtersCollapseInner}>
								<Input
									type="text"
									prefixIcon='search'
									inputSize='md'
									containerClassName={styles.filtersCollapseSearch}
									inputPlaceholder='Поиск по букмекеру' />
								<ul className={styles.filtersCollapseList}>
									{SELECT_BETTING.map(item => (
										<li key={item.value}>
											<ToggleInput
												className={styles.filtersCollapseChoice}
												label={item.label}
												checked={filters.temp.betting.includes(item.value)}
												onChange={() => setFilters(prev => ({
													...prev,
													temp: {
														...prev.temp,
														betting: prev.temp.betting.includes(item.value)
														? prev.temp.betting.filter(value => value !== item.value)
														: [...prev.temp.betting, item.value]
													}
												}))
												} />
										</li>
									))}
								</ul>
							</Collapse.Body>
						</Collapse>
					</div>
				</Offcanvas.Body>
				<Offcanvas.Footer>
					<div className={styles.filtersOffcanvasActions}>
						<Button
							className={styles.filtersOffcanvasAction}
							style='dark'
							size='base'
							onClick={resetTempFilters}>
							Сбросить
						</Button>
						<Button
							className={styles.filtersOffcanvasAction}
							style='primary'
							size='base'
							onClick={applyTempFilters}>
							Применить
						</Button>
					</div>
				</Offcanvas.Footer>
			</Offcanvas>
		</>
	)
}