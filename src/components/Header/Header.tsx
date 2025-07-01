import { useState, useEffect } from 'react'
import clsx from 'clsx'

import useMediaQuery from '../../hooks/useMediaQuery'

import Brand from '../Brand/Brand'
import { Button, ButtonLink } from '../Button/Button'
import Offcanvas from '../Offcanvas/Offcanvas'

import styles from './Header.module.scss'

type Props = {}

const HEADER_NAV = [
	{ label: 'Букмекерские вилки', href: '/' },
	{ label: 'Коридоры', href: '/' },
	{ label: 'Ставки с перевесом', href: '/' },
	{ label: 'Тарифы', href: '/tariffs' },
]

export default function Header({ }: Props) {
	const [offcanvasState, setOffcanvasState] = useState<'closed' | 'opening' | 'open' | 'closing'>('closed')
	const isDesktop = useMediaQuery('(min-width: 992px)')

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

	const authBtns = (size?: 'sm' | 'base') => (
		<div className={styles.headerButtons}>
			<Button style='primary' size={size} className={styles.headerButton}>Войти</Button>
			<Button style='outline-primary' size={size} className={styles.headerButton}>Регистрация</Button>
		</div>
	)

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
							{authBtns('sm')}
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
					{authBtns('base')}
				</Offcanvas.Footer>
			</Offcanvas>
		</>
	)
}