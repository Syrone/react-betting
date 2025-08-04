import { useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'

import clsx from 'clsx'

import { useAppDispatch } from '@redux/store'
import { resetPassword } from '@redux/auth/slice'

import { Button } from '@components/Button/Button'
import { type IField } from '@components/Forms/IField'
import Error from '@components/Forms/Error/Error'
import Input from '@components/Forms/Input/Input'

import styles from './ResetPasswordForm.module.scss'

type Props = {
	token: string
}

interface IFormFields {
	password: IField<string>
}

export default function ResetPasswordForm({ token }: Props) {
	const navigate = useNavigate()
	const dispatch = useAppDispatch()

	const [formFields, setFormFields] = useState<IFormFields>({
		password: { value: '', isError: false, errorMessage: 'Пароль должен быть не короче 8 символов', touched: false },
	})
	const [formError, setFormError] = useState<string | null>(null)
	
	const validatePassword = (value: string) =>
		value.length >= 8 && value.length <= 30
			? null
			: formFields.password.errorMessage

	const runValidation = (): boolean => {
		const passwordError = validatePassword(formFields.password.value)

		const updates: Partial<IFormFields> = {}
		if (passwordError) updates.password = { ...formFields.password, isError: true, touched: true }

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
			if (name === 'password') error = validatePassword(field.value)
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

		if (!runValidation()) return

		try {
			await dispatch(resetPassword({ token, password: formFields.password.value })).unwrap()

			navigate('/')
		} catch (error: any) {
			setFormError(error.error?.detail || error.message || 'Произошла ошибка')
		}
	}

	return (
		<div className={styles.root}>
			<form className={styles.form} onSubmit={handleSubmit} noValidate>
				<div className={styles.header}>
					<h1 className={styles.title}>
						Восстановление пароля
					</h1>
				</div>
				<div className={styles.fields}>
					<Input
						type='password'
						containerClassName={clsx(
							styles.input
						)}
						name='password'
						autoComplete='new-password'
						inputPlaceholder='Новый пароль'
						inputError={formFields.password.errorMessage}
						isError={formFields.password.isError}
						value={formFields.password.value}
						onChange={handleChange('password')}
						onBlur={handleBlur('password')}
						required={true}
					/>
				</div>

				{formError && (
					<Error error={formError} />
				)}

				<div className={styles.actions}>
					<Button type='submit' size='base' style='primary'>
						Подтвердить
					</Button>
				</div>
			</form>
		</div>
	)
}