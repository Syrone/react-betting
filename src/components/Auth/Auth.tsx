import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import clsx from 'clsx'

import { useAppDispatch } from '@redux/store'
import { loginUser, registerUser, forgotPassword } from '@redux/auth/slice'

import { Button } from '@components/Button/Button'
import { type IField } from '@components/Forms/IField'
import Error from '@components/Forms/Error/Error'
import Input from '@components/Forms/Input/Input'
import Modal from '@components/Modal/Modal'

import styles from './Auth.module.scss'

export type AuthMode = 'login' | 'register' | 'forgot' | 'success'

type Props = {
	state: 'closed' | 'opening' | 'open' | 'closing'
	mode: AuthMode
	onClose: () => void
}

type Header = {
	titleIcon: string
	title: string
	subtitle: string
}

interface IFormFields {
	username: IField<string | null>
	email: IField<string | null>
	password: IField<string | null>
	passwordRepeat: IField<string | null>
	refCode: IField<string | null>
}

export default function Auth({ state, mode, onClose }: Props) {
	const dispatch = useAppDispatch()
	const navigate = useNavigate()
	const [authMode, setAuthMode] = useState<AuthMode>(mode)

	const [formFields, setFormFields] = useState<IFormFields>({
		username: { value: '', isError: false, errorMessage: 'Имя пользователя должно содержать только строчные латинские буквы и цифры', touched: false },
		email: { value: '', isError: false, errorMessage: 'Некорректный email', touched: false },
		password: { value: '', isError: false, errorMessage: 'Введите пароль', touched: false },
		passwordRepeat: { value: '', isError: false, errorMessage: 'Пароли не совпадают', touched: false },
		refCode: { value: '', isError: false, errorMessage: 'Введите реферальный код', touched: false, show: false }
	})
	const [formError, setFormError] = useState<string | null>(null)

	const headers: Record<typeof authMode, Header> = {
		login: { titleIcon: '', title: 'Вход', subtitle: '' },
		register: { titleIcon: '', title: 'Регистрация', subtitle: '' },
		forgot: { titleIcon: '', title: 'Восстановить пароль', subtitle: '' },
		success: { titleIcon: 'check', title: 'Регистрация завершена', subtitle: 'На вашу почту отправлено письмо для активации аккаунта' },
	}

	const changeAuthMode = (mode: AuthMode) => {
		setAuthMode(mode)

		setFormFields({
      username: { value: '', isError: false, errorMessage: 'Имя пользователя должно содержать только строчные латинские буквы и цифры', touched: false },
      email: { value: '', isError: false, errorMessage: 'Некорректный email', touched: false },
      password: { value: '', isError: false, errorMessage: 'Введите пароль', touched: false },
      passwordRepeat: { value: '', isError: false, errorMessage: 'Пароли не совпадают', touched: false },
      refCode: { value: '', isError: false, errorMessage: 'Введите реферальный код', touched: false, show: false }
    })
    setFormError(null)
	}

	const validateUsername = (value: string) => /^[a-z0-9]{4,20}$/.test(value) ? null : formFields.username.errorMessage
	const validateEmail = (value: string) =>
		value.length >= 5 && value.length <= 50 && /^\S+@\S+\.\S+$/.test(value)
			? null
			: formFields.email.errorMessage
	const validatePassword = (value: string): string | null => {
		const minLength = 8
		const maxLength = 30

		if (value.length < minLength) {
			return `Пароль не должен быть короче ${minLength} символов`
		}

		if (value.length > maxLength) {
			return `Пароль не должен быть длинее ${maxLength} символов`
		}

		return null
	}
	const validatePasswordRepeat = (password: string, passwordRepeat: string) => password === passwordRepeat ? null : formFields.passwordRepeat.errorMessage
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
		return null
	}

	const runValidation = (): boolean => {
		let emailError: string | null = null
		let usernameError: string | null = null
		let passwordError: string | null = null
		let repeatError: string | null = null
		let refCodeError: string | null = null

		if (authMode !== 'forgot') {
			passwordError = validatePassword(formFields.password.value)
		}

		if (authMode === 'register') {
			usernameError = validateUsername(formFields.username.value)
			repeatError = validatePasswordRepeat(formFields.password.value, formFields.passwordRepeat.value)
			formFields.refCode.show && (refCodeError = validateRefCode(formFields.refCode.value))
		}

		if (authMode === 'register' || authMode === 'login' || authMode === 'forgot') {
			emailError = validateEmail(formFields.email.value)
		}

		const updates: Partial<IFormFields> = {}
		if (usernameError !== null) updates.username = { ...formFields.username, isError: true, touched: true }
		if (emailError !== null) updates.email = { ...formFields.email, isError: true, touched: true }
		if (passwordError !== null) updates.password = { ...formFields.password, isError: true, errorMessage: passwordError, touched: true }
		if (repeatError !== null) updates.passwordRepeat = { ...formFields.passwordRepeat, isError: true, touched: true }
		if (refCodeError !== null) updates.refCode = { ...formFields.refCode, isError: true, errorMessage: refCodeError, touched: true }

		if (Object.keys(updates).length) {
			setFormFields(prev => ({ ...prev, ...updates }))
			return false
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
			if (name === 'username') error = validateUsername(formFields.username.value)
			if (name === 'email') error = validateEmail(field.value)
			if (name === 'password') error = validatePassword(field.value)
			if (name === 'passwordRepeat') error = validatePasswordRepeat(formFields.password.value, field.value)
			if (name === 'refCode') error = validateRefCode(field.value)
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
			if (authMode === 'login') {
				await dispatch(loginUser({ email: formFields.email.value, password: formFields.password.value })).unwrap()
				onClose()
				navigate('/account')
			} else if (authMode === 'register') {
				const refCodeValue = formFields.refCode.value?.trim() || null
				
				await dispatch(registerUser({ username: formFields.username.value, email: formFields.email.value, password: formFields.password.value, referral_code: refCodeValue })).unwrap()
				changeAuthMode('success')
			} else if (authMode === 'forgot') {
				await dispatch(forgotPassword({ email: formFields.email.value })).unwrap()
				onClose()
			}
		} catch (error: any) {
			setFormError(error.message || 'Произошла ошибка')
		}
	}

	useEffect(() => {
		if (state === 'opening') {
			changeAuthMode(mode)
		}
	}, [mode, state])

	return (
		<Modal state={state} type='form' className={styles.auth} onClose={onClose}>
			<Modal.Header brand={true} titleIcon={headers[authMode].titleIcon} title={headers[authMode].title} subtitle={headers[authMode].subtitle} onClose={onClose} />
			<Modal.Body>
				<form className={styles.authForm} onSubmit={handleSubmit} noValidate>
					{(authMode === 'register') && (
						<Input
							type='text'
							containerClassName={clsx(
								styles.authInput
							)}
							name='username'
							autoComplete='username'
							inputPlaceholder='Username'
							inputError={formFields.username.errorMessage}
							isError={formFields.username.isError}
							value={formFields.username.value}
							onChange={handleChange('username')}
							onBlur={handleBlur('username')}
							required={true}
						/>
					)}
					{(authMode === 'register' || authMode === 'login' || authMode === 'forgot') && (
						<Input
							type='email'
							containerClassName={clsx(
								styles.authInput
							)}
							name='email'
							autoComplete='username'
							inputPlaceholder='Email'
							inputError={formFields.email.errorMessage}
							isError={formFields.email.isError}
							value={formFields.email.value}
							onChange={handleChange('email')}
							onBlur={handleBlur('email')}
							required={true}
						/>
					)}
					{(authMode === 'login' || authMode === 'register') && (
						<Input
							type='password'
							containerClassName={clsx(
								styles.authInput
							)}
							name='password'
							autoComplete={authMode === 'register' ? 'new-password' : 'current-password'}
							inputPlaceholder='Пароль'
							inputError={formFields.password.errorMessage}
							isError={formFields.password.isError}
							value={formFields.password.value}
							onChange={handleChange('password')}
							onBlur={handleBlur('password')}
							required={true}
						/>
					)}
					{authMode === 'register' && (
						<>
							<Input
								type='password'
								containerClassName={clsx(
									styles.authInput
								)}
								name='passwordRepeat'
								autoComplete='new-password'
								inputPlaceholder='Повторите пароль'
								inputError={formFields.passwordRepeat.errorMessage}
								isError={formFields.passwordRepeat.isError}
								value={formFields.passwordRepeat.value}
								onChange={handleChange('passwordRepeat')}
								onBlur={handleBlur('passwordRepeat')}
								required={true}
							/>
							{formFields.refCode.show ? (
								<Input
									type='text'
									containerClassName={clsx(
										styles.authInput
									)}
									name='refCode'
									inputPlaceholder='Реферальный код'
									inputError={formFields.refCode.errorMessage}
									isError={formFields.refCode.isError}
									value={formFields.refCode.value}
									onChange={handleChange('refCode')}
									onBlur={handleBlur('refCode')}
									required={formFields.refCode.show}
									onRemove={() => setFormFields(prev => ({
										...prev,
										refCode: { ...prev.refCode, show: false }
									}))}
								/>
							) : (
								<div className={styles.authAddWrapper}>
									<Button style='text-primary'
										onClick={() => setFormFields(prev => ({
											...prev,
											refCode: { ...prev.refCode, show: true }
										}))}>
										У меня есть реферальный код
									</Button>
								</div>
							)}
						</>
					)}
					{formError && (
						<Error error={formError} />
					)}
					<div className={styles.authActions}>
						<div className={styles.authButtons}>
							{authMode !== 'success' && (
								<Button type='submit' size='base' style='primary'>
									{authMode === 'login' && 'Войти'}
									{authMode === 'register' && 'Регистрация'}
									{authMode === 'forgot' && 'Отправить пароль'}
								</Button>
							)}
							{authMode === 'success' && (
								<Button size='base' style='primary' className={styles.authSuccess}
									onClick={() => onClose()}>
									Отлично
								</Button>
							)}
							{(authMode === 'forgot') && (
								<Button style='text-primary'
									onClick={() => changeAuthMode('login')}>
									Вернуться назад
								</Button>
							)}
						</div>
						{authMode === 'register' && (
							<div className={styles.authPolicy}>
								<p>
									Нажимая кнопку «Регистрация», вы даете соглашаетесь с условиями политики конфиденциальности
								</p>
							</div>
						)}
						{authMode === 'register' && (
							<div className={styles.authAccount}>
								Уже есть аккаунт? <Button className={styles.authAccountBtn} onClick={() => changeAuthMode('login')}>Войти</Button>
							</div>
						)}
					</div>
					{authMode === 'login' && (
						<>
							<div className={styles.authActions}>
								<div className={styles.authToggle}>
									<Button style='text-primary'
										onClick={() => changeAuthMode('register')}>
										Регистрация
									</Button>
									<Button style='text-primary'
										onClick={() => changeAuthMode('forgot')}>
										Забыл пароль
									</Button>
								</div>
							</div>
						</>
					)}
				</form>
			</Modal.Body>
		</Modal>
	)
}