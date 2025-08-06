import { useState, useEffect, type FormEvent } from 'react'
import { useSelector } from 'react-redux'

import clsx from 'clsx'

import { type ISubscription } from '@models/ISubscription'

import { useTime } from '@hooks/useTime'

import { useAppDispatch } from '@redux/store'
import { referral } from '@redux/user/slice'
import { selectorUser } from '@redux/user/selectors'
import { selectorPayment } from '@redux/payment/selectors'

import { Button, ButtonLink } from '@components/Button/Button'
import { type IField } from '@components/Forms/IField'
import Input from '@components/Forms/Input/Input'
import Error from '@components/Forms/Error/Error'
import SwitchInput from '@components/Forms/SwitchInput/SwitchInput'
import DashboardModal, { type DashboardModalMode } from '@components/Dashboard/DashboardModal'
import Feedback from '@components/Feedback/Feedback'

import styles from './Dashboard.module.scss'

type Props = {}

interface IFormFields {
	refCode: IField<string>
}

export default function StatsCard({ }: Props) {
	const dispatch = useAppDispatch()
	const { data, status, error, refreshStatus } = useSelector(selectorUser)
	const { newBalance } = useSelector(selectorPayment)

	const subscription = data?.subscription
	const balance = newBalance ? newBalance : data?.referral?.current_referral_balance
	const balanceRef = newBalance ? newBalance : data?.referral?.current_referral_balance
	const expiresAt = data?.subscription?.expires_at ?? 0
	const referralCode = data?.referral?.referral_code ?? ''

	const remaining = useTime(expiresAt, 'remaining')

	const [formFields, setFormFields] = useState<IFormFields>({
		refCode: { value: '', isError: false, errorMessage: 'Реф. код должен быть не короче 8 символов', touched: false },
	})
	const [formError, setFormError] = useState<string | null>(null)
	const [isEditing, setIsEditing] = useState(false)

	const [autoRenewal, setAutoRenewal] = useState(true)
	const [modalMode, setModalMode] = useState<DashboardModalMode>('subscription')
	const [modalState, setModalState] = useState<'closed' | 'opening' | 'open' | 'closing'>('closed')
	const [selectedTariff, setSelectedTariff] = useState<ISubscription | null>(null)

	const openModal = (mode: DashboardModalMode, tariff?: ISubscription) => {
		setModalMode(mode)
  	setSelectedTariff(tariff)
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

	const validateRefCode = (value: string): string | null => {
		const val = value.toUpperCase()
		const minLength = 4
		const maxLength = 10
		const pattern = /^[A-Z0-9]+$/

		if (val.length < minLength || val.length > maxLength) {
			return `Реферальный код должен быть от ${minLength} до ${maxLength} символов`
		}
		if (!pattern.test(val)) {
			return 'Реферальный код должен содержать только латинские буквы и цифры'
		}
		if (val === referralCode.toUpperCase()) {
			return 'Введенный реферальный код совпадает с текущим'
		}
		return null
	}

	const runValidation = (): boolean => {
		const refCodeError = validateRefCode(formFields.refCode.value)

		const updates: Partial<IFormFields> = {}
		if (refCodeError) {
			updates.refCode = { ...formFields.refCode, isError: true, errorMessage: refCodeError, touched: true }
			setFormFields(prev => ({ ...prev, ...updates }))
			return false
		}

		if (Object.keys(updates).length) {
			setFormFields(prev => ({ ...prev, ...updates }))
			return false
		} else {
			updates.refCode = { ...formFields.refCode, isError: false, errorMessage: '' }
			setFormFields(prev => ({ ...prev, ...updates }))
		}

		return true
	}

	const handleChange = (name: keyof IFormFields) => (e: React.ChangeEvent<HTMLInputElement>) => {
		setFormFields(prev => ({
			...prev,
			[name]: { ...prev[name], value: e.target.value, isError: false }
		}))
	}

	const handleBlur = (name: keyof IFormFields) => () => {
		const field = formFields[name]
		if (!field.touched) {
			let error: string | null = null
			if (name === 'refCode') error = validateRefCode(field.value)
			if (error) {
				setFormFields(prev => ({
					...prev,
					[name]: { ...prev[name], isError: true, touched: true }
				}))
			}
		}
	}

	const handleSubmit = async (e: FormEvent) => {
		e.preventDefault()

		if (status === 'loading') return
		if (!runValidation()) return

		try {
			await dispatch(referral({ referral_code: formFields.refCode.value })).unwrap()
			setIsEditing(false)
			setFormError(null)
		} catch (error: any) {
			setFormError(error.error?.detail || error.message || 'Произошла ошибка')
		}
	}

	const handleEditClick = () => {
		setIsEditing(true)
		setFormError(null)
	}

	useEffect(() => {
		if (referralCode && !formFields.refCode.touched) {
			setFormFields(prev => ({
				...prev,
				refCode: {
					...prev.refCode,
					value: referralCode,
				}
			}))
		}
	}, [referralCode])

	if (status === 'loading') {
		return <Feedback className={styles.feedback} message='Loading dashboard data...' />
	}

	if (error) {
		return <Feedback className={styles.feedback} message={`Error loading dashboard: ${error.message}`} />
	}

	if (!data) {
		return <Feedback className={styles.feedback} message='No dashboard data available.' />
	}

	return (
		<>
			<div className={styles.container}>
				<div className={styles.card}>
					<div className={styles.cardHeader}>
						<div className={styles.cardHeaderContent}>
							<h2 className={clsx(
								'h1',
								styles.cardHeaderTitle
							)}>
								<span className={styles.cardSubtitle}>
									Ваша подписка
								</span>
								{data.subscription.name}
							</h2>
						</div>
						<div className={styles.cardHeaderActions}>
							{remaining ? (
								<Button
									size='md'
									btnStyle='primary'
									className={styles.cardHeaderBtn}
									onClick={() => openModal('subscription', subscription)}>
									Продлить
								</Button>
							) : (
								<ButtonLink
									href='/tariffs'
									size='md'
									btnStyle='primary'
									className={styles.cardHeaderBtn}>
									Посмотреть тарифы
								</ButtonLink>
							)}
						</div>
					</div>
					<div className={styles.cardMain}>
						<ul className={styles.cardDetail}>
							<li className={styles.cardDetailItem}>
								<div className={styles.cardDetailContent}>
									<h3 className='h4'>
										<span className={styles.cardSubtitle}>
											Стоимость
										</span>
										{data.subscription.price} ₽/месяц
									</h3>
								</div>
							</li>
							<li className={styles.cardDetailItem}>
								<div className={styles.cardDetailContent}>
									<h3 className='h4'>
										<span className={styles.cardSubtitle}>
											Кончается через
										</span>
										{remaining ? remaining : '0 дн, 0 ч'}
									</h3>
								</div>
							</li>
						</ul>
					</div>
					<div className={styles.cardFooter}>
						<div className={styles.cardAutorenewal}>
							<div className={styles.cardAutorenewalContent}>
								<h3 className='h4'>
									<span className={clsx(
										styles.cardSubtitle,
										'd-none d-lg-block'
									)}>
										Автопродление с реферального счета
									</span>
									<span className={clsx(
										styles.cardSubtitle,
										'd-lg-none'
									)}>
										Автопродление с реф. счета
									</span>
									{autoRenewal ? 'Включено' : 'Отключено'}
								</h3>
							</div>

							<SwitchInput checked={autoRenewal} onChange={() => setAutoRenewal(!autoRenewal)} />
						</div>
					</div>
				</div>
				<div className={styles.card}>
					<div className={styles.cardHeader}>
						<div className={styles.cardHeaderContent}>
							<h2 className={clsx(
								'h1',
								styles.cardHeaderTitle
							)}>
								<span className={styles.cardSubtitle}>
									Баланс
								</span>
								{balance} ₽
							</h2>
						</div>
						<div className={styles.cardHeaderActions}>
							<Button
								size='md'
								btnStyle='primary'
								className={styles.cardHeaderBtn}
								onClick={() => openModal('withdrawal')}
								disabled={data.referral.current_referral_balance == 0}>
								Вывести
							</Button>
						</div>
					</div>
					<div className={styles.cardMain}>
						<ul className={clsx(
							styles.cardDetail,
							styles.cardDetailBorderless
						)}>
							<li className={styles.cardDetailItem}>
								<div className={styles.cardDetailContent}>
									<h3 className='h4'>
										<span className={styles.cardSubtitle}>
											Рефералов
										</span>
										{data.referral.total_referrals} чел.
									</h3>
								</div>
							</li>
							<li className={styles.cardDetailItem}>
								<div className={styles.cardDetailContent}>
									<h3 className='h4'>
										<span className={styles.cardSubtitle}>
											% с оплаты
										</span>
										{data.referral.referral_percent}%
									</h3>
								</div>
							</li>
							<li className={styles.cardDetailItem}>
								<div className={styles.cardDetailContent}>
									<h3 className={clsx(
										'h4',
										styles.cardDetailTitle
									)}>
										<span className={styles.cardSubtitle}>
											Общий доход
										</span>
										{balanceRef} ₽
									</h3>
								</div>
							</li>
						</ul>

						<div className={styles.cardRefs}>
							<div className={styles.cardRefsHeader}>
								<h4 className={styles.cardRefsTitle}>
									<span className={styles.cardSubtitle}>
										Рефералов
									</span>
									<ButtonLink 
										className={clsx(
											styles.cardLink,
											'd-none d-lg-block'
										)}
										btnStyle='link'>
										Условия реферальной программы
									</ButtonLink>
								</h4>
							</div>
							<form 
								className={styles.cardRefsMain}
								onSubmit={handleSubmit}
								noValidate>
								<Input
									containerClassName={styles.cardRefsInputWrapper}
									className={styles.cardRefsInput}
									name='refCode'
									inputType={isEditing ? 'default' : 'readonly'}
									inputSize='base'
									inputPlaceholder='Введите реферальный код'
									inputError={formFields.refCode.errorMessage}
									isError={formFields.refCode.isError}
									value={formFields.refCode.value}
									onChange={handleChange('refCode')}
									onBlur={handleBlur('refCode')}
									required={true}
									isCopy={!isEditing} />
								{!isEditing ? (
									<Button
										className={styles.cardRefsBtn}
										size='icon-base'
										btnStyle='secondary'
										icon='edit'
										onClick={handleEditClick}
									/>
								) : (
									<Button
										type="submit"
										className={styles.cardRefsBtn}
										size='icon-base'
										btnStyle='secondary'
										icon='check'
										disabled={refreshStatus === 'loading'}
									/>
								)}
							</form>
							{formError && (
								<Error error={formError} />
							)}
							<ButtonLink 
								className={clsx(
									styles.cardLink,
									'd-lg-none'
								)}
								btnStyle='link'>
								Условия реферальной программы
							</ButtonLink>
						</div>
					</div>
				</div>
			</div>

			<DashboardModal
				state={modalState}
				mode={modalMode}
				selectedTariff={selectedTariff}
				onClose={closeModal} />
		</>
	)
}