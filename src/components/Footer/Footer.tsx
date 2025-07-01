import Brand from '../Brand/Brand'
import { ButtonLink, ButtonAnchor } from '../Button/Button'

import styles from './Footer.module.scss'

const NAV = [
	{ label: 'О нас', href: '#' },
	{ label: 'Тарифы', href: '#' },
	{ label: 'FAQ', href: '#' },
	{ label: 'API', href: '#' },
	{ label: 'Поддержка', href: '#' },
	{ label: 'Условия', href: '#' },
	{ label: 'Политика', href: '#' },
]

type Props = {}

export default function Footer({}: Props) {
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
									href='mailto:template@logo.ru'
									className={styles.footerContactLink}
									iconClassName={styles.footerContactLinkIcon}
									icon='email'>
									template@logo.ru
								</ButtonAnchor>
							</li>
							<li className={styles.footerContact}>
								<ButtonAnchor
									href='#'
									className={styles.footerContactLink}
									iconClassName={styles.footerContactLinkIcon}
									icon='telegram'>
									@template
								</ButtonAnchor>
							</li>
						</ul>
					</div>
				</div>
				<div className={styles.footerBottom}>
					<div className={styles.footerCopyright}>
						<p>
							2025 ForkScan. Все права защищены. Не является букмекером.
						</p>
					</div>
				</div>
			</div>
		</footer>
	)
}