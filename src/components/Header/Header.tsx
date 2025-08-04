import { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import clsx from 'clsx'

import { useAppDispatch } from '@redux/store'
import { logoutUser } from '@redux/auth/slice'
import { selectorAuth } from '@redux/auth/selectors'

import useMediaQuery from '@hooks/useMediaQuery'

import Auth, { type AuthMode } from '@components/Auth/Auth'
import Brand from '@components/Brand/Brand'
import { Button, ButtonLink } from '@components/Button/Button'
import Dropdown, { type DropdownOption } from '@components/Dropdown/Dropdown'
import Offcanvas from '@components/Offcanvas/Offcanvas'

import styles from './Header.module.scss'

type Props = {}

const HEADER_NAV = [
	{ label: 'Букмекерские вилки', href: '/' },
	{ label: 'Коридоры', href: '/' },
	{ label: 'Ставки с перевесом', href: '/' },
	{ label: 'Тарифы', href: '/tariffs' },
]

export default function Header({ }: Props) {
	const dispatch = useAppDispatch()
	const { isAuth, user } = useSelector(selectorAuth)
	const [authMode, setAuthMode] = useState<AuthMode>('login')
	const [authModalState, setAuthModalState] = useState<'closed' | 'opening' | 'open' | 'closing'>('closed')
	const [offcanvasState, setOffcanvasState] = useState<'closed' | 'opening' | 'open' | 'closing'>('closed')
	const isDesktop = useMediaQuery('(min-width: 992px)')

	const NAV: DropdownOption[] = [
		{ label: 'Профиль', href: '/account' },
		{ label: 'Выход', href: '/', onClick: () => dispatch(logoutUser()) },
	]

	useEffect(() => {
		isDesktop && setOffcanvasState('closed')
	}, [isDesktop, offcanvasState])

	const openOffcanvas = () => {
		setOffcanvasState('opening')

		requestAnimationFrame(() => {
			setOffcanvasState('open')
		})
	}

	const closeOffcanvas = () => {
		setOffcanvasState('closing')

		setTimeout(() => {
			setOffcanvasState('closed')
		}, 300)
	}

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

	const navContent = (
		<nav className={styles.headerNav}>
			{HEADER_NAV.map((item) => (
				<ButtonLink
					key={item.label}
					href={item.href}
					className={styles.headerNavLink}
					onClick={closeOffcanvas}>
					{item.label}
				</ButtonLink>
			))}
		</nav>
	)

	const userBtns = (size?: 'sm' | 'base') => {
		return isAuth ? (
			<div className={styles.headerButtons}>
				<Dropdown label={user?.username ?? 'Пользователь'} options={NAV} />
			</div>
		) : (
			<div className={styles.headerButtons}>
				<Button style='primary' size={size} className={styles.headerButton} onClick={() => openAuthModal('login')}>
					Войти
				</Button>
				<Button style='outline-primary' size={size} className={styles.headerButton} onClick={() => openAuthModal('register')}>
					Регистрация
				</Button>
			</div>
		)
	}

	return (
		<>
			<header className={styles.header}>
				<div className={clsx(
					'container',
					styles.headerContainer
				)}>
					<Brand />

					{isDesktop && (
						<>
							{navContent}
							{userBtns('sm')}
						</>
					)}

					<Button
						className={styles.headerMenu}
						style='icon'
						icon='menu'
						onClick={offcanvasState === 'open' ? closeOffcanvas : openOffcanvas}
					/>
				</div>
			</header>

			<Offcanvas state={offcanvasState} onClose={closeOffcanvas}>
				<Offcanvas.Header>
					<Brand />
					<Button style='icon' icon='close' onClick={closeOffcanvas} />
				</Offcanvas.Header>
				<Offcanvas.Body>
					{navContent}
				</Offcanvas.Body>
				<Offcanvas.Footer>
					{userBtns('base')}
				</Offcanvas.Footer>
			</Offcanvas>

			<Auth
				state={authModalState}
				mode={authMode}
				onClose={closeAuthModal}
			/>
		</>
	)
}