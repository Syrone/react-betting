import React, { useState, useRef, useEffect } from 'react'
import { useFloating, offset, flip, shift, autoUpdate } from '@floating-ui/react'
import clsx from 'clsx'

import { Button } from '@components/Button/Button'
import Icon from '@components/Icon/Icon'
import Input from '@/components/Forms/Input/Input'
import ToggleInput from '@/components/Forms/ToggleInput/ToggleInput'

import styles from './Select.module.scss'

export interface Option {
	label: string
	value: string
	icon?: string
}

interface SelectProps {
	className?: string,
	options: Option[]
	multiple?: boolean
	withIcon?: boolean
	labelChanged?: boolean
	size?: string
	placeholder?: string
	searchPlaceholder?: string
	value?: string
	values?: string[]
	onChange?: (selected: Option | Option[] | null) => void
}

const Select: React.FC<SelectProps> = ({
	className,
	options,
	multiple = false,
	withIcon = false,
	labelChanged = false,
	size,
	placeholder = 'Placeholder',
	searchPlaceholder = 'Search Placeholder',
	value,
	values,
	onChange,
}) => {
	const [isOpen, setIsOpen] = useState(false)
	const [searchTerm, setSearchTerm] = useState('')
	const [pending, setPending] = useState<string[]>([])
	const [hasScroll, setHasScroll] = useState(false)
	const containerRef = useRef<HTMLDivElement>(null)
	const listRef = useRef<HTMLUListElement>(null)

	const {
		x,
		y,
		strategy,
		refs
	} = useFloating({
		placement: 'bottom-start',
		middleware: [offset(6), flip(), shift()],
		whileElementsMounted: autoUpdate,
	})

	const filtered = options.filter(option =>
		option.label.toLowerCase().includes(searchTerm.toLowerCase())
	)

	const toggleOpen = () => {
		setIsOpen(prev => !prev)
		if (!isOpen && multiple) {
			setPending(values || [])
			setSearchTerm('')
		}
	}

	const handleSingleSelect = (option: Option) => {
		onChange?.(option)
		setIsOpen(false)
	}

	const handleMultiToggle = (option: Option) => {
		setPending(prev =>
			prev.includes(option.value)
				? prev.filter(value => value !== option.value)
				: [...prev, option.value]
		)
	}

	const applyMulti = () => {
		const selected = options.filter(option => pending.includes(option.value))
		onChange?.(selected)
		setIsOpen(false)
	}

	const resetMulti = () => {
		setSearchTerm('')
		setPending([])
		onChange?.([])
	}

	useEffect(() => {
		if (listRef.current) {
			const el = listRef.current
			setHasScroll(el.scrollHeight > el.clientHeight)
		}
	}, [filtered, isOpen])

	useEffect(() => {
		const onClick = (e: MouseEvent) => {
			if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
				setIsOpen(false)
			}
		}
		const onKey = (e: KeyboardEvent) => {
			if (e.key === 'Escape') setIsOpen(false)
		}
		document.addEventListener('mousedown', onClick)
		document.addEventListener('keydown', onKey)
		return () => {
			document.removeEventListener('mousedown', onClick)
			document.removeEventListener('keydown', onKey)
		}
	}, [])

	return (
		<div
			className={clsx(
				styles.select,
				size && styles[`select-${size}`],
				className
			)}
			ref={containerRef}>
			<Button
				ref={refs.setReference}
				className={clsx(
					styles.selectButton,
					isOpen && styles.isActive
				)}
				style='dark'
				iconClassName={styles.selectButtonIcon}
				icon='arrowBottom'
				onClick={toggleOpen}>
				{labelChanged ? (
					<span className={styles.selectLabel}>
						{withIcon && !multiple && (
							<Icon
								className={styles.selectLabelIcon}
								name={options.find(opt => opt.value === value)?.icon || 'icon'}
							/>
						)}
						{multiple ? (
							values?.length
								? values
									.map(val => options.find(opt => opt.value === val)?.label)
									.filter(Boolean)
									.join(', ')
								: placeholder
						) : (
							options.find(opt => opt.value === value)?.label || placeholder
						)}
					</span>
				) : placeholder}
			</Button>
			{isOpen && (
				<div
					ref={refs.setFloating}
					className={clsx(
						styles.selectDropdown,
						multiple && styles.selectDropdownMultiple
					)}
					style={{
						position: strategy,
						top: y ?? '',
						left: x ?? '',
					}}>
					{options.length > 7 && (
						<Input
							type="text"
							prefixIcon='search'
							inputSize='md'
							containerClassName={styles.selectContainerSearch}
							inputPlaceholder={searchPlaceholder}
							value={searchTerm}
							onChange={e => setSearchTerm(e.target.value)} />
					)}

					<ul
						ref={listRef}
						className={clsx(
							styles.selectList,
							hasScroll && styles.hasScroll
						)}>
						{!filtered.length && (
							<li className={styles.selectListEmpty}>
								К сожалению не найдено
							</li>
						)}
						{filtered.map(option => (
							<li key={option.value} className={styles.selectOption}>
								{multiple ? (
									<label className={clsx(
										styles.selectLabel,
										value === option.value && styles.isActive
									)}>
										{option.icon && (
											<Icon
												className={styles.selectLabelIcon}
												name={option.icon} />
										)}
										<span className={styles.selectLabelText}>{option.label}</span>
										<ToggleInput
											className={styles.selectLabelCheckbox}
											wrapperOnly={true}
											checked={pending.includes(option.value)}
											onChange={() => handleMultiToggle(option)} />
									</label>
								) : (
									<Button
										className={styles.selectChoice}
										isActive={value === option.value}
										onClick={() => handleSingleSelect(option)}>
										{option.icon && (
											<Icon
												className={styles.selectLabelIcon}
												name={option.icon} />
										)}
										{option.label}
									</Button>
								)}
							</li>
						))}
					</ul>

					{multiple && (
						<div className={styles.selectActions}>
							<Button
								className={styles.selectAction}
								style='dark'
								size='md'
								onClick={resetMulti}>
								Сбросить
							</Button>
							<Button
								className={styles.selectAction}
								style='primary'
								size='md'
								onClick={applyMulti}>
								Применить
							</Button>
						</div>
					)}
				</div>
			)}
		</div>
	)
}

export default Select
