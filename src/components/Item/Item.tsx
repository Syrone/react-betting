import { useState } from 'react'
import clsx from 'clsx'

import useMediaQuery from '../../hooks/useMediaQuery'

import { Button, ButtonAnchor } from '../Button/Button'
import Icon from '../Icon/Icon'
import Input from '../Input/Input'
import ToggleInput from '../ToggleInput/ToggleInput'
import Tooltip from '../Tooltip/Tooltip'
import Modal from '../Modal/Modal'

import styles from './Item.module.scss'

export interface Bookie {
	name: { label: string, href: string }
	outcome: string
	odds: { index: string, label: string, direction: 'up' | 'down' }
}

export interface ItemProps {
	date?: string
	sport?: string
	title?: string
	live?: boolean
	time?: string
	profit?: string
	bookies?: Bookie[]
	status: 'free' | 'paid'
}

export default function Item(
	{
		date, sport, title, live, time, profit, bookies, status
	}: ItemProps) {
	const [modalState, setModalState] = useState<'closed' | 'opening' | 'open' | 'closing'>('closed')
	const isDesktop = useMediaQuery('(min-width: 992px)')

	const bookiesBlank: Bookie[] = [
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
	]

	const openModal = () => {
		setModalState('opening')

		requestAnimationFrame(() => {
			setModalState('open')
		})
	}

	const closeModal = () => {
		setModalState('closing')
		setTimeout(() => {
			setModalState('closed')
		}, 300)
	}

	return (
		<>
			<article className={styles.item}>
				<div className={clsx(
					styles.itemStatus,
					status === 'paid' && styles.itemStatusPaid
				)}>
					{status === 'paid' && (
						<div className={styles.itemStatusCloser}>
							<div className={styles.itemStatusContent}>
								<p>
									Доступ только по подписке
								</p>
							</div>
						</div>
					)}
					<div className={styles.itemMatch}>
						<ul className={styles.itemDetails}>
							<li className={styles.itemDetail}>
								<Icon
									className={styles.itemDetailIcon}
									name='calendar' />
								<span>{status === 'paid' ? '28.05, 02:00' : date}</span>
							</li>
							<li className={styles.itemDetail}>
								<Icon
									className={styles.itemDetailIcon}
									name='reward' />
								<span>{status === 'paid' ? 'Футбол' : sport}</span>
							</li>
						</ul>
						<h3
							className={styles.itemTitle}>
							{status === 'paid' ? 'Palestino — Mushuc' : title}
						</h3>
						<ul className={styles.itemTags}>
							{live && (
								<li className={clsx(
									styles.itemTag,
									styles.itemTagLive
								)}>
									<Icon
										className={styles.itemTagIcon}
										name='live' />
									<span>Live</span>
								</li>
							)}
							<li className={clsx(
								styles.itemTag
							)}>
								<Icon
									className={styles.itemTagIcon}
									name='time' />
								<span>{status === 'paid' ? '10 м' : time}</span>
							</li>
						</ul>
					</div>
					<ul className={styles.itemBookies}>
						<li className={clsx(
							styles.itemBookie,
							styles.itemBookieHeader
						)}>
							<span
								className={clsx(
									styles.itemBookieCell,
									styles.itemBookieName
								)}>
								Букмекер
							</span>
							<span
								className={clsx(
									styles.itemBookieCell,
									styles.itemBookieOutcome
								)}>
								Исход
							</span>
							<span
								className={clsx(
									styles.itemBookieCell,
									styles.itemBookieOdds
								)}>
								Коэф.
							</span>
						</li>
						{
							status === 'free' ? (
								bookies?.map((item, i) => (
									<li key={i} className={styles.itemBookie}>
										<span className={clsx(
											styles.itemBookieCell,
											styles.itemBookieName
										)}>
											<ButtonAnchor
												href={item.name.href}
												className={clsx(
													styles.itemBookieButton,
													styles.itemBookieLink
												)}
												icon='arrowRight'>
												{item.name.label}
											</ButtonAnchor>
										</span>
										<span
											className={clsx(
												styles.itemBookieCell,
												styles.itemBookieOutcome
											)}>
											<Tooltip content='Спартак победит с форой +2'>
												<Button
													className={clsx(
														styles.itemBookieButton,
														styles.itemBookieTooltip
													)}
													icon='error'>
													{item.outcome}
												</Button>
											</Tooltip>
										</span>
										<span
											className={clsx(
												styles.itemBookieCell,
												styles.itemBookieOdds
											)}>
											<span>{item.odds.label}</span>
											<Icon
												className={clsx(
													styles.itemBookieOddsIcon,
													item.odds.direction === 'up' ? styles.itemBookieOddsIconUp : styles.itemBookieOddsIconDown
												)}
												name={item.odds.direction === 'up' ? 'upward' : 'downward'} />
										</span>
									</li>
								))
							) : (
								bookiesBlank.map((item, i) => (
									<li key={i} className={styles.itemBookie}>
										<span className={clsx(
											styles.itemBookieCell,
											styles.itemBookieName
										)}>
											<ButtonAnchor
												href={item.name.href}
												className={clsx(
													styles.itemBookieButton,
													styles.itemBookieLink
												)}
												icon='arrowRight'>
												{item.name.label}
											</ButtonAnchor>
										</span>
										<span
											className={clsx(
												styles.itemBookieCell,
												styles.itemBookieOutcome
											)}>
											<Button
												className={clsx(
													styles.itemBookieButton,
													styles.itemBookieTooltip
												)}
												icon='error'>
												{item.outcome}
											</Button>
										</span>
										<span
											className={clsx(
												styles.itemBookieCell,
												styles.itemBookieOdds
											)}>
											<span>{item.odds.label}</span>
											<Icon
												className={clsx(
													styles.itemBookieOddsIcon,
													item.odds.direction === 'up' ? styles.itemBookieOddsIconUp : styles.itemBookieOddsIconDown
												)}
												name={item.odds.direction === 'up' ? 'upward' : 'downward'} />
										</span>
									</li>
								))
							)
						}
					</ul>
				</div>
				<div className={styles.itemProfit}>
					<div className={styles.itemProfitInfo}>
						<div className={styles.itemProfitLabel}>
							Прибыль
						</div>
						<div className={styles.itemProfitValue}>
							{status === 'paid' ? '4,21' : profit}%
						</div>
					</div>
					<Button
						className={styles.itemProfitButton}
						style='icon'
						icon='calcFill'
						onClick={modalState === 'open' ? closeModal : openModal} />
				</div>
			</article>

			<Modal state={modalState} onClose={closeModal}>
				<Modal.Header title='Калькулятор ставок' onClose={closeModal}></Modal.Header>
				<Modal.Body>
					<div className={styles.itemModalContent}>
						<div className={clsx(
							styles.itemStatus,
							status === 'paid' && styles.itemStatusPaid
						)}>
							{status === 'paid' && (
								<div className={styles.itemStatusCloser}>
									<div className={styles.itemStatusContent}>
										<p>
											Доступ только по подписке
										</p>
									</div>
								</div>
							)}
							<div className={styles.itemModalHeader}>
								<div className={styles.itemMatch}>
									<h3
										className={styles.itemTitle}>
										{status === 'paid' ? 'Palestino — Mushuc' : title}
									</h3>
									<ul className={styles.itemDetails}>
										<li className={styles.itemDetail}>
											<Icon
												className={styles.itemDetailIcon}
												name='calendar' />
											<span>{status === 'paid' ? '28.05, 02:00' : date}</span>
										</li>
										<li className={styles.itemDetail}>
											<Icon
												className={styles.itemDetailIcon}
												name='reward' />
											<span>{status === 'paid' ? 'Футбол' : sport}</span>
										</li>
									</ul>
								</div>

								<div className={styles.itemModalCalc}>
									<Input
										containerClassName={styles.itemModalCalcInput}
										inputSize={isDesktop ? '' : 'md'}
										type='text'
										name='bet-amount'
										placeholder={isDesktop ? 'Введите сумму ставки' : 'Cумма ставки'} />
									<Button
										className={styles.itemModalCalcButton}
										size={isDesktop ? 'base': 'md'}
										style='primary'>
										Рассчитать
									</Button>
								</div>
							</div>
							<div className={styles.itemModalBody}>
								<ul className={styles.itemModalBookies}>
									{status === 'free' ? (
										bookies?.map((item, i) => (
											<li key={i} className={styles.itemModalBookie}>
												<div className={styles.itemModalBookieHeader}>
													<span className={styles.itemModalBookieCurrent}>
														{item.odds.index}
													</span>
													<h5 className={styles.itemModalBookieName}>
														{item.name.label}
													</h5>
												</div>
												<div className={styles.itemModalBookieOdds}>
													{item.odds.label}
												</div>
												<dl className={styles.itemModalDetails}>
													<dt className={styles.itemModalDetailsLabel}>
														Ставки
													</dt>
													<dd className={styles.itemModalDetailsValue}>
														37.68
													</dd>

													<dt className={styles.itemModalDetailsLabel}>
														Выигрыши
													</dt>
													<dd className={styles.itemModalDetailsValue}>
														105.50
													</dd>
												</dl>
											</li>
										))
									) : (
										bookiesBlank.map((item, i) => (
											<li key={i} className={styles.itemModalBookie}>
												<div>
													<span className={styles.itemModalBookieCurrent}>
														{item.odds.index}
													</span>
													<h5 className={styles.itemModalBookieName}>
														{item.name.label}
													</h5>
												</div>
												<div className={styles.itemModalBookieOdds}>
													{item.odds.label}
												</div>
												<dl className={styles.itemModalDetails}>
													<dt className={styles.itemModalDetailsLabel}>
														Ставки
													</dt>
													<dd className={styles.itemModalDetailsValue}>
														37.68
													</dd>

													<dt className={styles.itemModalDetailsLabel}>
														Выигрыши
													</dt>
													<dd className={styles.itemModalDetailsValue}>
														105.50
													</dd>
												</dl>
											</li>
										))
									)}
								</ul>
							</div>
						</div>
						<div className={styles.itemModalFooter}>
							<div className={styles.itemProfitInfo}>
								<div className={styles.itemProfitLabel}>
									Прибыль
								</div>
								<div className={styles.itemProfitValue}>
									5.49 к 5.52
								</div>
								<div className={styles.itemProfitLabel}>
									(5.49% до 5.52%)
								</div>
							</div>

							<ToggleInput 
								className={styles.itemModalCheckbox}
								label='Округлять все ставки'
								name='round' />
						</div>
					</div>
				</Modal.Body>
			</Modal>
		</>
	)
}