import { useYear } from '@hooks/useYear'

import Brand from '../Brand/Brand'
import { ButtonLink, ButtonAnchor } from '../Button/Button'

import styles from './Footer.module.scss'

const NAV = [
	{ label: 'Тарифы', href: '/tariffs' },
	{ label: 'Условия использования', href: '/terms' },
	{ label: 'Политика конфиденциальности', href: '/privacy' },
	{ label: 'Реферальная система', href: '/referrals' },
]

type Props = {}

export default function Footer({}: Props) {
	const currentYear = useYear()

	return (
		<footer className={styles.footer}>
			<div className='container'>
				<div className={styles.footerTop}>
					<div className={styles.footerBrand}>
						<Brand />
					</div>

					<nav className={styles.footerNav}>
						<ul className={styles.footerNavList}>
							{NAV.map((item, i) => (
								<li key={i} className={styles.footerNavItem}>
									<ButtonLink
										href={item.href}
										className={styles.footerNavLink}>
											{item.label}
									</ButtonLink>
								</li>
							))}
						</ul>
					</nav>

					<div className={styles.footerTopEnd}>
						<ul className={styles.footerContacts}>
							<li className={styles.footerContact}>
								<ButtonAnchor
									href='mailto:info@vilixbet.com'
									className={styles.footerContactLink}
									iconClassName={styles.footerContactLinkIcon}
									icon='email'>
									info@vilixbet.com
								</ButtonAnchor>
							</li>
							<li className={styles.footerContact}>
								<ButtonAnchor
									href='https://t.me/vilixbet'
									className={styles.footerContactLink}
									iconClassName={styles.footerContactLinkIcon}
									icon='telegram'>
									@vilixbet
								</ButtonAnchor>
							</li>
						</ul>
					</div>
				</div>
				<div className={styles.footerBottom}>
					<div className={styles.footerCopyright}>
						<p>
							{currentYear} VilixBet. Все права защищены. Не является букмекером.
						</p>
					</div>
				</div>
			</div>
		</footer>
	)
}