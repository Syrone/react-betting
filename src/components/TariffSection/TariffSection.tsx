import { useState, useEffect, type FormEvent } from 'react'
import { useSelector } from 'react-redux'

import { selectorAuth } from '@redux/auth/selectors'

import Auth, { type AuthMode } from '@components/Auth/Auth'
import Section from '@components/Section/Section'
import Tariff, { type TariffProps } from '@components/Tariff/Tariff'
import DashboardModal, { type DashboardModalMode } from '@components/Dashboard/DashboardModal'

import styles from './TariffSection.module.scss'

export const TARIFFS:TariffProps[] = [
	{
		subscription_id: 1,
		name: 'Basic',
		subname: 'Для знакомства с сервисом и понимания принципов работы',
		price: '0',
		list: [
			'Вилки с доходностью до 1%',
			'Ограниченный набор связок',
			'Обновления данных с задержкой',
		],
		chosen: true
	},
	{
		subscription_id: 2,
		label: 'Самый популярный',
		name: 'Premium',
		subname: 'Для тех, кто ценит эффективность и результат',
		price: '2999',
		list: [
			'Все вилки, включая высокодоходные',
			'Полный доступ ко всем связкам и событиям',
			'Прямые переходы на нужные исходы в БК',
			'Обновления данных без задержки',
			'Приоритетная поддержка',
		],
		chosen: false
	},
	{
		subscription_id: 3,
		name: 'Про плюс',
		subname: 'Для производственных приложений с возможностью масштабирования',
		price: '40',
		list: [
			'Unlimited API requests',
			'50,000 monthly active users',
			'500 MB database size',
			'5 GB bandwidth',
			'1 GB file storage',
			'Community support',
		],
		chosen: false,
		disabled: true
	},
]

type Props = {}

export default function Tariffs({}: Props) {
	const [authMode, setAuthMode] = useState<AuthMode>('login')
	const [authModalState, setAuthModalState] = useState<'closed' | 'opening' | 'open' | 'closing'>('closed')
	const [dashboardMode, setDashboardMode] = useState<DashboardModalMode>('subscription')
	const [dashboardState, setDashboardState] = useState<'closed' | 'opening' | 'open' | 'closing'>('closed')

	const [selectedTariff, setSelectedTariff] = useState<TariffProps | null>(null)

	const { isAuth } = useSelector(selectorAuth)

	const openAuthModal = (mode: AuthMode) => {
		setAuthMode(mode)
		setAuthModalState('opening')

		requestAnimationFrame(() => {
			setAuthModalState('open')
		})
	}

	const closeAuthModal = () => {
		setAuthModalState('closing')

		setTimeout(() => {
			setAuthModalState('closed')
		}, 300)
	}

	const openDashboardModal = (mode: DashboardModalMode, tariff: TariffProps) => {
		setDashboardMode(mode)
  	setSelectedTariff(tariff)
		setDashboardState('opening')

		requestAnimationFrame(() => {
			setDashboardState('open')
		})
	}

	const closeDashboardModal = () => {
		setDashboardState('closing')

		setTimeout(() => {
			setDashboardState('closed')
		}, 300)
	}

	const openModal = (tariff: TariffProps) => {
    if (isAuth) {
      openDashboardModal('subscription', tariff)
    } else {
      openAuthModal('login')
    }
  }

	return (
		<>
			<Section
				className={styles.tariffs}
				containerClassName={styles.tariffsContainer}>
				<h1 className='page-title'>
					Тарифы
				</h1>

				<ul className={styles.tariffsList}>
					{TARIFFS.map((item, i) => (
						<li key={i} className={styles.tariffsItem}>
							<Tariff 
								{...item}
								onOpenModal={() => openModal(item)}
								/>
						</li>
					))}
				</ul>
			</Section>

			<DashboardModal
				state={dashboardState}
				mode={dashboardMode}
				selectedTariff={selectedTariff}
				onClose={closeDashboardModal} />

			<Auth
        state={authModalState}
        mode={authMode}
        onClose={closeAuthModal}
      />
		</>
	)
}