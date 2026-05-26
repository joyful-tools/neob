import { Tooltip as BaseTooltip } from '@base-ui/react/tooltip';
import { AnimatePresence, motion, type Transition } from 'motion/react';
import * as React from 'react';
import { useCallback, useEffect, useRef, useState } from 'react';

import { cn } from '@/lib/utilities';

let lastInteractionWasTouch = false;

if (typeof document !== 'undefined') {
	document.addEventListener(
		'touchstart',
		() => {
			lastInteractionWasTouch = true;
		},
		{ passive: true, capture: true },
	);
	document.addEventListener(
		'pointermove',
		(event: PointerEvent) => {
			if (event.pointerType !== 'touch') {
				lastInteractionWasTouch = false;
			}
		},
		{ passive: true },
	);
}

const LONG_PRESS_DURATION = 700;

function useTouchGatedTooltip() {
	const [open, setOpen] = useState(false);
	const longPressTimerReference = useRef<ReturnType<typeof setTimeout>>(undefined);
	const longPressFiredReference = useRef(false);
	const mountedReference = useRef(false);

	useEffect(() => {
		const frame = requestAnimationFrame(() => {
			mountedReference.current = true;
		});
		return () => cancelAnimationFrame(frame);
	}, []);

	const onTriggerTouchStart = useCallback(() => {
		longPressFiredReference.current = false;
		longPressTimerReference.current = setTimeout(() => {
			longPressFiredReference.current = true;
			setOpen(true);
		}, LONG_PRESS_DURATION);
	}, []);

	const cancelLongPress = useCallback(() => {
		clearTimeout(longPressTimerReference.current);
	}, []);

	useEffect(() => {
		return () => clearTimeout(longPressTimerReference.current);
	}, []);

	const onOpenChange = useCallback(
		(nextOpen: boolean) => {
			if (nextOpen) {
				if (!mountedReference.current) return;
				if (!lastInteractionWasTouch || longPressFiredReference.current) {
					setOpen(true);
				}
			} else {
				longPressFiredReference.current = false;
				setOpen(false);
			}
		},
		[setOpen],
	);

	return { open, onOpenChange, onTriggerTouchStart, cancelLongPress };
}

interface TooltipProperties {
	children?: React.ReactElement<Record<string, unknown>>;
	content?: React.ReactNode;
	side?: 'top' | 'right' | 'bottom' | 'left';
	delayDuration?: number;
	className?: string;
	forceOpen?: boolean;
}

export function TooltipProvider({ children }: { children: React.ReactNode }) {
	return <BaseTooltip.Provider delay={300}>{children}</BaseTooltip.Provider>;
}

const springSnappy: Transition = {
	type: 'spring',
	stiffness: 500,
	damping: 30,
};

const tooltipVariants = {
	hidden: { opacity: 0, scale: 0.92 },
	visible: { opacity: 1, scale: 1 },
	exit: { opacity: 0, scale: 0.92 },
};

export function Tooltip({ children, content, side = 'top', delayDuration, className, forceOpen = false }: TooltipProperties) {
	const { open, onOpenChange, onTriggerTouchStart, cancelLongPress } = useTouchGatedTooltip();
	const isOpen = forceOpen || open;

	const handleOpenChange = useCallback(
		(nextOpen: boolean) => {
			if (forceOpen) return;
			onOpenChange(nextOpen);
		},
		[forceOpen, onOpenChange],
	);

	if (!children) return null;

	return (
		<BaseTooltip.Root open={isOpen} onOpenChange={handleOpenChange}>
			<BaseTooltip.Trigger
				delay={delayDuration}
				onTouchStart={onTriggerTouchStart}
				onTouchEnd={cancelLongPress}
				onTouchMove={cancelLongPress}
				render={children}
			/>
			<AnimatePresence>
				{isOpen && (
					<BaseTooltip.Portal keepMounted>
						<BaseTooltip.Positioner side={side} sideOffset={6} className="z-100">
							<BaseTooltip.Popup
								role="tooltip"
								render={<motion.div variants={tooltipVariants} initial="hidden" animate="visible" exit="exit" transition={springSnappy} />}
								className={cn(
									`rounded-full border-2 border-black bg-white px-4 py-1.5 text-xs font-bold text-black shadow-sm select-none dark:bg-zinc dark:text-white`,
									className,
								)}
							>
								{content}
								<BaseTooltip.Arrow className="fill-black" />
							</BaseTooltip.Popup>
						</BaseTooltip.Positioner>
					</BaseTooltip.Portal>
				)}
			</AnimatePresence>
		</BaseTooltip.Root>
	);
}
