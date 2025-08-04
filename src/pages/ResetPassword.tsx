import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'

import { useAppDispatch } from '@redux/store'
import { resetPasswordVerify } from '@redux/auth/slice'

import Feedback from '@components/Feedback/Feedback'
import ResetPasswordForm from '@components/ResetPasswordForm/ResetPasswordForm'

type Props = {}

export default function ResetPassword({ }: Props) {
	const [searchParams] = useSearchParams()
	const token = searchParams.get('token') || ''

	const dispatch = useAppDispatch()

	const [verifyDone, setVerifyDone] = useState(false)
	const [error, setError] = useState<string | null>(null)

	useEffect(() => {
		if (!token) return

    dispatch(resetPasswordVerify({ token }))
			.unwrap()
			.then(() => {
				setVerifyDone(true)
				setError(null)
			})
			.catch((err) => {
				setVerifyDone(true)
				setError(`Error verifying token: ${err.message}` || 'Error verifying token')
			})
		}, [token, dispatch])

	if (!token) {
		return <Feedback message='Invalid password reset link, no token provided.' />
	}

	if (!verifyDone) {
		return <Feedback message='Verifying token...' />
	}

	if (error) {
		return <Feedback message={error} />
	}

	return (
		<ResetPasswordForm token={token} />
	)
}