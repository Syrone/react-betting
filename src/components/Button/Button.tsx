
import React, { type ButtonHTMLAttributes, type AnchorHTMLAttributes, forwardRef } from "react"
import { Link } from 'react-router-dom'
import clsx from "clsx"

import Icon from "@components/Icon/Icon"

import styles from './Button.module.scss'

type BaseButtonProps = {
	className?: string;
	size?: string,
	btnStyle?: string,
	icon?: string;
	iconClassName?: string;
	children?: React.ReactNode;
	isActive?: boolean;
}

type ButtonProps = BaseButtonProps & ButtonHTMLAttributes<HTMLButtonElement> & {
	type?: 'button' | 'submit' | 'reset';
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
	(
		{
			type = 'button',
			className,
			size,
			btnStyle,
			icon,
			iconClassName,
			children,
			isActive = false,
			...rest
		},
		ref
	) => {
		return (
			<button
				ref={ref}
				type={type}
				className={clsx(
					styles.btn,
					className,
					size && styles[`btn-${size}`],
					btnStyle && styles[`btn-${btnStyle}`],
					isActive && styles['is-active'],
				)}
				{...rest}>
				{icon && <Icon name={icon} className={clsx(styles.icon, iconClassName && iconClassName)} />}
				{children}
			</button>
		)
	})
Button.displayName = 'Button'

export type ButtonLinkProps = BaseButtonProps &
	AnchorHTMLAttributes<HTMLAnchorElement> & {
		href?: string
	}

export const ButtonLink = forwardRef<HTMLAnchorElement, ButtonLinkProps>(
	(
		{
			href = '/',
			className,
			size,
			btnStyle,
			icon,
			iconClassName,
			children,
			isActive = false,
			...rest
		},
		ref
	) => {
		return (
			<Link
				ref={ref}
				to={href}
				className={clsx(
					styles.btn,
					className,
					size && styles[`btn-${size}`],
					btnStyle && styles[`btn-${btnStyle}`],
					isActive && styles['is-active'],
				)}
				{...rest}>
				{icon && <Icon name={icon} className={clsx(styles.icon, iconClassName)} />}
				{children}
			</Link>
		)
	})
ButtonLink.displayName = 'ButtonLink'

export const ButtonAnchor = forwardRef<HTMLAnchorElement, ButtonLinkProps>(
	(
		{
			href = '/',
			target,
			className,
			size,
			btnStyle,
			icon,
			iconClassName,
			children,
			isActive = false,
			...rest
		},
		ref
	) => {
		return (
			<a
				ref={ref}
				href={href}
				target={target}
				rel="noopener noreferrer"
				className={clsx(
					styles.btn,
					className,
					size && styles[`btn-${size}`],
					btnStyle && styles[`btn-${btnStyle}`],
					isActive && styles['is-active'],
				)}
				{...rest}>
				{icon && <Icon name={icon} className={clsx(styles.icon, iconClassName)} />}
				{children}
			</a>
		)
	}
)
ButtonAnchor.displayName = 'ButtonAnchor'