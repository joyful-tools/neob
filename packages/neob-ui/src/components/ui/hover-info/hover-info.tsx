import { motion } from 'motion/react';
import { useState, type HTMLAttributes, type ReactNode, type Ref } from 'react';

import { cn } from '@/lib/utilities';

export interface HoverInfoProperties extends Omit<
	HTMLAttributes<HTMLDivElement>,
	'children' | 'onAnimationStart' | 'onDrag' | 'onDragStart' | 'onDragEnd'
> {
	readonly ref?: Ref<HTMLDivElement>;
	readonly height?: string;
	readonly children: (props: { closed: boolean }) => ReactNode;
}

/**
 * HoverInfo is an expandable information card that opens smoothly on hover or keyboard focus.
 * It uses a render prop callback to toggle inner styles (e.g. text ellipsis nowrap) when open/closed.
 */
export function HoverInfo({ height = '2rem', className, children, ref, ...properties }: HoverInfoProperties) {
	const [open, setOpen] = useState(false);
	const [closed, setClosed] = useState(true);

	const handleOpenChange = (isOpen: boolean) => {
		setOpen(isOpen);
		if (isOpen) {
			setClosed(false);
		}
	};

	const handleBlur = (event: React.FocusEvent) => {
		// Only close if focus leaves the container entirely
		const relatedTarget = event.relatedTarget;
		if (!(relatedTarget instanceof Node) || !event.currentTarget.contains(relatedTarget)) {
			handleOpenChange(false);
		}
	};

	return (
		<div style={{ height }} className="relative w-full" ref={ref}>
			<motion.div
				tabIndex={0}
				onMouseEnter={() => handleOpenChange(true)}
				onMouseLeave={() => handleOpenChange(false)}
				onFocus={() => handleOpenChange(true)}
				onBlur={handleBlur}
				className={cn(
					'neo-focus-ring absolute inset-x-0 top-0 z-10 overflow-hidden rounded-md border-2 border-black bg-card outline-hidden transition-shadow duration-200',
					open ? 'shadow-cel-md' : 'shadow-cel-sm',
					className,
				)}
				initial={{ height }}
				animate={{ height: open ? 'auto' : height }}
				onAnimationComplete={() => {
					if (!open) {
						setClosed(true);
					}
				}}
				transition={{
					duration: 0.2,
					ease: 'easeInOut',
				}}
				{...properties}
			>
				{children({ closed })}
			</motion.div>
		</div>
	);
}
HoverInfo.displayName = 'HoverInfo';
