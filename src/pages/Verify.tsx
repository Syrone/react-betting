import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSearchParams } from 'react-router-dom'

import { useAppDispatch } from '@redux/store'
import { verify } from '@redux/auth/slice'

import Feedback from '@components/Feedback/Feedback'

type Props = {}

export default function Verify({ }: Props) {
	const navigate = useNavigate()
	const [searchParams] = useSearchParams()
	const token = searchParams.get('token') || ''

	const dispatch = useAppDispatch()

	const [verifyDone, setVerifyDone] = useState(false)
	const [error, setError] = useState<string | null>(null)

	useEffect(() => {
		if (!token) return

    dispatch(verify({ token }))
			.unwrap()
			.then(() => {
				navigate('/')
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
		<Feedback message='Успех!' />
	)
}