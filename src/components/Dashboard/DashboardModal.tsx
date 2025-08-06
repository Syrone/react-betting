import { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'

import clsx from 'clsx'

import useMediaQuery from '@hooks/useMediaQuery'

import { useAppDispatch } from '@redux/store'
import { payments, withdraw } from '@redux/payment/slice'
import { selectorPayment } from '@redux/payment/selectors'
import { selectorUser } from '@redux/user/selectors'

import { type ISubscription } from '@models/ISubscription'
import { type IPaymentSystem } from '@models/IPaymentSystem'

import Icon from '@components/Icon/Icon'
import { Button } from '@components/Button/Button'
import { type IField } from '@components/Forms/IField'
import Error from '@components/Forms/Error/Error'
import Input from '@/components/Forms/Input/Input'
import Select, { type Option } from '@/components/Forms/Select/Select'
import Modal from '@components/Modal/Modal'
import { type TariffProps } from '@components/Tariff/Tariff'

import styles from './Dashboard.module.scss'

export type DashboardModalMode = 'withdrawal' | 'subscription'

type Props = {
	state: 'closed' | 'opening' | 'open' | 'closing'
	mode: DashboardModalMode
	selectedTariff?: ISubscription | null
	onClose: () => void
}

type Header = {
	type: string
	title: string
	subtitle: string
}

interface IFormFields {
	system: IField<IPaymentSystem>
	token: IField<string | null>
	network: IField<string | null>
	amount: IField<string>
	address: IField<string>
}

const SELECT_BETTING: Option[] = [
	{ icon: 'usdt', label: 'USDT', value: 'USDT' }
]

const SELECT_NET: Option[] = [
	{ label: 'ERC-20', value: 'ERC20' },
	{ label: 'TRC-20', value: 'TRC20' },
	{ label: 'BEP-20', value: 'BEP20' },
]

export default function DashboardModal({ state, mode, selectedTariff, onClose }: Props) {
	const dispatch = useAppDispatch()
	const { status } = useSelector(selectorPayment)
	const { data } = useSelector(selectorUser)
	const balance = data?.referral?.current_referral_balance
	const [dashboardMode, setDashboardMode] = useState<DashboardModalMode>(mode)
	const isDesktop = useMediaQuery('(min-width: 768px)')

	const [formFields, setFormFields] = useState<IFormFields>({
		system: { value: 'yookassa' as IPaymentSystem, isError: false, errorMessage: '', touched: false },
		token: { value: SELECT_BETTING[0].value as string | null, isError: false, errorMessage: '', touched: false },
		network: { value: SELECT_NET[0].value as string | null, isError: false, errorMessage: '', touched: false },
		amount: { value: '', isError: false, errorMessage: 'Введите сумму', touched: false },
		address: { value: '', isError: false, errorMessage: 'Введите номер карты/телефона', touched: false },
	})
	const [formError, setFormError] = useState<string | null>(null)

	const onBettingChange = (sel: Option | Option[] | null) => {
		setFormFields(prev => ({
			...prev,
			token: { ...prev.token, value: (sel && !Array.isArray(sel)) ? sel.value : null }
		}))
	}

	const onNetChange = (sel: Option | Option[] | null) => {
		setFormFields(prev => ({
			...prev,
			network: { ...prev.network, value: (sel && !Array.isArray(sel)) ? sel.value : null }
		}))
	}

	const validateAmount = (value: string): string => {
		if (!value.trim()) return 'Введите сумму'
		const num = Number(value)
		if (isNaN(num) || num <= 0) return 'Сумма должна быть положительным числом'
		if (num > balance) return 'Недостаточно средств на балансе'
		return null
	}
	const validateAddress = (value: string, system: IPaymentSystem): string => {
		if (!value.trim()) {
			return system === 'yookassa' ? 'Введите номер карты/телефона' : 'Введите адрес криптокошелька'
		}

		if (system === 'yookassa') {
			const digitsOnly = value.replace(/\D/g, '')

			const isCard = digitsOnly.length === 16
			const isPhone = digitsOnly.length === 11 && /^(7|8)/.test(digitsOnly)

			if (!isCard && !isPhone) {
				return 'Неверный формат: введите номер карты (16 цифр) или телефона (11 цифр, начинается с 7 или 8)'
			}
		} else if (system === 'crypto') {
			if (!/^[a-zA-Z0-9]{25,50}$/.test(value)) {
				return 'Неверный формат криптокошелька'
			}
		}

		return null
	}

	const runValidation = (): boolean => {
		let amountError: string | null = null
		let addressError: string | null = null

		if (dashboardMode === 'subscription') {
		}

		if (dashboardMode === 'withdrawal') {
			amountError = validateAmount(formFields.amount.value)
			addressError = validateAddress(formFields.address.value, formFields.system.value)
		}

		const updates: Partial<IFormFields> = {}
		if (amountError !== null) updates.amount = { ...formFields.amount, isError: true, errorMessage: amountError, touched: true }
		if (addressError !== null) updates.address = { ...formFields.address, isError: true, errorMessage: addressError, touched: true }

		if (Object.keys(updates).length) {
			setFormFields(prev => ({ ...prev, ...updates }))
			return false
		}
		return true
	}

	const handleChange = (name: keyof IFormFields) => (e: React.ChangeEvent<HTMLInputElement>) => {
		let newValue = e.target.value

		if (name === 'amount' || (name === 'address' && formFields.system.value !== 'crypto')) {
			newValue = newValue.replace(/\D/g, '')
		}

		setFormFields(prev => ({
			...prev,
			[name]: { ...prev[name], value: newValue, isError: false }
		}))
	}

	const handleBlur = (name: keyof IFormFields) => () => {
		const field = formFields[name]
		if (!field.touched) {
			let error: string | null = null
			if (name === 'amount') error = validateAmount(field.value)
			if (name === 'address') error = validateAddress(field.value, formFields.system.value)
			if (error) {
				setFormFields(prev => ({
					...prev,
					[name]: { ...prev[name], isError: true, touched: true }
				}))
			}
		}
	}

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault()
		setFormError(null)

		if (!runValidation()) return
		
		try {
			if (dashboardMode === 'subscription') {
				const { payment_url } = await dispatch(payments({
					system: formFields.system.value,
					subscription_id: selectedTariff!.subscription_id
				})).unwrap()
				onClose()
				window.location.href = payment_url
			} else if (dashboardMode === 'withdrawal') {
				await dispatch(withdraw({
					system: formFields.system.value,
					token: formFields.token.value,
					network: formFields.network.value,
					amount: Number(formFields.amount.value),
					address: formFields.address.value
				})).unwrap()
				onClose()
			}
		} catch (error: any) {
			setFormError(error.message || 'Произошла ошибка')
		}
	}

	const headers: Record<typeof dashboardMode, Header> = {
		withdrawal: { type: 'dashboard-bigger', title: 'Вывод средств', subtitle: 'Лимит одного вывода: 2 000 ₽ - 50 000 ₽' },
		subscription: { type: 'dashboard', title: 'Оплата подписки', subtitle: 'Подписка: Premium на 30 дней' },
	}

	useEffect(() => {
		if (state === 'opening') {
			setDashboardMode(mode)
		}

		if (dashboardMode === 'withdrawal') {
			setFormFields(prev => ({
				...prev,
				system: { ...prev.system, value: 'crypto' }
			}))
		}
	}, [mode, state])

	const choicePay = () => (
		<div className={styles.choicePay}>
			<Button
				icon='credit'
				isActive={formFields.system.value === 'yookassa'}
				className={styles.choicePayBtn}
				disabled={dashboardMode === 'withdrawal'}
				onClick={() => setFormFields(prev => ({
					...prev,
					system: { ...prev.system, value: 'yookassa' }
				}))}>
				Карта
			</Button>
			<Button
				icon='bitcoinPay'
				isActive={formFields.system.value === 'crypto'}
				className={styles.choicePayBtn}
				onClick={() => setFormFields(prev => ({
					...prev,
					system: { ...prev.system, value: 'crypto' }
				}))}>
				Криптовалюта
			</Button>
		</div>
	)

	return (
		<Modal state={state} type={headers[dashboardMode].type} className={styles.auth} onClose={onClose}>
			<Modal.Header brand={true} custom={true} onClose={onClose}>
				{dashboardMode === 'withdrawal' && (
					<>
						{isDesktop && choicePay()}
						<div className={styles.infoBlock}>
							<Icon name='error' className={styles.infoBlockIcon} />
							<div className={styles.infoBlockContent}>
								<p>
									Перед подтверждением вывода внимательно проверьте адрес кошелька.
								</p>
								<p>
									В случае указания неверного адреса мы не несем ответственности за утрату средств.
								</p>
								<p>
									Транзакции необратимы.
								</p>
							</div>
						</div>
					</>
				)}
				{dashboardMode === 'subscription' && (
					<div className={styles.modalHeader}>
						<h4 className={styles.modalTitle}>
							{headers[dashboardMode].title}
						</h4>
						<p className={styles.modalSubtitle}>{headers[dashboardMode].subtitle}</p>
					</div>
				)}
			</Modal.Header>
			<Modal.Body>
				{dashboardMode === 'withdrawal' && (
					<form className={styles.modalBody} onSubmit={handleSubmit} noValidate>
						<div className={styles.modalHeader}>
							<h4 className={styles.modalTitle}>
								{headers[dashboardMode].title}
							</h4>
							<p className={styles.modalSubtitle}>{headers[dashboardMode].subtitle}</p>
						</div>
						{!isDesktop && choicePay()}
						<div className={styles.modalForm}>
							<div className={styles.modalFormFields}>
								{formFields.system.value === 'crypto' && (
									<>
										<Select
											options={SELECT_BETTING}
											className={clsx(
												isDesktop && styles.flexLg
											)}
											withIcon={true}
											labelChanged={true}
											size='base'
											placeholder='Букмекеры'
											value={formFields.token.value || undefined}
											onChange={onBettingChange} />
										<Select
											options={SELECT_NET}
											className={clsx(
												isDesktop && styles.flexLg
											)}
											labelChanged={true}
											size='base'
											placeholder='Сеть'
											value={formFields.network.value || undefined}
											onChange={onNetChange} />
									</>
								)}
								<Input
									type='text'
									containerClassName={clsx(
										styles.authInput
									)}
									name='amount'
									inputPlaceholder='Введите сумму'
									inputError={formFields.amount.errorMessage}
									isError={formFields.amount.isError}
									value={formFields.amount.value}
									onChange={handleChange('amount')}
									onBlur={handleBlur('amount')}
									required={true}
								/>
								<Input
									type='text'
									containerClassName={clsx(
										styles.authInput
									)}
									name='address'
									inputPlaceholder={formFields.system.value === 'yookassa' ? 'Введите номер карты/телефона' : 'Введите номер кошелька'}
									inputError={formFields.address.errorMessage}
									isError={formFields.address.isError}
									value={formFields.address.value}
									onChange={handleChange('address')}
									onBlur={handleBlur('address')}
									required={true}
								/>
							</div>
							{formError && (
								<Error error={formError} />
							)}
							<div className={styles.modalFormActions}>
								<Button type='submit' size='base' btnStyle='primary'>
									{status === 'loading' ? 'Обрабатывается...' : 'Вывести'}
								</Button>
							</div>
						</div>
					</form>
				)}
				{dashboardMode === 'subscription' && (
					<form onSubmit={handleSubmit} noValidate>
						{choicePay()}

						<div className={styles.modalBottom}>
							<div className={styles.modalPrice}>
								<span>Итого:</span>
								<span className={styles.modalPriceValue}>{selectedTariff ? selectedTariff.price : '0'} ₽</span>
								<span>/мес</span>
							</div>
							{formError && (
								<Error error={formError} />
							)}
							<Button type='submit' size='base' btnStyle='primary'>
								{status === 'loading' ? 'Обрабатывается...' : 'Оплатить'}
							</Button>
						</div>
					</form>
				)}
			</Modal.Body>
		</Modal>
	)
}