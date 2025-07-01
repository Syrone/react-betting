import React, { useState } from "react"
import {
	useFloating,
	useHover,
	useInteractions,
	FloatingArrow,
	offset,
	flip,
	shift,
	autoUpdate,
	arrow
} from '@floating-ui/react'

import styles from './Tooltip.module.scss'

type TooltipProps = {
	children: React.ReactNode
	content: React.ReactNode
	placement?: "top" | "bottom" | "left" | "right"
	offsetValue?: number
}

const ARROW_HEIGHT = 6

const Tooltip: React.FC<TooltipProps> = ({
	children,
	content,
	placement = "top",
	offsetValue = 2,
}) => {
	const [open, setOpen] = useState(false)
	const arrowRef = React.useRef(null)

	const {
		x,
		y,
		strategy,
		context,
		refs
	} = useFloating({
		open,
		onOpenChange: setOpen,
		placement,
		middleware: [
			offset(ARROW_HEIGHT + offsetValue),
			flip(),
			shift(),
			arrow({
				element: arrowRef,
			})
		],
		whileElementsMounted: autoUpdate,
	})

	const hover = useHover(context, { move: false })

	const { getReferenceProps, getFloatingProps } = useInteractions([
		hover,
	])

	return (
		<>
			<div
				ref={refs.setReference}
				{...getReferenceProps()}
				className={styles.tooltipTrigger}>
				{children}
			</div>
			{open && (
				<div
					ref={refs.setFloating}
					className={styles.tooltip}
					style={{
						position: strategy,
						top: y ?? '',
						left: x ?? '',
					}}
					{...getFloatingProps()}
				>
					<FloatingArrow
						ref={arrowRef}
						context={context}
						strokeWidth={1}
						fill='var(--_tooltip-bg)' />
					<div className={styles.tooltipContent}>
						{content}
					</div>
				</div>
			)}
		</>
	)
}

export default Tooltip