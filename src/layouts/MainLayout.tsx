import { useState, useEffect } from 'react'
import { Outlet } from 'react-router'

import useCookie from '../hooks/useCookie'

import { type AlertState } from '../components/Alert/Alert'

import Header from '../components/Header/Header'
import Footer from '../components/Footer/Footer'
import Alert from '../components/Alert/Alert'

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
						„ООО «Фрешсел» обрабатывает cookies с целью персонализации сервисов и чтобы пользоваться веб-сайтом было удобнее.
						Вы можете запретить обработку сookies в настройках браузера. Пожалуйста, ознакомьтесь с политикой использования cookies. Читайте подробнее о правилах оказания услуг ООО «Фрешсел».
					</p>
				</Alert>
			</main>
			<Footer />
		</>
	)
}

export default MainLayout