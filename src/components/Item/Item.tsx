import { useState } from 'react'
import clsx from 'clsx'

import { type BetsResponse } from '@models/response/BetsResponse'

import useMediaQuery from '@hooks/useMediaQuery'
import { useTime } from '@hooks/useTime'

import { Button, ButtonAnchor } from '@components/Button/Button'
import Icon from '@components/Icon/Icon'
import Input from '@/components/Forms/Input/Input'
import ToggleInput from '@/components/Forms/ToggleInput/ToggleInput'
import Tooltip from '@components/Tooltip/Tooltip'
import Modal from '@components/Modal/Modal'
import BlockBlur from '@components/BlockBlur/BlockBlur'

import styles from './Item.module.scss'

export default function Item(
	{
		id,
		teams,
		sport,
		start_event,
		created_at,
		is_live,
		pair_lifetime,
		profit,
		bookmakers,
		hide
	}: BetsResponse) {
	const [modalState, setModalState] = useState<'closed' | 'opening' | 'open' | 'closing'>('closed')
	const isDesktop = useMediaQuery('(min-width: 992px)')
	const startEventTime = useTime(start_event, 'date-time')
	const createdAtTime = useTime(created_at, 'minutes')

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
					hide && styles.itemBlur
				)}>
					{hide && (
						<BlockBlur
							content='Доступ только по подписке'
							className={styles.itemStatusCloser} />
					)}
					<div className={styles.itemMatch}>
						<ul className={styles.itemDetails}>
							<li className={styles.itemDetail}>
								<Icon
									className={styles.itemDetailIcon}
									name='calendar' />
								<span>{startEventTime}</span>
							</li>
							<li className={styles.itemDetail}>
								<Icon
									className={styles.itemDetailIcon}
									name='reward' />
								<span>{sport}</span>
							</li>
						</ul>
						<h3
							className={styles.itemTitle}>
							{teams}
						</h3>
						<ul className={styles.itemTags}>
							{is_live && (
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
								<span>{createdAtTime}</span>
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
						{bookmakers.map(({ name, market, description, event_url_bookmaker, odds_history, status }, index) => (
							<li key={index} className={styles.itemBookie}>
								<span className={clsx(
									styles.itemBookieCell,
									styles.itemBookieName
								)}>
									<ButtonAnchor
										href={event_url_bookmaker}
										target='_blank'
										className={clsx(
											styles.itemBookieButton,
											styles.itemBookieLink
										)}
										icon='arrowRight'>
										{name}
									</ButtonAnchor>
								</span>
								<span
									className={clsx(
										styles.itemBookieCell,
										styles.itemBookieOutcome
									)}>
									<Tooltip content={description}>
											<Button
												className={clsx(
													styles.itemBookieButton,
													styles.itemBookieTooltip
												)}
												icon='error'>
												{market}
											</Button>
									</Tooltip>
								</span>
								<span
									className={clsx(
										styles.itemBookieCell,
										styles.itemBookieOdds
									)}>
									<span className={styles.itemBookieOddsValue}>{odds_history[0].odds}</span>
									<Icon
										className={clsx(
											styles.itemBookieOddsIcon,
											status === 'up' ? styles.itemBookieOddsIconUp : styles.itemBookieOddsIconDown
										)}
										name={status === 'up' ? 'upward' : 'downward'} />
								</span>
							</li>
						))}
					</ul>
				</div>
				<div className={styles.itemProfit}>
					<div className={styles.itemProfitInfo}>
						<div className={styles.itemProfitLabel}>
							Прибыль
						</div>
						<div className={styles.itemProfitValue}>
							{profit}%
						</div>
					</div>
					<Button
						className={styles.itemProfitButton}
						btnStyle='icon'
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
							hide && styles.itemBlur
						)}>
							{hide && (
								<BlockBlur content='Доступ только по подписке' className={styles.itemStatusCloser} />
							)}
							<div className={styles.itemModalHeader}>
								<div className={styles.itemMatch}>
									<h3
										className={styles.itemTitle}>
										{teams}
									</h3>
									<ul className={styles.itemDetails}>
										<li className={styles.itemDetail}>
											<Icon
												className={styles.itemDetailIcon}
												name='calendar' />
											<span>{startEventTime}</span>
										</li>
										<li className={styles.itemDetail}>
											<Icon
												className={styles.itemDetailIcon}
												name='reward' />
											<span>{sport}</span>
										</li>
									</ul>
								</div>

								<div className={styles.itemModalCalc}>
									<Input
										containerClassName={styles.itemModalCalcInput}
										inputSize={isDesktop ? '' : 'md'}
										type='text'
										name='bet-amount'
										inputPlaceholder={isDesktop ? 'Введите сумму ставки' : 'Cумма ставки'} />
									<Button
										className={styles.itemModalCalcButton}
										size={isDesktop ? 'base': 'md'}
										btnStyle='primary'>
										Рассчитать
									</Button>
								</div>
							</div>
							<div className={styles.itemModalBody}>
								<ul className={styles.itemModalBookies}>
									{bookmakers.map(({ name, market, odds_history }, index) => (
										<li key={index} className={styles.itemModalBookie}>
											<div className={styles.itemModalBookieHeader}>
												<span className={styles.itemModalBookieCurrent}>
													{market}
												</span>
												<h5 className={styles.itemModalBookieName}>
													{name}
												</h5>
											</div>
											<div className={styles.itemModalBookieOdds}>
												{odds_history[0].odds}
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
									))}
								</ul>
							</div>
						</div>
						<div className={styles.itemModalFooter}>
							<div className={styles.itemProfitInfo}>
								<div className={styles.itemProfitLabel}>
									Прибыль
								</div>
								<div className={styles.itemProfitValue}>
									5.49 к 5.52
								</div>
								<div className={styles.itemProfitLabel}>
									(5.49% до 5.52%)
								</div>
							</div>

							<ToggleInput 
								className={styles.itemModalCheckbox}
								label='Округлять все ставки'
								name='round' />
						</div>
					</div>
				</Modal.Body>
			</Modal>
		</>
	)
}