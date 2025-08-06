import { useState, useEffect } from 'react'
import { Outlet } from 'react-router'

import useCookie from '@hooks/useCookie'

import { type AlertState } from '@components/Alert/Alert'

import Header from '@components/Header/Header'
import Footer from '@components/Footer/Footer'
import Alert from '@components/Alert/Alert'
import { ButtonLink } from '@components/Button/Button'

type Props = {}

function MainLayout({ }: Props) {
	const [alertState, setAlertState] = useState<AlertState>('closed')
	const cookie = useCookie('cookieAccepted')

	useEffect(() => {
		if (!cookie.get()) {
			setAlertState('opening')
			setTimeout(() => setAlertState('open'), 10)
		}
	}, [])

	const handleClose = () => {
		setAlertState('closing')
		setTimeout(() => {
			setAlertState('closed')
			cookie.set('true')
		}, 300)
	}

	return (
		<>
			<Header />
			<main>
				<div className='content'>
					<Outlet />
				</div>

				<Alert state={alertState} type='cookie' onClose={handleClose}>
					<p>
						Сайт использует файлы cookie для анализа поведения пользователей и улучшения работы сайта.
						<br />
						Продолжая использовать сайт, вы соглашаетесь с использованием файлов cookie в соответствии с нашей <ButtonLink href='/privacy' btnStyle='link'>Политикой использования cookie</ButtonLink>.
					</p>
				</Alert>
			</main>
			<Footer />
		</>
	)
}

export default MainLayout